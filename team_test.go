package main

import (
	"bufio"
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"github.com/Zouriel/zcoms/client"
)

func jsonBody(s string) io.Reader { return strings.NewReader(s) }

// teamUp reports whether the team module is listening, so these tests exercise
// the real proxy when it is and skip in CI where no module runs.
func teamUp(t *testing.T) {
	t.Helper()
	res, _ := client.ModuleCommand("team.sock", "json overview", teamActor)
	if !res.Running {
		t.Skip("team module not running")
	}
}

// The team handlers only use the package-level ModuleCommand, so a bare Server is
// enough; this deliberately bypasses requireAuth to test the proxy itself.
func TestTeamReadProxiesJSON(t *testing.T) {
	teamUp(t)
	s := &Server{}
	tests := []struct {
		name, path string
		handler    func(http.ResponseWriter, *http.Request)
	}{
		{"overview", "/api/team/overview", s.handleTeamOverview},
		{"delegators", "/api/team/delegators", s.handleTeamDelegators},
		{"standups", "/api/team/standups", s.handleTeamStandups},
		{"audit", "/api/team/audit?limit=5", s.handleTeamAudit},
	}
	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			w := httptest.NewRecorder()
			tc.handler(w, httptest.NewRequest(http.MethodGet, tc.path, nil))
			if w.Code != http.StatusOK {
				t.Fatalf("status %d: %s", w.Code, w.Body.String())
			}
			var parsed any
			if err := json.Unmarshal(w.Body.Bytes(), &parsed); err != nil {
				t.Fatalf("reply is not JSON: %v (%s)", err, w.Body.String())
			}
		})
	}
}

// A read scoped to a delegator requires the query parameter; without it the
// handler must fail loudly rather than sending a malformed command line.
func TestTeamScopedReadRequiresDelegator(t *testing.T) {
	s := &Server{}
	for _, tc := range []struct {
		name    string
		handler func(http.ResponseWriter, *http.Request)
	}{
		{"staff", s.handleTeamStaff},
		{"tasks", s.handleTeamTasks},
	} {
		t.Run(tc.name, func(t *testing.T) {
			w := httptest.NewRecorder()
			tc.handler(w, httptest.NewRequest(http.MethodGet, "/api/team/"+tc.name, nil))
			if w.Code != http.StatusBadRequest {
				t.Fatalf("want 400 without ?delegator=, got %d", w.Code)
			}
		})
	}
}

// Values that would break the module's space-split command line must be rejected
// before they are sent, not silently mangled into a different command.
func TestTeamRejectsUnsafeArgs(t *testing.T) {
	s := &Server{}
	w := httptest.NewRecorder()
	s.handleTeamStaff(w, httptest.NewRequest(http.MethodGet, "/api/team/staff?delegator=one+two", nil))
	if w.Code != http.StatusBadRequest {
		t.Fatalf("want 400 for a delegator containing a space, got %d: %s", w.Code, w.Body.String())
	}
}

func TestTeamStandupToggleValidatesAction(t *testing.T) {
	s := &Server{}
	w := httptest.NewRecorder()
	r := httptest.NewRequest(http.MethodPost, "/api/team/standups/x/frobnicate", nil)
	r.SetPathValue("name", "x")
	r.SetPathValue("action", "frobnicate")
	s.handleTeamStandupToggle(w, r)
	if w.Code != http.StatusBadRequest {
		t.Fatalf("want 400 for an unknown action, got %d", w.Code)
	}
}

func TestTeamTaskActionValidatesStatus(t *testing.T) {
	s := &Server{}
	w := httptest.NewRecorder()
	r := httptest.NewRequest(http.MethodPost, "/api/team/tasks/abc/status", jsonBody(`{"delegator":"hems","status":"sideways"}`))
	r.SetPathValue("id", "abc")
	r.SetPathValue("action", "status")
	s.handleTeamTaskAction(w, r)
	if w.Code != http.StatusBadRequest {
		t.Fatalf("want 400 for an invalid status, got %d: %s", w.Code, w.Body.String())
	}
}

// teamText flattens whitespace so a pasted multi-line title cannot inject extra
// words into the command line.
func TestTeamTextFlattensWhitespace(t *testing.T) {
	got := teamText("  ship\tthe\n\n thing  ")
	if got != "ship the thing" {
		t.Fatalf("got %q", got)
	}
}

// Live updates, end to end: the stream must push a new version token when team
// data changes, without the client asking. This is what makes the console reflect
// an edit made from Telegram or the CLI.
func TestTeamEventsPushesOnChange(t *testing.T) {
	teamUp(t)
	s := &Server{}
	srv := httptest.NewServer(http.HandlerFunc(s.handleTeamEvents))
	defer srv.Close()

	resp, err := srv.Client().Get(srv.URL)
	if err != nil {
		t.Fatalf("open stream: %v", err)
	}
	defer resp.Body.Close()
	if ct := resp.Header.Get("Content-Type"); ct != "text/event-stream" {
		t.Fatalf("content-type %q", ct)
	}

	// Read version tokens off the stream in the background.
	versions := make(chan string, 8)
	go func() {
		sc := bufio.NewScanner(resp.Body)
		for sc.Scan() {
			line := sc.Text()
			if !strings.HasPrefix(line, "data: ") {
				continue // event: / heartbeat comment / blank separator
			}
			var d struct {
				Version string `json:"version"`
				Running bool   `json:"running"`
			}
			if json.Unmarshal([]byte(strings.TrimPrefix(line, "data: ")), &d) == nil {
				versions <- d.Version
			}
		}
	}()

	first := waitFrame(t, versions, "initial")
	if first == "" {
		t.Fatal("initial frame carried no version")
	}

	// Mutate through the module, the same path `zc team` uses. The stream must
	// notice on its own, with no request from the client.
	if _, err := s.team("task add hems low ZZ sse probe"); err != nil {
		t.Fatalf("mutate: %v", err)
	}
	t.Cleanup(func() { _, _ = s.team("task status hems done ZZ sse probe") })

	second := waitFrame(t, versions, "after change")
	if second == first {
		t.Fatalf("version did not move after a change: %s", second)
	}
}

func waitFrame(t *testing.T, ch <-chan string, what string) string {
	t.Helper()
	select {
	case v := <-ch:
		return v
	case <-time.After(15 * time.Second):
		t.Fatalf("timed out waiting for the %s frame", what)
		return ""
	}
}
