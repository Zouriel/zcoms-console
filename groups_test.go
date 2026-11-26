package main

import (
	"bufio"
	"encoding/json"
	"net"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"strings"
	"sync"
	"testing"

	agentclient "github.com/Zouriel/zcoms-agent/client"
	"github.com/Zouriel/zcoms/client"
)

// recorder collects the request lines a fake socket received.
type recorder struct {
	mu    sync.Mutex
	lines []string
	reqs  []client.Request
}

func (r *recorder) addLine(s string) { r.mu.Lock(); r.lines = append(r.lines, s); r.mu.Unlock() }
func (r *recorder) addReq(q client.Request) {
	r.mu.Lock()
	r.reqs = append(r.reqs, q)
	r.mu.Unlock()
}

func (r *recorder) lastLine() string {
	r.mu.Lock()
	defer r.mu.Unlock()
	if len(r.lines) == 0 {
		return ""
	}
	return r.lines[len(r.lines)-1]
}

func (r *recorder) count() int { r.mu.Lock(); defer r.mu.Unlock(); return len(r.lines) + len(r.reqs) }

// testConfigDir points XDG_CONFIG_HOME at a short temp dir (short keeps the
// socket path under the unix limit) and returns its zcoms dir.
func testConfigDir(t *testing.T) string {
	t.Helper()
	if v := os.Getenv("ZCC_TEST_DIR"); v != "" {
		return v
	}
	dir, err := os.MkdirTemp("", "zcc")
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { _ = os.RemoveAll(dir) })
	z := filepath.Join(dir, "zcoms")
	if err := os.MkdirAll(z, 0o700); err != nil {
		t.Fatal(err)
	}
	t.Setenv("XDG_CONFIG_HOME", dir)
	t.Setenv("ZCC_TEST_DIR", z)
	return z
}

// serveLines answers one JSON line per connection on a unix socket.
func serveLines(t *testing.T, path string, handle func([]byte) any) {
	t.Helper()
	ln, err := net.Listen("unix", path)
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { _ = ln.Close() })
	go func() {
		for {
			conn, err := ln.Accept()
			if err != nil {
				return
			}
			go func(c net.Conn) {
				defer c.Close()
				line, err := bufio.NewReader(c).ReadBytes('\n')
				if err != nil {
					return
				}
				b, _ := json.Marshal(handle(line))
				_, _ = c.Write(append(b, '\n'))
			}(conn)
		}
	}()
}

// fakeAgentRec serves agent.sock, answering each request text from replies
// (an unknown text gets an error), and records every text it received.
func fakeAgentRec(t *testing.T, replies map[string]string) (*Server, *recorder) {
	t.Helper()
	dir := testConfigDir(t)
	rec := &recorder{}
	serveLines(t, filepath.Join(dir, "agent.sock"), func(line []byte) any {
		var req struct {
			Text string `json:"text"`
		}
		_ = json.Unmarshal(line, &req)
		if !strings.HasPrefix(req.Text, "json ") {
			rec.addLine(req.Text)
		}
		if reply, ok := replies[req.Text]; ok {
			return map[string]any{"ok": true, "reply": reply}
		}
		return map[string]any{"ok": false, "error": "unknown command"}
	})
	agent, err := agentclient.New()
	if err != nil {
		t.Fatal(err)
	}
	return &Server{agent: agent}, rec
}

func fakeAgent(t *testing.T, replies map[string]string) *Server {
	t.Helper()
	s, _ := fakeAgentRec(t, replies)
	return s
}

// fakeDaemon serves daemon.sock with handle and wires a comms client into s.
func fakeDaemon(t *testing.T, s *Server, handle func(client.Request) client.Response) *recorder {
	t.Helper()
	dir := testConfigDir(t)
	rec := &recorder{}
	serveLines(t, filepath.Join(dir, "daemon.sock"), func(line []byte) any {
		var req client.Request
		_ = json.Unmarshal(line, &req)
		rec.addReq(req)
		return handle(req)
	})
	s.comms = client.New(filepath.Join(dir, "daemon.sock")).AsCaller("owner")
	return rec
}

const projectsJSON = `[{"id":3,"path":"/src/my app","transport":"telegram","native_id":"-100","group_name":"Dev","follow_tasks":true}]`

func jsonReq(method, target, body string) *http.Request {
	r := httptest.NewRequest(method, target, strings.NewReader(body))
	r.Header.Set("Content-Type", "application/json")
	return r
}

func TestGroupsListMerges(t *testing.T) {
	s := fakeAgent(t, map[string]string{
		"json group-policies": `[{"transport":"telegram","native_id":"-100","name":"Dev","kind":"project","project_id":3,"last_call":1700000000},{"transport":"whatsapp","native_id":"1-2@g.us","name":"Family","kind":"general"}]`,
		"json projects":       projectsJSON,
	})
	fakeDaemon(t, s, func(q client.Request) client.Response {
		if q.Op != "group_list" {
			return client.Response{Error: "bad op"}
		}
		if q.Transport == "whatsapp" {
			return client.Response{Error: "whatsapp is not connected"}
		}
		return client.Response{OK: true, Groups: []client.Group{
			{NativeID: "-100", Name: "Dev", Transport: "telegram", Listen: true, Follow: true},
			{NativeID: "-200", Name: "Alpha", Transport: "telegram"},
		}}
	})
	rec := httptest.NewRecorder()
	s.handleGroupsList(rec, httptest.NewRequest(http.MethodGet, "/api/groups", nil))
	if rec.Code != http.StatusOK {
		t.Fatalf("status %d: %s", rec.Code, rec.Body)
	}
	var got groupsView
	if err := json.Unmarshal(rec.Body.Bytes(), &got); err != nil {
		t.Fatal(err)
	}
	if len(got.Groups) != 3 || got.Errors["whatsapp"] == "" {
		t.Fatalf("unexpected view: %+v", got)
	}
	byID := map[string]groupRow{}
	for _, g := range got.Groups {
		byID[g.NativeID] = g
	}
	dev, alpha, fam := byID["-100"], byID["-200"], byID["1-2@g.us"]
	if dev.Kind != "project" || dev.ProjectPath != "/src/my app" || !dev.Listen || !dev.Follow || dev.LastCall != 1700000000 || !dev.InRegistry {
		t.Errorf("dev row %+v", dev)
	}
	if alpha.Kind != "off" || !alpha.InRegistry {
		t.Errorf("alpha row %+v", alpha)
	}
	if fam.Kind != "general" || fam.InRegistry || fam.Name != "Family" {
		t.Errorf("family row %+v", fam)
	}
}

func TestGroupsListAgentDown(t *testing.T) {
	s := fakeAgent(t, nil)
	rec := httptest.NewRecorder()
	s.handleGroupsList(rec, httptest.NewRequest(http.MethodGet, "/api/groups", nil))
	if rec.Code != http.StatusBadGateway {
		t.Fatalf("status %d, want 502", rec.Code)
	}
}

func TestGroupPolicy(t *testing.T) {
	s, ag := fakeAgentRec(t, map[string]string{
		`group on telegram "-100"`:      "On",
		`group off whatsapp "1-2@g.us"`: "Off",
	})
	tests := []struct {
		name, body, wantLine string
		code                 int
	}{
		{"on", `{"transport":"telegram","native_id":"-100","on":true}`, `group on telegram "-100"`, 200},
		{"off", `{"transport":"whatsapp","native_id":"1-2@g.us","on":false}`, `group off whatsapp "1-2@g.us"`, 200},
		{"bad transport", `{"transport":"sms","native_id":"-100","on":true}`, "", 400},
		{"injected id", `{"transport":"telegram","native_id":"-100\" x","on":true}`, "", 400},
		{"bad wa id", `{"transport":"whatsapp","native_id":"evil","on":true}`, "", 400},
	}
	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			before := ag.count()
			rec := httptest.NewRecorder()
			s.handleGroupPolicy(rec, jsonReq(http.MethodPost, "/api/groups/policy", tc.body))
			if rec.Code != tc.code {
				t.Fatalf("status %d, want %d: %s", rec.Code, tc.code, rec.Body)
			}
			if tc.wantLine != "" && ag.lastLine() != tc.wantLine {
				t.Fatalf("sent %q, want %q", ag.lastLine(), tc.wantLine)
			}
			if tc.wantLine == "" && ag.count() != before {
				t.Fatal("rejected request still reached the agent")
			}
		})
	}
}

func TestMutationsRequireJSON(t *testing.T) {
	s, ag := fakeAgentRec(t, nil)
	r := httptest.NewRequest(http.MethodPost, "/api/groups/policy", strings.NewReader(`{"transport":"telegram","native_id":"-100","on":true}`))
	r.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	rec := httptest.NewRecorder()
	s.handleGroupPolicy(rec, r)
	if rec.Code != http.StatusUnsupportedMediaType || ag.count() != 0 {
		t.Fatalf("status %d, agent calls %d", rec.Code, ag.count())
	}
}

func TestGroupCreateAndAdd(t *testing.T) {
	s := fakeAgent(t, nil)
	dm := fakeDaemon(t, s, func(q client.Request) client.Response {
		switch q.Op {
		case "contact_list":
			return client.Response{OK: true, Contacts: []client.Contact{
				{ID: 1, Name: "Ali", Phone: "+9601", WhatsApp: "9601@s.whatsapp.net"},
				{ID: 2, Name: "Sara", Telegram: "@sara"},
			}}
		case "group_create":
			return client.Response{OK: true, Group: &client.Group{ID: 7, Name: q.Name, Transport: q.Transport, NativeID: "-300"}}
		case "group_add":
			return client.Response{OK: true}
		}
		return client.Response{Error: "bad op"}
	})

	rec := httptest.NewRecorder()
	s.handleGroupCreate(rec, jsonReq(http.MethodPost, "/api/groups/create", `{"transport":"telegram","name":" Team ","contact_ids":[1,2]}`))
	if rec.Code != http.StatusOK {
		t.Fatalf("create status %d: %s", rec.Code, rec.Body)
	}
	last := dm.reqs[len(dm.reqs)-1]
	if last.Op != "group_create" || last.Name != "Team" || strings.Join(last.Members, ",") != "+9601,@sara" || last.Caller != "owner" {
		t.Fatalf("create request %+v", last)
	}

	for _, tc := range []struct{ name, body string }{
		{"no address", `{"transport":"whatsapp","name":"X","contact_ids":[2]}`},
		{"unknown contact", `{"transport":"telegram","name":"X","contact_ids":[9]}`},
		{"no members", `{"transport":"telegram","name":"X","contact_ids":[]}`},
		{"no name", `{"transport":"telegram","name":"  ","contact_ids":[1]}`},
		{"newline name", `{"transport":"telegram","name":"a\nb","contact_ids":[1]}`},
	} {
		rec := httptest.NewRecorder()
		s.handleGroupCreate(rec, jsonReq(http.MethodPost, "/api/groups/create", tc.body))
		if rec.Code != http.StatusBadRequest {
			t.Errorf("%s: status %d, want 400", tc.name, rec.Code)
		}
	}

	rec = httptest.NewRecorder()
	s.handleGroupAddMembers(rec, jsonReq(http.MethodPost, "/api/groups/members", `{"transport":"whatsapp","native_id":"1-2@g.us","contact_ids":[1]}`))
	if rec.Code != http.StatusOK {
		t.Fatalf("add status %d: %s", rec.Code, rec.Body)
	}
	last = dm.reqs[len(dm.reqs)-1]
	if last.Op != "group_add" || last.To != "1-2@g.us" || strings.Join(last.Members, ",") != "9601@s.whatsapp.net" {
		t.Fatalf("add request %+v", last)
	}
}

func TestGroupMembersAndMessages(t *testing.T) {
	s := fakeAgent(t, nil)
	dm := fakeDaemon(t, s, func(q client.Request) client.Response {
		switch q.Op {
		case "group_members":
			return client.Response{OK: true, Members: []client.GroupMember{{ID: "1", Name: "Ali"}}}
		case "group_read":
			return client.Response{OK: true}
		}
		return client.Response{Error: "bad op"}
	})
	rec := httptest.NewRecorder()
	s.handleGroupMembers(rec, httptest.NewRequest(http.MethodGet, "/api/groups/members?transport=telegram&id=-100", nil))
	if rec.Code != http.StatusOK || !strings.Contains(rec.Body.String(), `"Ali"`) {
		t.Fatalf("members %d: %s", rec.Code, rec.Body)
	}
	rec = httptest.NewRecorder()
	s.handleGroupMessages(rec, httptest.NewRequest(http.MethodGet, "/api/groups/messages?transport=telegram&id=-100", nil))
	if rec.Code != http.StatusOK || strings.TrimSpace(rec.Body.String()) != "[]" {
		t.Fatalf("messages %d: %s", rec.Code, rec.Body)
	}
	last := dm.reqs[len(dm.reqs)-1]
	if last.Op != "group_read" || last.Limit != 50 || last.Caller != "owner" {
		t.Fatalf("read request %+v", last)
	}
	rec = httptest.NewRecorder()
	s.handleGroupMessages(rec, httptest.NewRequest(http.MethodGet, "/api/groups/messages?transport=x&id=-100", nil))
	if rec.Code != http.StatusBadRequest {
		t.Fatalf("bad transport status %d", rec.Code)
	}
}

func TestProjectsList(t *testing.T) {
	s := fakeAgent(t, map[string]string{"json projects": projectsJSON})
	rec := httptest.NewRecorder()
	s.handleProjectsList(rec, httptest.NewRequest(http.MethodGet, "/api/projects", nil))
	var got []agentclient.ProjectInfo
	if err := json.Unmarshal(rec.Body.Bytes(), &got); err != nil {
		t.Fatal(err)
	}
	if rec.Code != http.StatusOK || len(got) != 1 || got[0].Path != "/src/my app" || !got[0].FollowTasks {
		t.Fatalf("status %d projects %+v", rec.Code, got)
	}
}

func TestProjectDetail(t *testing.T) {
	s := fakeAgent(t, map[string]string{
		"json project 3": `{"project":{"id":3,"path":"/src/app"},"members":[{"id":1,"name":"Ali","active":true,"aliases":["ali","al"]}],"open_tasks":[{"id":9,"title":"Fix login","assignee":"Ali","status":"open"}],"summaries":[{"date":"2026-11-25","text":"Shipped the build."}]}`,
	})
	tests := []struct {
		name string
		id   string
		code int
	}{
		{"found", "3", http.StatusOK},
		{"not a number", "abc", http.StatusBadRequest},
		{"zero", "0", http.StatusBadRequest},
		{"agent error", "4", http.StatusBadGateway},
	}
	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			req := httptest.NewRequest(http.MethodGet, "/api/projects/"+tc.id, nil)
			req.SetPathValue("id", tc.id)
			rec := httptest.NewRecorder()
			s.handleProjectDetail(rec, req)
			if rec.Code != tc.code {
				t.Fatalf("status %d, want %d: %s", rec.Code, tc.code, rec.Body)
			}
			if tc.code != http.StatusOK {
				return
			}
			var d agentclient.ProjectDetail
			if err := json.Unmarshal(rec.Body.Bytes(), &d); err != nil {
				t.Fatal(err)
			}
			if len(d.Members) != 1 || len(d.Members[0].Aliases) != 2 || d.OpenTasks[0].Title != "Fix login" || d.Summaries[0].Date != "2026-11-25" {
				t.Fatalf("unexpected detail: %+v", d)
			}
		})
	}
}

func TestProjectDetailEmptyListsAreArrays(t *testing.T) {
	s := fakeAgent(t, map[string]string{"json project 5": `{"project":{"id":5,"path":"/x"}}`})
	req := httptest.NewRequest(http.MethodGet, "/api/projects/5", nil)
	req.SetPathValue("id", "5")
	rec := httptest.NewRecorder()
	s.handleProjectDetail(rec, req)
	body := rec.Body.String()
	for _, want := range []string{`"members":[]`, `"open_tasks":[]`, `"summaries":[]`} {
		if !strings.Contains(body, want) {
			t.Fatalf("body %s missing %s", body, want)
		}
	}
}

func TestProjectCommands(t *testing.T) {
	const p = `--path "/src/my app"`
	s, ag := fakeAgentRec(t, map[string]string{
		"json projects":       projectsJSON,
		"json project 3":      `{"project":{"id":3,"path":"/src/my app"},"members":[{"id":1,"name":"Ali Hassan","active":true}]}`,
		"project status " + p: "status",
		"project alias " + p + ` -- "add" "Ali Hassan" "a\"l"`: "Saved",
		"project alias " + p + ` -- "rm" "Ali Hassan" "al"`:    "Saved",
		"project tasks " + p + ` -- "done" "9"`:                "Closed",
		"project tasks " + p + ` -- "drop" "9"`:                "Dropped",
		"project tasks " + p + ` -- "assign" "9" "Ali Hassan"`: "Assigned",
		"project follow " + p + ` -- "on"`:                     "Follow on",
		"project standup " + p + ` -- "now"`:                   "Standup sent",
		"project remove " + p:                                  "Unbound",
		"project remove " + p + " --purge":                     "Unbound",
	})
	type call struct {
		name    string
		h       http.HandlerFunc
		method  string
		id      string
		vals    map[string]string
		body    string
		code    int
		sendsTo string
	}
	tests := []call{
		{"status", s.handleProjectStatus, http.MethodGet, "3", nil, "", 200, "project status " + p},
		{"alias add escapes", s.handleProjectAlias, http.MethodPost, "3", nil, `{"op":"add","member":"Ali Hassan","alias":"a\"l"}`, 200, "project alias " + p + ` -- "add" "Ali Hassan" "a\"l"`},
		{"alias rm", s.handleProjectAlias, http.MethodPost, "3", nil, `{"op":"rm","member":"Ali Hassan","alias":"al"}`, 200, "project alias " + p + ` -- "rm" "Ali Hassan" "al"`},
		{"alias bad op", s.handleProjectAlias, http.MethodPost, "3", nil, `{"op":"set","member":"A","alias":"b"}`, 400, ""},
		{"alias unknown project", s.handleProjectAlias, http.MethodPost, "8", nil, `{"op":"add","member":"A","alias":"b"}`, 404, ""},
		{"task done", s.handleProjectTask, http.MethodPost, "3", map[string]string{"task": "9", "action": "done"}, `{}`, 200, "project tasks " + p + ` -- "done" "9"`},
		{"task drop", s.handleProjectTask, http.MethodPost, "3", map[string]string{"task": "9", "action": "drop"}, `{}`, 200, "project tasks " + p + ` -- "drop" "9"`},
		{"task assign", s.handleProjectTask, http.MethodPost, "3", map[string]string{"task": "9", "action": "assign"}, `{"member":"Ali Hassan"}`, 200, "project tasks " + p + ` -- "assign" "9" "Ali Hassan"`},
		{"task assign stranger", s.handleProjectTask, http.MethodPost, "3", map[string]string{"task": "9", "action": "assign"}, `{"member":"Eve"}`, 400, ""},
		{"task bad id", s.handleProjectTask, http.MethodPost, "3", map[string]string{"task": "x", "action": "done"}, `{}`, 400, ""},
		{"task bad action", s.handleProjectTask, http.MethodPost, "3", map[string]string{"task": "9", "action": "rm"}, `{}`, 400, ""},
		{"follow", s.handleProjectFollow, http.MethodPost, "3", nil, `{"on":true}`, 200, "project follow " + p + ` -- "on"`},
		{"standup", s.handleProjectStandup, http.MethodPost, "3", nil, `{}`, 200, "project standup " + p + ` -- "now"`},
		{"remove", s.handleProjectRemove, http.MethodPost, "3", nil, `{"purge":false}`, 200, "project remove " + p},
		{"remove purge", s.handleProjectRemove, http.MethodPost, "3", nil, `{"purge":true}`, 200, "project remove " + p + " --purge"},
		{"bad project id", s.handleProjectRemove, http.MethodPost, "-1", nil, `{}`, 400, ""},
	}
	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			before := ag.count()
			req := jsonReq(tc.method, "/api/projects/"+tc.id, tc.body)
			req.SetPathValue("id", tc.id)
			for k, v := range tc.vals {
				req.SetPathValue(k, v)
			}
			rec := httptest.NewRecorder()
			tc.h(rec, req)
			if rec.Code != tc.code {
				t.Fatalf("status %d, want %d: %s", rec.Code, tc.code, rec.Body)
			}
			if tc.sendsTo != "" && ag.lastLine() != tc.sendsTo {
				t.Fatalf("sent %q, want %q", ag.lastLine(), tc.sendsTo)
			}
			if tc.sendsTo == "" && ag.count() != before {
				t.Fatalf("rejected request sent %q", ag.lastLine())
			}
		})
	}
}

func TestQuoteArg(t *testing.T) {
	if got := quoteArg(`a "b" \c`); got != `"a \"b\" \\c"` {
		t.Fatalf("quoteArg = %s", got)
	}
}
