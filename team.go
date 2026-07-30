package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"strings"

	"github.com/Zouriel/zcoms/client"
)

// Team admin surface. The console owns no team state: every call is proxied to
// the zcoms-team module over team.sock (the same socket `zc team …` drives),
// which owns team.db.
//
// Reads go through the module's `json …` verbs, which answer with stable field
// names. Writes use the human verbs and the reply is shown verbatim, the same
// split commerce.go uses. team is an agent-tier module and may not be running,
// so every handler degrades to a clear "module not running" error.

const teamActor = "@owner"

// team runs one module verb and returns its reply, distinguishing "not running"
// from a real error so the UI can prompt to start it.
func (s *Server) team(verb string) (string, error) {
	res, err := client.ModuleCommand("team.sock", verb, teamActor)
	if !res.Running {
		return "", fmt.Errorf("team module isn't running — start it with `systemctl --user start zcoms-team`")
	}
	if err != nil {
		return "", err
	}
	return res.Reply, nil
}

// teamRead runs a `json …` verb and forwards the parsed document. The module
// always answers these with JSON, so a non-JSON reply means the verb errored and
// is surfaced as text rather than silently rendering as empty.
func (s *Server) teamRead(w http.ResponseWriter, verb string) {
	reply, err := s.team("json " + verb)
	if err != nil {
		writeErr(w, http.StatusBadGateway, err)
		return
	}
	var parsed any
	if err := json.Unmarshal([]byte(reply), &parsed); err != nil {
		writeErr(w, http.StatusBadGateway, fmt.Errorf("unexpected reply from team module: %s", strings.TrimSpace(reply)))
		return
	}
	writeJSON(w, http.StatusOK, parsed)
}

// teamWrite runs a write verb and returns its human reply.
func (s *Server) teamWrite(w http.ResponseWriter, verb string) {
	reply, err := s.team(verb)
	if err != nil {
		writeErr(w, http.StatusBadGateway, err)
		return
	}
	writeJSON(w, http.StatusOK, map[string]string{"reply": strings.TrimSpace(reply)})
}

// teamDelegator pulls the required delegator name off the query string. Almost
// every team resource is scoped to one.
func teamDelegator(w http.ResponseWriter, r *http.Request) (string, bool) {
	return safeArg(w, "delegator", r.URL.Query().Get("delegator"))
}

// teamText flattens a free-text field (a task title) to something that survives
// the module's space-split command line: the module rejoins trailing words, so
// spaces are fine but newlines and tabs are not.
func teamText(v string) string {
	return strings.Join(strings.Fields(v), " ")
}

// --- Status ---

// handleTeamStatus reports whether the module is up, so the UI can show a start
// prompt instead of an error banner on every panel.
func (s *Server) handleTeamStatus(w http.ResponseWriter, r *http.Request) {
	res, err := client.ModuleCommand("team.sock", "json overview", teamActor)
	if !res.Running {
		writeJSON(w, http.StatusOK, map[string]any{"running": false})
		return
	}
	out := map[string]any{"running": true}
	if err != nil {
		out["error"] = err.Error()
		writeJSON(w, http.StatusOK, out)
		return
	}
	var parsed any
	if json.Unmarshal([]byte(res.Reply), &parsed) == nil {
		out["overview"] = parsed
	}
	writeJSON(w, http.StatusOK, out)
}

func (s *Server) handleTeamOverview(w http.ResponseWriter, r *http.Request) {
	s.teamRead(w, "overview")
}

func (s *Server) handleTeamAudit(w http.ResponseWriter, r *http.Request) {
	verb := "audit"
	if n, err := strconv.Atoi(r.URL.Query().Get("limit")); err == nil && n > 0 {
		verb += " " + strconv.Itoa(n)
	}
	s.teamRead(w, verb)
}

// --- Delegators ---

func (s *Server) handleTeamDelegators(w http.ResponseWriter, r *http.Request) {
	s.teamRead(w, "delegators")
}

func (s *Server) handleTeamDelegatorCreate(w http.ResponseWriter, r *http.Request) {
	var body struct {
		Name    string `json:"name"`
		Owner   string `json:"github_owner"`
		Project int    `json:"github_project_number"`
	}
	if !decode(w, r, &body) {
		return
	}
	name, ok := safeArg(w, "name", body.Name)
	if !ok {
		return
	}
	// No owner means local-only, which is the module's two-argument create form.
	owner := strings.TrimSpace(body.Owner)
	if owner == "" {
		s.teamWrite(w, "delegator create "+name)
		return
	}
	if strings.ContainsAny(owner, " \t\n") {
		writeErr(w, http.StatusBadRequest, fmt.Errorf("invalid github_owner"))
		return
	}
	if body.Project <= 0 {
		writeErr(w, http.StatusBadRequest, fmt.Errorf("github_project_number must be positive when a github_owner is given"))
		return
	}
	s.teamWrite(w, fmt.Sprintf("delegator create %s %s %d", name, owner, body.Project))
}

func (s *Server) handleTeamDelegatorUpdate(w http.ResponseWriter, r *http.Request) {
	name, ok := safeArg(w, "name", r.PathValue("name"))
	if !ok {
		return
	}
	var body struct {
		Owner   string `json:"github_owner"`
		Project int    `json:"github_project_number"`
	}
	if !decode(w, r, &body) {
		return
	}
	owner := strings.TrimSpace(body.Owner)
	if owner == "" {
		s.teamWrite(w, "delegator edit "+name+" local")
		return
	}
	if strings.ContainsAny(owner, " \t\n") {
		writeErr(w, http.StatusBadRequest, fmt.Errorf("invalid github_owner"))
		return
	}
	if body.Project <= 0 {
		writeErr(w, http.StatusBadRequest, fmt.Errorf("github_project_number must be positive"))
		return
	}
	s.teamWrite(w, fmt.Sprintf("delegator edit %s %s %d", name, owner, body.Project))
}

func (s *Server) handleTeamDelegatorDelete(w http.ResponseWriter, r *http.Request) {
	name, ok := safeArg(w, "name", r.PathValue("name"))
	if !ok {
		return
	}
	s.teamWrite(w, "delegator delete "+name)
}

// --- Standups ---

func (s *Server) handleTeamStandups(w http.ResponseWriter, r *http.Request) {
	verb := "standups"
	if d := strings.TrimSpace(r.URL.Query().Get("delegator")); d != "" {
		name, ok := safeArg(w, "delegator", d)
		if !ok {
			return
		}
		verb += " " + name
	}
	s.teamRead(w, verb)
}

func (s *Server) handleTeamStandupCreate(w http.ResponseWriter, r *http.Request) {
	var body struct {
		Name      string `json:"name"`
		Delegator string `json:"delegator"`
		Group     string `json:"telegram_group"`
		Time      string `json:"schedule_time"`
		Timezone  string `json:"timezone"`
	}
	if !decode(w, r, &body) {
		return
	}
	name, ok := safeArg(w, "name", body.Name)
	if !ok {
		return
	}
	del, ok := safeArg(w, "delegator", body.Delegator)
	if !ok {
		return
	}
	group, ok := safeArg(w, "telegram_group", body.Group)
	if !ok {
		return
	}
	at, ok := safeArg(w, "schedule_time", body.Time)
	if !ok {
		return
	}
	tz, ok := safeArg(w, "timezone", body.Timezone)
	if !ok {
		return
	}
	s.teamWrite(w, strings.Join([]string{"standup create", name, del, group, at, tz}, " "))
}

// handleTeamStandupUpdate edits one field. The module validates the value (a bad
// clock time or unknown zone fails the edit) so the console does not duplicate
// that logic and risk disagreeing with it.
func (s *Server) handleTeamStandupUpdate(w http.ResponseWriter, r *http.Request) {
	name, ok := safeArg(w, "name", r.PathValue("name"))
	if !ok {
		return
	}
	var body struct {
		Field string `json:"field"`
		Value string `json:"value"`
	}
	if !decode(w, r, &body) {
		return
	}
	field, ok := safeArg(w, "field", body.Field)
	if !ok {
		return
	}
	switch field {
	case "time", "timezone", "group":
	default:
		writeErr(w, http.StatusBadRequest, fmt.Errorf("field must be time, timezone, or group"))
		return
	}
	value, ok := safeArg(w, "value", body.Value)
	if !ok {
		return
	}
	s.teamWrite(w, strings.Join([]string{"standup edit", name, field, value}, " "))
}

// handleTeamStandupToggle serves enable and disable. Disable is a pause: the
// module keeps the standup and all its runs.
func (s *Server) handleTeamStandupToggle(w http.ResponseWriter, r *http.Request) {
	name, ok := safeArg(w, "name", r.PathValue("name"))
	if !ok {
		return
	}
	action := r.PathValue("action")
	switch action {
	case "enable", "disable":
	default:
		writeErr(w, http.StatusBadRequest, fmt.Errorf("action must be enable or disable"))
		return
	}
	s.teamWrite(w, "standup "+action+" "+name)
}

func (s *Server) handleTeamStandupRuns(w http.ResponseWriter, r *http.Request) {
	name, ok := safeArg(w, "name", r.PathValue("name"))
	if !ok {
		return
	}
	verb := "runs " + name
	if n, err := strconv.Atoi(r.URL.Query().Get("limit")); err == nil && n > 0 {
		verb += " " + strconv.Itoa(n)
	}
	s.teamRead(w, verb)
}

// --- Staff ---

func (s *Server) handleTeamStaff(w http.ResponseWriter, r *http.Request) {
	del, ok := teamDelegator(w, r)
	if !ok {
		return
	}
	s.teamRead(w, "staff "+del)
}

func (s *Server) handleTeamStaffAdd(w http.ResponseWriter, r *http.Request) {
	var body struct {
		Delegator string `json:"delegator"`
		Telegram  string `json:"telegram_username"`
		GitHub    string `json:"github_username"`
		Role      string `json:"role"`
		MaxActive int    `json:"max_active_tasks"`
	}
	if !decode(w, r, &body) {
		return
	}
	del, ok := safeArg(w, "delegator", body.Delegator)
	if !ok {
		return
	}
	handle := strings.TrimSpace(body.Telegram)
	if handle != "" && !strings.HasPrefix(handle, "@") {
		handle = "@" + handle
	}
	tg, ok := safeArg(w, "telegram_username", handle)
	if !ok {
		return
	}
	switch body.Role {
	case "admin", "lead", "staff":
	default:
		writeErr(w, http.StatusBadRequest, fmt.Errorf("role must be admin, lead, or staff"))
		return
	}
	if body.MaxActive < 0 {
		writeErr(w, http.StatusBadRequest, fmt.Errorf("max_active_tasks must not be negative"))
		return
	}
	// The module's add form takes the github handle only when there is one; the
	// four-argument form is local-only delegators.
	parts := []string{"staff add", del, tg}
	if gh := strings.TrimSpace(body.GitHub); gh != "" {
		if strings.ContainsAny(gh, " \t\n") {
			writeErr(w, http.StatusBadRequest, fmt.Errorf("invalid github_username"))
			return
		}
		parts = append(parts, gh)
	}
	parts = append(parts, body.Role, strconv.Itoa(body.MaxActive))
	s.teamWrite(w, strings.Join(parts, " "))
}

// handleTeamStaffUpdate changes a role or a task limit. Exactly one of the two
// is expected per call, matching the module's separate verbs.
func (s *Server) handleTeamStaffUpdate(w http.ResponseWriter, r *http.Request) {
	tg, ok := safeArg(w, "telegram", r.PathValue("telegram"))
	if !ok {
		return
	}
	var body struct {
		Delegator string `json:"delegator"`
		Role      string `json:"role"`
		MaxActive *int   `json:"max_active_tasks"`
	}
	if !decode(w, r, &body) {
		return
	}
	del, ok := safeArg(w, "delegator", body.Delegator)
	if !ok {
		return
	}
	if role := strings.TrimSpace(body.Role); role != "" {
		switch role {
		case "admin", "lead", "staff":
		default:
			writeErr(w, http.StatusBadRequest, fmt.Errorf("role must be admin, lead, or staff"))
			return
		}
		s.teamWrite(w, strings.Join([]string{"staff role", del, tg, role}, " "))
		return
	}
	if body.MaxActive != nil {
		if *body.MaxActive < 0 {
			writeErr(w, http.StatusBadRequest, fmt.Errorf("max_active_tasks must not be negative"))
			return
		}
		s.teamWrite(w, strings.Join([]string{"staff limit", del, tg, strconv.Itoa(*body.MaxActive)}, " "))
		return
	}
	writeErr(w, http.StatusBadRequest, fmt.Errorf("nothing to update: send role or max_active_tasks"))
}

func (s *Server) handleTeamStaffRemove(w http.ResponseWriter, r *http.Request) {
	tg, ok := safeArg(w, "telegram", r.PathValue("telegram"))
	if !ok {
		return
	}
	del, ok := teamDelegator(w, r)
	if !ok {
		return
	}
	s.teamWrite(w, strings.Join([]string{"staff remove", del, tg}, " "))
}

// --- Tasks ---

func (s *Server) handleTeamTasks(w http.ResponseWriter, r *http.Request) {
	del, ok := teamDelegator(w, r)
	if !ok {
		return
	}
	verb := "tasks " + del
	if n, err := strconv.Atoi(r.URL.Query().Get("limit")); err == nil && n > 0 {
		verb += " " + strconv.Itoa(n)
	}
	s.teamRead(w, verb)
}

func (s *Server) handleTeamTaskCreate(w http.ResponseWriter, r *http.Request) {
	var body struct {
		Delegator string `json:"delegator"`
		Priority  string `json:"priority"`
		Title     string `json:"title"`
	}
	if !decode(w, r, &body) {
		return
	}
	del, ok := safeArg(w, "delegator", body.Delegator)
	if !ok {
		return
	}
	pri, ok := safeArg(w, "priority", body.Priority)
	if !ok {
		return
	}
	title := teamText(body.Title)
	if title == "" {
		writeErr(w, http.StatusBadRequest, fmt.Errorf("task title is required"))
		return
	}
	s.teamWrite(w, strings.Join([]string{"task add", del, pri, title}, " "))
}

// handleTeamTaskAction serves status, assign and unassign for one task. The task
// is addressed by id, so a title with spaces never reaches the command line.
func (s *Server) handleTeamTaskAction(w http.ResponseWriter, r *http.Request) {
	id, ok := safeArg(w, "id", r.PathValue("id"))
	if !ok {
		return
	}
	action := r.PathValue("action")
	var body struct {
		Delegator string `json:"delegator"`
		Status    string `json:"status"`
		Telegram  string `json:"telegram_username"`
	}
	if !decode(w, r, &body) {
		return
	}
	del, ok := safeArg(w, "delegator", body.Delegator)
	if !ok {
		return
	}
	switch action {
	case "status":
		st, ok := safeArg(w, "status", body.Status)
		if !ok {
			return
		}
		switch st {
		case "unassigned", "assigned", "blocked", "review", "done":
		default:
			writeErr(w, http.StatusBadRequest, fmt.Errorf("status must be unassigned, assigned, blocked, review, or done"))
			return
		}
		s.teamWrite(w, strings.Join([]string{"task status", del, st, id}, " "))
	case "assign":
		handle := strings.TrimSpace(body.Telegram)
		if handle != "" && !strings.HasPrefix(handle, "@") {
			handle = "@" + handle
		}
		tg, ok := safeArg(w, "telegram_username", handle)
		if !ok {
			return
		}
		s.teamWrite(w, strings.Join([]string{"task assign", del, tg, id}, " "))
	case "unassign":
		s.teamWrite(w, strings.Join([]string{"task unassign", del, id}, " "))
	default:
		writeErr(w, http.StatusBadRequest, fmt.Errorf("action must be status, assign, or unassign"))
	}
}
