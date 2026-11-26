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
	"testing"

	agentclient "github.com/Zouriel/zcoms-agent/client"
)

// fakeAgent serves agent.sock under a temp XDG config dir, answering each
// request text from replies (missing keys get an error response). It returns a
// Server wired to it.
func fakeAgent(t *testing.T, replies map[string]string) *Server {
	t.Helper()
	// A short dir keeps the socket path under the unix limit.
	dir, err := os.MkdirTemp("", "zcc")
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { _ = os.RemoveAll(dir) })
	if err := os.MkdirAll(filepath.Join(dir, "zcoms"), 0o700); err != nil {
		t.Fatal(err)
	}
	t.Setenv("XDG_CONFIG_HOME", dir)
	ln, err := net.Listen("unix", filepath.Join(dir, "zcoms", "agent.sock"))
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
				var req struct {
					Text string `json:"text"`
				}
				_ = json.Unmarshal(line, &req)
				resp := map[string]any{"ok": false, "error": "unknown command"}
				if reply, ok := replies[req.Text]; ok {
					resp = map[string]any{"ok": true, "reply": reply}
				}
				b, _ := json.Marshal(resp)
				_, _ = c.Write(append(b, '\n'))
			}(conn)
		}
	}()
	agent, err := agentclient.New()
	if err != nil {
		t.Fatal(err)
	}
	return &Server{agent: agent}
}

func TestGroupPoliciesList(t *testing.T) {
	s := fakeAgent(t, map[string]string{
		"json group-policies": `[{"transport":"telegram","native_id":"-100","name":"Dev","kind":"project","project_id":3,"last_call":1700000000},{"transport":"whatsapp","native_id":"g1","name":"Family","kind":"general"}]`,
		"json projects":       `[{"id":3,"path":"/src/app","transport":"telegram","native_id":"-100","group_name":"Dev","follow_tasks":true}]`,
	})
	rec := httptest.NewRecorder()
	s.handleGroupPoliciesList(rec, httptest.NewRequest(http.MethodGet, "/api/groups", nil))
	if rec.Code != http.StatusOK {
		t.Fatalf("status %d: %s", rec.Code, rec.Body)
	}
	var got []agentclient.GroupPolicy
	if err := json.Unmarshal(rec.Body.Bytes(), &got); err != nil {
		t.Fatal(err)
	}
	if len(got) != 2 || got[0].ProjectPath != "/src/app" || got[0].LastCall != 1700000000 || got[1].Kind != "general" {
		t.Fatalf("unexpected policies: %+v", got)
	}
}

func TestGroupPoliciesEmptyIsArray(t *testing.T) {
	s := fakeAgent(t, map[string]string{"json group-policies": `null`, "json projects": `null`})
	rec := httptest.NewRecorder()
	s.handleGroupPoliciesList(rec, httptest.NewRequest(http.MethodGet, "/api/groups", nil))
	if got := strings.TrimSpace(rec.Body.String()); rec.Code != http.StatusOK || got != "[]" {
		t.Fatalf("status %d body %q, want 200 []", rec.Code, got)
	}
}

func TestGroupPoliciesAgentDown(t *testing.T) {
	s := fakeAgent(t, nil)
	rec := httptest.NewRecorder()
	s.handleGroupPoliciesList(rec, httptest.NewRequest(http.MethodGet, "/api/groups", nil))
	if rec.Code != http.StatusBadGateway {
		t.Fatalf("status %d, want 502", rec.Code)
	}
}

func TestProjectsList(t *testing.T) {
	s := fakeAgent(t, map[string]string{
		"json projects": `[{"id":3,"path":"/src/app","transport":"telegram","native_id":"-100","group_name":"Dev","follow_tasks":true}]`,
	})
	rec := httptest.NewRecorder()
	s.handleProjectsList(rec, httptest.NewRequest(http.MethodGet, "/api/projects", nil))
	var got []agentclient.ProjectInfo
	if err := json.Unmarshal(rec.Body.Bytes(), &got); err != nil {
		t.Fatal(err)
	}
	if rec.Code != http.StatusOK || len(got) != 1 || got[0].Path != "/src/app" || !got[0].FollowTasks {
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
