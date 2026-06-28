package main

import (
	"crypto/rand"
	"embed"
	"encoding/json"
	"io/fs"
	"net/http"
	"sync"
	"time"

	agentclient "github.com/Zouriel/zcoms-agent/client"
	"github.com/Zouriel/zcoms/client"
)

//go:embed web/*
var webFS embed.FS

// Server holds the two published clients and the in-memory session table. It
// owns no database — all state behind it is reached through comms/agent.
type Server struct {
	comms  *client.Client
	agent  *agentclient.Client
	secret []byte // 32-byte server secret, HMAC key for signing session tokens

	mu       sync.Mutex
	sessions map[string]time.Time // session id -> expiry
}

func newServer(comms *client.Client, agent *agentclient.Client) *Server {
	secret := make([]byte, 32)
	if _, err := rand.Read(secret); err != nil {
		panic("cannot read crypto randomness: " + err.Error())
	}
	return &Server{
		comms:    comms,
		agent:    agent,
		secret:   secret,
		sessions: map[string]time.Time{},
	}
}

// setting reads one agent.db settings scalar. Returns ok=false when the agent is
// unreachable or the key is absent, so callers can fall back gracefully.
func (s *Server) setting(key string) (string, bool) {
	settings, err := s.agent.QuerySettings()
	if err != nil {
		return "", false
	}
	v, ok := settings[key]
	return v, ok
}

func (s *Server) routes() http.Handler {
	mux := http.NewServeMux()

	// Static UI + public auth surface.
	mux.HandleFunc("GET /", s.handleIndex)
	mux.HandleFunc("GET /api/auth/status", s.handleAuthStatus)
	mux.HandleFunc("POST /api/login", s.handleLogin)
	mux.HandleFunc("POST /api/logout", s.handleLogout)

	// Authenticated API. Every handler below reaches a store only via a client.
	auth := s.requireAuth

	// Contacts (comms client) — full CRUD + handle editor.
	mux.HandleFunc("GET /api/contacts", auth(s.handleContactsList))
	mux.HandleFunc("POST /api/contacts", auth(s.handleContactCreate))
	mux.HandleFunc("PUT /api/contacts/{id}", auth(s.handleContactUpdate))
	mux.HandleFunc("DELETE /api/contacts/{id}", auth(s.handleContactDelete))
	mux.HandleFunc("POST /api/contacts/{id}/handles", auth(s.handleHandleAdd))
	mux.HandleFunc("DELETE /api/handles", auth(s.handleHandleRemove))

	// Workspaces (agent client) — edit cap/pin/ignore; NO create/delete.
	mux.HandleFunc("GET /api/workspaces", auth(s.handleWorkspacesList))
	mux.HandleFunc("POST /api/workspaces/sync", auth(s.handleWorkspaceSync))
	mux.HandleFunc("POST /api/workspaces/{id}/cap", auth(s.handleWorkspaceCap))
	mux.HandleFunc("POST /api/workspaces/{id}/pin", auth(s.handleWorkspacePin))
	mux.HandleFunc("POST /api/workspaces/{id}/ignore", auth(s.handleWorkspaceIgnore))

	// Sessions (agent client) — read-only list + label edit only.
	mux.HandleFunc("GET /api/sessions", auth(s.handleSessionsList))
	mux.HandleFunc("POST /api/sessions/label", auth(s.handleSessionLabel))

	// Personas (agent client) — edit only.
	mux.HandleFunc("GET /api/personas", auth(s.handlePersonasList))
	mux.HandleFunc("POST /api/personas/{key}", auth(s.handlePersonaSet))

	// Allowlist (agent client) — add/list/remove.
	mux.HandleFunc("GET /api/allowlist", auth(s.handleAllowlistList))
	mux.HandleFunc("POST /api/allowlist", auth(s.handleAllowlistAdd))
	mux.HandleFunc("DELETE /api/allowlist/{id}", auth(s.handleAllowlistRemove))

	// Settings (agent client) — key/value editor + password change.
	mux.HandleFunc("GET /api/settings", auth(s.handleSettingsList))
	mux.HandleFunc("POST /api/settings", auth(s.handleSettingsSet))
	mux.HandleFunc("POST /api/password", auth(s.handlePasswordSet))

	return mux
}

func (s *Server) handleIndex(w http.ResponseWriter, r *http.Request) {
	// Single-page app: the client decides login vs. tabs from /api/auth/status.
	// Static assets (app.js, style.css) are served from the embedded FS.
	if r.URL.Path != "/" {
		sub, _ := fs.Sub(webFS, "web")
		http.FileServerFS(sub).ServeHTTP(w, r)
		return
	}
	b, err := webFS.ReadFile("web/index.html")
	if err != nil {
		http.Error(w, "ui missing", http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	_, _ = w.Write(b)
}

// writeJSON is the single JSON response helper.
func writeJSON(w http.ResponseWriter, code int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	_ = json.NewEncoder(w).Encode(v)
}

// writeErr returns a JSON error body so the frontend can show the agent/comms
// failure verbatim rather than a blank 500.
func writeErr(w http.ResponseWriter, code int, err error) {
	writeJSON(w, code, map[string]string{"error": err.Error()})
}
