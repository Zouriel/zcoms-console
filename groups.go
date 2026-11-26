package main

import (
	"errors"
	"fmt"
	"mime"
	"net/http"
	"regexp"
	"sort"
	"strconv"
	"strings"
	"sync"
	"unicode"

	agentclient "github.com/Zouriel/zcoms-agent/client"
	"github.com/Zouriel/zcoms/client"
)

// Groups tab. Group rows come from the daemon's registry (GroupList syncs it
// per transport) merged with the agent's group policies. Every write goes out
// as an owner command line on agent.sock (`group …`, `project …`) or as an owner
// group op on daemon.sock. Project paths are never taken from the browser: the
// client names a project by id and the path is looked up in the agent's
// Projects() list.

// groupTransports are the transports that have groups, in display order.
var groupTransports = []string{"telegram", "whatsapp"}

var (
	telegramGroupID = regexp.MustCompile(`^-?[0-9]{1,20}$`)
	whatsappGroupID = regexp.MustCompile(`^[0-9-]{1,64}@g\.us$`)

	telegramMemberID = regexp.MustCompile(`^[0-9]{1,20}$`)
	whatsappMemberID = regexp.MustCompile(`^[0-9]{1,32}(:[0-9]{1,4})?@(s\.whatsapp\.net|lid)$`)
)

// groupRow is one group in the merged view. Kind is "off" when the agent has
// no policy for it, else general, tasks (task tracking on, no repo in its
// folder yet) or project. Folder is the bound folder of a tasks or project
// group; Tracked says it came from the Track tasks toggle. InRegistry is false for a policy whose group the daemon did
// not list (its transport is down, or the account left the group).
type groupRow struct {
	Transport   string `json:"transport"`
	NativeID    string `json:"native_id"`
	Name        string `json:"name"`
	Kind        string `json:"kind"`
	ProjectID   int64  `json:"project_id,omitempty"`
	ProjectPath string `json:"project_path,omitempty"`
	Folder      string `json:"folder,omitempty"`
	Tracked     bool   `json:"tracked,omitempty"`
	Listen      bool   `json:"listen"`
	Follow      bool   `json:"follow"`
	LastCall    int64  `json:"last_call,omitempty"`
	InRegistry  bool   `json:"in_registry"`
}

// groupsView is the GET /api/groups body. Errors maps a transport to why its
// group list could not be read, so one transport being down does not hide the
// other.
type groupsView struct {
	Groups []groupRow        `json:"groups"`
	Errors map[string]string `json:"errors"`
}

// requireJSON refuses a mutating request that is not a JSON body. A cross-site
// form post cannot set this content type without a CORS preflight, which this
// server never answers, so it backs up the SameSite session cookie.
func requireJSON(w http.ResponseWriter, r *http.Request) bool {
	mt, _, err := mime.ParseMediaType(r.Header.Get("Content-Type"))
	if err != nil || mt != "application/json" {
		writeErr(w, http.StatusUnsupportedMediaType, errors.New("content type must be application/json"))
		return false
	}
	return true
}

// quoteArg double-quotes a value for the agent's quote-aware command splitter,
// escaping backslashes and double quotes.
func quoteArg(s string) string {
	return `"` + strings.NewReplacer(`\`, `\\`, `"`, `\"`).Replace(s) + `"`
}

// cleanText trims s and rejects it when empty, longer than max runes or
// carrying control characters (a newline would end the agent command line).
func cleanText(field, s string, max int) (string, error) {
	s = strings.TrimSpace(s)
	if s == "" {
		return "", fmt.Errorf("%s is required", field)
	}
	if len([]rune(s)) > max {
		return "", fmt.Errorf("%s is too long (max %d)", field, max)
	}
	for _, r := range s {
		if unicode.IsControl(r) {
			return "", fmt.Errorf("%s has a control character", field)
		}
	}
	return s, nil
}

// validGroup checks the transport enum and the native id shape for it.
func validGroup(transport, nativeID string) error {
	switch transport {
	case "telegram":
		if !telegramGroupID.MatchString(nativeID) {
			return errors.New("bad telegram group id")
		}
	case "whatsapp":
		if !whatsappGroupID.MatchString(nativeID) {
			return errors.New("bad whatsapp group id")
		}
	default:
		return errors.New("transport must be telegram or whatsapp")
	}
	return nil
}

// handleGroupsList returns every group on both transports merged with the
// agent's policies.
func (s *Server) handleGroupsList(w http.ResponseWriter, r *http.Request) {
	ps, err := s.agent.GroupPolicies()
	if err != nil {
		writeErr(w, http.StatusBadGateway, err)
		return
	}
	lists := make([][]client.Group, len(groupTransports))
	errs := make([]error, len(groupTransports))
	var wg sync.WaitGroup
	for i, tp := range groupTransports {
		wg.Add(1)
		go func() {
			defer wg.Done()
			lists[i], errs[i] = s.comms.GroupList(tp)
		}()
	}
	wg.Wait()

	view := groupsView{Groups: []groupRow{}, Errors: map[string]string{}}
	index := map[string]int{}
	for i, tp := range groupTransports {
		if errs[i] != nil {
			view.Errors[tp] = errs[i].Error()
			continue
		}
		for _, g := range lists[i] {
			index[tp+"\x00"+g.NativeID] = len(view.Groups)
			view.Groups = append(view.Groups, groupRow{
				Transport: tp, NativeID: g.NativeID, Name: g.Name, Kind: "off",
				Listen: g.Listen, Follow: g.Follow, InRegistry: true,
			})
		}
	}
	for _, p := range ps {
		i, ok := index[p.Transport+"\x00"+p.NativeID]
		if !ok {
			i = len(view.Groups)
			view.Groups = append(view.Groups, groupRow{Transport: p.Transport, NativeID: p.NativeID, Name: p.Name})
		}
		row := &view.Groups[i]
		row.Kind, row.ProjectID, row.ProjectPath, row.LastCall = p.Kind, p.ProjectID, p.ProjectPath, p.LastCall
		row.Folder, row.Tracked = p.Folder, p.Tracked
		if row.Folder == "" {
			row.Folder = p.ProjectPath
		}
		if row.Name == "" {
			row.Name = p.Name
		}
	}
	sort.SliceStable(view.Groups, func(a, b int) bool {
		ga, gb := view.Groups[a], view.Groups[b]
		if ga.Transport != gb.Transport {
			return ga.Transport > gb.Transport // telegram before whatsapp
		}
		return strings.ToLower(ga.Name) < strings.ToLower(gb.Name)
	})
	writeJSON(w, http.StatusOK, view)
}

// handleGroupPolicy turns a general group on or off.
func (s *Server) handleGroupPolicy(w http.ResponseWriter, r *http.Request) {
	if !requireJSON(w, r) {
		return
	}
	var body struct {
		Transport string `json:"transport"`
		NativeID  string `json:"native_id"`
		On        bool   `json:"on"`
	}
	if !decode(w, r, &body) {
		return
	}
	if err := validGroup(body.Transport, body.NativeID); err != nil {
		writeErr(w, http.StatusBadRequest, err)
		return
	}
	verb := "off"
	if body.On {
		verb = "on"
	}
	s.agentCmd(w, "group "+verb+" "+body.Transport+" "+quoteArg(body.NativeID))
}

// handleGroupTrack turns task tracking on or off for a group. Off keeps the
// folder and history unless purge is set; purge with on is refused.
func (s *Server) handleGroupTrack(w http.ResponseWriter, r *http.Request) {
	if !requireJSON(w, r) {
		return
	}
	var body struct {
		Transport string `json:"transport"`
		NativeID  string `json:"native_id"`
		On        bool   `json:"on"`
		Purge     bool   `json:"purge"`
	}
	if !decode(w, r, &body) {
		return
	}
	if err := validGroup(body.Transport, body.NativeID); err != nil {
		writeErr(w, http.StatusBadRequest, err)
		return
	}
	if body.On && body.Purge {
		writeErr(w, http.StatusBadRequest, errors.New("purge only goes with turning tracking off"))
		return
	}
	verb := "off"
	if body.On {
		verb = "on"
	}
	line := "group track " + verb + " " + body.Transport + " " + quoteArg(body.NativeID)
	if body.Purge {
		line += " --purge"
	}
	s.agentCmd(w, line)
}

// contactAddresses maps contact ids to each contact's address on transport.
func (s *Server) contactAddresses(transport string, ids []int64) ([]string, error) {
	if len(ids) == 0 {
		return nil, errors.New("pick at least one contact")
	}
	if len(ids) > 200 {
		return nil, errors.New("too many contacts")
	}
	cs, err := s.comms.ListContacts()
	if err != nil {
		return nil, err
	}
	byID := make(map[int64]client.Contact, len(cs))
	for _, c := range cs {
		byID[c.ID] = c
	}
	out := make([]string, 0, len(ids))
	for _, id := range ids {
		c, ok := byID[id]
		if !ok {
			return nil, fmt.Errorf("no contact %d", id)
		}
		addr := c.Address(transport)
		if addr == "" {
			return nil, fmt.Errorf("%s has no %s address", c.Name, transport)
		}
		out = append(out, addr)
	}
	return out, nil
}

// handleGroupCreate creates a group from saved contacts. The daemon adds the
// owner as well; when only that step fails the group still exists and the
// reply carries a warning.
func (s *Server) handleGroupCreate(w http.ResponseWriter, r *http.Request) {
	if !requireJSON(w, r) {
		return
	}
	var body struct {
		Transport  string  `json:"transport"`
		Name       string  `json:"name"`
		ContactIDs []int64 `json:"contact_ids"`
	}
	if !decode(w, r, &body) {
		return
	}
	if body.Transport != "telegram" && body.Transport != "whatsapp" {
		writeErr(w, http.StatusBadRequest, errors.New("transport must be telegram or whatsapp"))
		return
	}
	name, err := cleanText("name", body.Name, 128)
	if err != nil {
		writeErr(w, http.StatusBadRequest, err)
		return
	}
	members, err := s.contactAddresses(body.Transport, body.ContactIDs)
	if err != nil {
		writeErr(w, http.StatusBadRequest, err)
		return
	}
	g, err := s.comms.GroupCreate(body.Transport, name, members)
	if err != nil && g == nil {
		writeErr(w, http.StatusBadGateway, err)
		return
	}
	resp := map[string]any{"group": g}
	if err != nil {
		resp["warning"] = err.Error()
	}
	writeJSON(w, http.StatusOK, resp)
}

// handleGroupAddMembers adds saved contacts to an existing group.
func (s *Server) handleGroupAddMembers(w http.ResponseWriter, r *http.Request) {
	if !requireJSON(w, r) {
		return
	}
	var body struct {
		Transport  string  `json:"transport"`
		NativeID   string  `json:"native_id"`
		ContactIDs []int64 `json:"contact_ids"`
	}
	if !decode(w, r, &body) {
		return
	}
	if err := validGroup(body.Transport, body.NativeID); err != nil {
		writeErr(w, http.StatusBadRequest, err)
		return
	}
	members, err := s.contactAddresses(body.Transport, body.ContactIDs)
	if err != nil {
		writeErr(w, http.StatusBadRequest, err)
		return
	}
	if err := s.comms.GroupAdd(body.Transport, body.NativeID, members); err != nil {
		writeErr(w, http.StatusBadGateway, err)
		return
	}
	writeJSON(w, http.StatusOK, map[string]bool{"ok": true})
}

// groupQuery reads and validates the transport and id query parameters.
func groupQuery(w http.ResponseWriter, r *http.Request) (string, string, bool) {
	tp, id := r.URL.Query().Get("transport"), r.URL.Query().Get("id")
	if err := validGroup(tp, id); err != nil {
		writeErr(w, http.StatusBadRequest, err)
		return "", "", false
	}
	return tp, id, true
}

// memberRow is a group member with their role: "write" for the owner
// (fixed) and members the owner promoted, "read" otherwise, "" for the
// agent's own account or when the agent could not be asked.
type memberRow struct {
	client.GroupMember
	Role string `json:"role,omitempty"`
}

// handleGroupMembers lists a group's members with their roles.
func (s *Server) handleGroupMembers(w http.ResponseWriter, r *http.Request) {
	tp, id, ok := groupQuery(w, r)
	if !ok {
		return
	}
	ms, err := s.comms.GroupMembers(tp, id)
	if err != nil {
		writeErr(w, http.StatusBadGateway, err)
		return
	}
	roles, rerr := s.agent.GroupRoles(tp, id)
	out := make([]memberRow, 0, len(ms))
	for _, m := range ms {
		row := memberRow{GroupMember: m}
		switch {
		case m.IsSelf:
		case m.IsOwner:
			row.Role = "write"
		case rerr == nil && roles[m.ID] == "write":
			row.Role = "write"
		case rerr == nil:
			row.Role = "read"
		}
		out = append(out, row)
	}
	writeJSON(w, http.StatusOK, out)
}

// handleGroupRole sets one member's role in a group. The agent refuses the
// owner (always write), its own account and anyone not in the group.
func (s *Server) handleGroupRole(w http.ResponseWriter, r *http.Request) {
	if !requireJSON(w, r) {
		return
	}
	var body struct {
		Transport string `json:"transport"`
		NativeID  string `json:"native_id"`
		MemberID  string `json:"member_id"`
		Role      string `json:"role"`
	}
	if !decode(w, r, &body) {
		return
	}
	if err := validGroup(body.Transport, body.NativeID); err != nil {
		writeErr(w, http.StatusBadRequest, err)
		return
	}
	re := telegramMemberID
	if body.Transport == "whatsapp" {
		re = whatsappMemberID
	}
	if !re.MatchString(body.MemberID) {
		writeErr(w, http.StatusBadRequest, errors.New("bad member id"))
		return
	}
	if body.Role != "read" && body.Role != "write" {
		writeErr(w, http.StatusBadRequest, errors.New("role must be read or write"))
		return
	}
	s.agentCmd(w, "group role "+body.Transport+" "+quoteArg(body.NativeID)+" "+quoteArg(body.MemberID)+" "+body.Role)
}

// handleGroupMessages returns a group's latest 50 messages, read as the owner.
func (s *Server) handleGroupMessages(w http.ResponseWriter, r *http.Request) {
	tp, id, ok := groupQuery(w, r)
	if !ok {
		return
	}
	msgs, err := s.comms.GroupRead(tp, id, client.GroupReadOpts{Limit: 50})
	if err != nil {
		writeErr(w, http.StatusBadGateway, err)
		return
	}
	if msgs == nil {
		msgs = []client.GroupMessage{}
	}
	writeJSON(w, http.StatusOK, msgs)
}

// handleProjectsList returns every bound project.
func (s *Server) handleProjectsList(w http.ResponseWriter, r *http.Request) {
	ps, err := s.agent.Projects()
	if err != nil {
		writeErr(w, http.StatusBadGateway, err)
		return
	}
	if ps == nil {
		ps = []agentclient.ProjectInfo{}
	}
	writeJSON(w, http.StatusOK, ps)
}

// projectID parses the {id} path value as a positive number.
func projectID(w http.ResponseWriter, r *http.Request) (int64, bool) {
	id, err := strconv.ParseInt(r.PathValue("id"), 10, 64)
	if err != nil || id <= 0 {
		writeErr(w, http.StatusBadRequest, errors.New("project id must be a positive number"))
		return 0, false
	}
	return id, true
}

// handleProjectDetail returns one project's members, open tasks and summaries.
func (s *Server) handleProjectDetail(w http.ResponseWriter, r *http.Request) {
	id, ok := projectID(w, r)
	if !ok {
		return
	}
	d, err := s.agent.ProjectDetail(id)
	if err != nil {
		writeErr(w, http.StatusBadGateway, err)
		return
	}
	if d.Members == nil {
		d.Members = []agentclient.ProjectMember{}
	}
	if d.OpenTasks == nil {
		d.OpenTasks = []agentclient.ProjectTask{}
	}
	if d.Summaries == nil {
		d.Summaries = []agentclient.ProjectSummary{}
	}
	writeJSON(w, http.StatusOK, d)
}

// projectPath resolves a project id to its bound path from the agent's own
// list, so the browser never supplies a filesystem path.
func (s *Server) projectPath(w http.ResponseWriter, r *http.Request) (int64, string, bool) {
	id, ok := projectID(w, r)
	if !ok {
		return 0, "", false
	}
	ps, err := s.agent.Projects()
	if err != nil {
		writeErr(w, http.StatusBadGateway, err)
		return 0, "", false
	}
	for _, p := range ps {
		if p.ID == id {
			return id, p.Path, true
		}
	}
	writeErr(w, http.StatusNotFound, fmt.Errorf("no project %d", id))
	return 0, "", false
}

// projectCmd sends `project <sub> --path <path> -- <args…>` to the agent. The
// "--" keeps a member or alias that starts with dashes from reading as a flag.
func (s *Server) projectCmd(w http.ResponseWriter, path, sub string, flags []string, args ...string) {
	line := "project " + sub + " --path " + quoteArg(path)
	for _, f := range flags {
		line += " " + f
	}
	if len(args) > 0 {
		line += " --"
		for _, a := range args {
			line += " " + quoteArg(a)
		}
	}
	s.agentCmd(w, line)
}

// handleProjectStatus returns the agent's status text for a project.
func (s *Server) handleProjectStatus(w http.ResponseWriter, r *http.Request) {
	_, path, ok := s.projectPath(w, r)
	if !ok {
		return
	}
	s.projectCmd(w, path, "status", nil)
}

// handleProjectAlias adds or removes a member alias.
func (s *Server) handleProjectAlias(w http.ResponseWriter, r *http.Request) {
	if !requireJSON(w, r) {
		return
	}
	var body struct {
		Op     string `json:"op"`
		Member string `json:"member"`
		Alias  string `json:"alias"`
	}
	if !decode(w, r, &body) {
		return
	}
	if body.Op != "add" && body.Op != "rm" {
		writeErr(w, http.StatusBadRequest, errors.New("op must be add or rm"))
		return
	}
	member, err := cleanText("member", body.Member, 128)
	if err != nil {
		writeErr(w, http.StatusBadRequest, err)
		return
	}
	alias, err := cleanText("alias", body.Alias, 64)
	if err != nil {
		writeErr(w, http.StatusBadRequest, err)
		return
	}
	_, path, ok := s.projectPath(w, r)
	if !ok {
		return
	}
	s.projectCmd(w, path, "alias", nil, body.Op, member, alias)
}

// handleProjectTask closes, drops or assigns one task. An assignee must be a
// recorded member of the project.
func (s *Server) handleProjectTask(w http.ResponseWriter, r *http.Request) {
	if !requireJSON(w, r) {
		return
	}
	var body struct {
		Member string `json:"member"`
	}
	if !decode(w, r, &body) {
		return
	}
	action := r.PathValue("action")
	if action != "done" && action != "drop" && action != "assign" {
		writeErr(w, http.StatusBadRequest, errors.New("action must be done, drop or assign"))
		return
	}
	task, err := strconv.ParseInt(r.PathValue("task"), 10, 64)
	if err != nil || task <= 0 {
		writeErr(w, http.StatusBadRequest, errors.New("task id must be a positive number"))
		return
	}
	id, path, ok := s.projectPath(w, r)
	if !ok {
		return
	}
	args := []string{action, strconv.FormatInt(task, 10)}
	if action == "assign" {
		d, err := s.agent.ProjectDetail(id)
		if err != nil {
			writeErr(w, http.StatusBadGateway, err)
			return
		}
		found := false
		for _, m := range d.Members {
			if m.Name == body.Member {
				found = true
				break
			}
		}
		if !found || body.Member == "" {
			writeErr(w, http.StatusBadRequest, errors.New("assignee must be a member of the project"))
			return
		}
		args = append(args, body.Member)
	}
	s.projectCmd(w, path, "tasks", nil, args...)
}

// handleProjectFollow turns task following on or off.
func (s *Server) handleProjectFollow(w http.ResponseWriter, r *http.Request) {
	if !requireJSON(w, r) {
		return
	}
	var body struct {
		On bool `json:"on"`
	}
	if !decode(w, r, &body) {
		return
	}
	_, path, ok := s.projectPath(w, r)
	if !ok {
		return
	}
	v := "off"
	if body.On {
		v = "on"
	}
	s.projectCmd(w, path, "follow", nil, v)
}

// handleProjectStandup runs the project's standup now.
func (s *Server) handleProjectStandup(w http.ResponseWriter, r *http.Request) {
	if !requireJSON(w, r) {
		return
	}
	_, path, ok := s.projectPath(w, r)
	if !ok {
		return
	}
	s.projectCmd(w, path, "standup", nil, "now")
}

// handleProjectRemove unbinds a project, optionally purging its history.
func (s *Server) handleProjectRemove(w http.ResponseWriter, r *http.Request) {
	if !requireJSON(w, r) {
		return
	}
	var body struct {
		Purge bool `json:"purge"`
	}
	if !decode(w, r, &body) {
		return
	}
	_, path, ok := s.projectPath(w, r)
	if !ok {
		return
	}
	var flags []string
	if body.Purge {
		flags = append(flags, "--purge")
	}
	s.projectCmd(w, path, "remove", flags)
}
