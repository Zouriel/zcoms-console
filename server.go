package main

import (
	"crypto/rand"
	"embed"
	"encoding/json"
	"io/fs"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	agentclient "github.com/Zouriel/zcoms-agent/client"
	"github.com/Zouriel/zcoms/client"
)

//go:embed web/*
var webFS embed.FS

// Server holds the two published clients. It owns no database — all state behind
// it is reached through comms/agent. Auth is stateless: a session is a signed,
// self-expiring cookie validated against `secret`, so it survives restarts (the
// secret is persisted) without any server-side session table.
type Server struct {
	comms  *client.Client
	agent  *agentclient.Client
	secret []byte // stable HMAC key, persisted across restarts (see loadOrCreateSecret)
}

func newServer(comms *client.Client, agent *agentclient.Client) *Server {
	return &Server{
		comms:  comms,
		agent:  agent,
		secret: loadOrCreateSecret(),
	}
}

// loadOrCreateSecret returns a stable 32-byte HMAC key, read from (or written
// once to) ~/.config/zcoms/console-secret (0600). Persisting it means a console
// restart no longer invalidates everyone's login. Falls back to an ephemeral
// key only if the config dir is somehow unavailable.
func loadOrCreateSecret() []byte {
	dir, err := client.DefaultAppDir()
	if err == nil {
		path := filepath.Join(dir, "console-secret")
		if b, rerr := os.ReadFile(path); rerr == nil && len(b) >= 32 {
			return b
		}
		secret := make([]byte, 32)
		if _, rerr := rand.Read(secret); rerr != nil {
			panic("cannot read crypto randomness: " + rerr.Error())
		}
		_ = os.MkdirAll(dir, 0o700)
		_ = os.WriteFile(path, secret, 0o600)
		return secret
	}
	secret := make([]byte, 32)
	if _, rerr := rand.Read(secret); rerr != nil {
		panic("cannot read crypto randomness: " + rerr.Error())
	}
	return secret
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

	// Allowlist (agent client) — add/list/remove + add-every-channel-of-a-contact.
	mux.HandleFunc("GET /api/allowlist", auth(s.handleAllowlistList))
	mux.HandleFunc("POST /api/allowlist", auth(s.handleAllowlistAdd))
	mux.HandleFunc("POST /api/allowlist/from-contact", auth(s.handleAllowlistAddContact))
	mux.HandleFunc("DELETE /api/allowlist/{id}", auth(s.handleAllowlistRemove))

	// Phrases (agent client) — editable canned bridge messages.
	mux.HandleFunc("GET /api/phrases", auth(s.handlePhrasesList))
	mux.HandleFunc("POST /api/phrases", auth(s.handlePhraseSet))

	// Settings (agent client) — key/value editor + password change.
	mux.HandleFunc("GET /api/settings", auth(s.handleSettingsList))
	mux.HandleFunc("POST /api/settings", auth(s.handleSettingsSet))
	mux.HandleFunc("POST /api/password", auth(s.handlePasswordSet))

	// Connectors (comms client) — live per-transport status + WhatsApp pairing QR.
	mux.HandleFunc("GET /api/connectors", auth(s.handleConnectors))
	mux.HandleFunc("GET /api/connectors/{transport}/qr", auth(s.handleConnectorQR))
	mux.HandleFunc("POST /api/connectors/{transport}/{action}", auth(s.handleConnectorAction))

	// Reminders (agent client) — list + per-reminder log + cancel + live settings.
	mux.HandleFunc("GET /api/reminders", auth(s.handleRemindersList))
	mux.HandleFunc("POST /api/reminders", auth(s.handleReminderCreate))
	mux.HandleFunc("GET /api/reminders/settings", auth(s.handleReminderSettingsGet))
	mux.HandleFunc("POST /api/reminders/settings", auth(s.handleReminderSettingsSet))
	mux.HandleFunc("GET /api/reminders/{id}/events", auth(s.handleReminderEvents))
	mux.HandleFunc("POST /api/reminders/{id}/cancel", auth(s.handleReminderCancel))

	// Triage groups (agent client) — per-app schedules CRUD.
	mux.HandleFunc("GET /api/triage/groups", auth(s.handleTriageGroupsList))
	mux.HandleFunc("POST /api/triage/groups", auth(s.handleTriageGroupSave))
	mux.HandleFunc("DELETE /api/triage/groups/{id}", auth(s.handleTriageGroupDelete))
	mux.HandleFunc("POST /api/triage/groups/{id}/{action}", auth(s.handleTriageGroupToggle))

	// Commerce (core-only module, proxied over commerce.sock) — stores,
	// products, orders, refunds, billing, reports + their admin actions. Every
	// handler degrades to "module not running" when commerce isn't installed.
	mux.HandleFunc("GET /api/commerce/status", auth(s.handleCommerceStatus))
	mux.HandleFunc("GET /api/commerce/stores", auth(s.handleCommerceStores))
	mux.HandleFunc("POST /api/commerce/stores", auth(s.handleCommerceStoreCreate))
	mux.HandleFunc("GET /api/commerce/stores/{id}", auth(s.handleCommerceStoreShow))
	mux.HandleFunc("POST /api/commerce/stores/{id}/{action}", auth(s.handleCommerceStoreTransition))
	mux.HandleFunc("GET /api/commerce/products", auth(s.handleCommerceProducts))
	mux.HandleFunc("POST /api/commerce/products", auth(s.handleCommerceProductCreate))
	mux.HandleFunc("PUT /api/commerce/products/{id}", auth(s.handleCommerceProductUpdate))
	mux.HandleFunc("DELETE /api/commerce/products/{id}", auth(s.handleCommerceProductDelete))
	mux.HandleFunc("GET /api/commerce/orders", auth(s.handleCommerceOrders))
	mux.HandleFunc("GET /api/commerce/orders/{id}", auth(s.handleCommerceOrderShow))
	mux.HandleFunc("GET /api/commerce/refunds", auth(s.handleCommerceRefunds))
	mux.HandleFunc("POST /api/commerce/refunds/{id}/approve", auth(s.handleCommerceRefundApprove))
	mux.HandleFunc("POST /api/commerce/refunds/{id}/deny", auth(s.handleCommerceRefundDeny))
	mux.HandleFunc("GET /api/commerce/billing", auth(s.handleCommerceBilling))
	mux.HandleFunc("POST /api/commerce/billing/invoice", auth(s.handleCommerceBillingInvoice))
	mux.HandleFunc("GET /api/commerce/report/platform", auth(s.handleCommerceReportPlatform))
	mux.HandleFunc("GET /api/commerce/report/store", auth(s.handleCommerceReportStore))

	return mux
}

func (s *Server) handleIndex(w http.ResponseWriter, r *http.Request) {
	// The UI is an Angular SPA with client-side routing under base href "/".
	// Serve a real embedded asset (the hashed JS/CSS bundles, favicon, …) when
	// the path maps to one; otherwise fall back to index.html so a deep link
	// like /contacts boots the app instead of 404ing.
	sub, _ := fs.Sub(webFS, "web")
	if rel := strings.TrimPrefix(r.URL.Path, "/"); rel != "" {
		if info, err := fs.Stat(sub, rel); err == nil && !info.IsDir() {
			http.FileServerFS(sub).ServeHTTP(w, r)
			return
		}
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
