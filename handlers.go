package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"strings"

	"github.com/Zouriel/zcoms/client"
)

// decode reads a JSON request body into dst, writing a 400 on failure.
func decode(w http.ResponseWriter, r *http.Request, dst any) bool {
	if err := json.NewDecoder(r.Body).Decode(dst); err != nil {
		writeErr(w, http.StatusBadRequest, err)
		return false
	}
	return true
}

func pathID(w http.ResponseWriter, r *http.Request, name string) (int64, bool) {
	id, err := strconv.ParseInt(r.PathValue(name), 10, 64)
	if err != nil {
		writeErr(w, http.StatusBadRequest, fmt.Errorf("bad %s", name))
		return 0, false
	}
	return id, true
}

// agentCmd runs a write verb through the agent and returns its human reply, or
// surfaces the error (e.g. agent down, role rejected) to the client.
func (s *Server) agentCmd(w http.ResponseWriter, verb string) {
	reply, err := s.agent.Command(verb, "")
	if err != nil {
		writeErr(w, http.StatusBadGateway, err)
		return
	}
	writeJSON(w, http.StatusOK, map[string]string{"reply": reply})
}

// --- Contacts (comms client) ---

func (s *Server) handleContactsList(w http.ResponseWriter, r *http.Request) {
	cs, err := s.comms.ListContacts()
	if err != nil {
		writeErr(w, http.StatusBadGateway, err)
		return
	}
	if cs == nil {
		cs = []client.Contact{}
	}
	writeJSON(w, http.StatusOK, cs)
}

func (s *Server) handleContactCreate(w http.ResponseWriter, r *http.Request) {
	var c client.Contact
	if !decode(w, r, &c) {
		return
	}
	c.ID = 0
	created, err := s.comms.CreateContact(c)
	if err != nil {
		writeErr(w, http.StatusBadGateway, err)
		return
	}
	writeJSON(w, http.StatusOK, created)
}

func (s *Server) handleContactUpdate(w http.ResponseWriter, r *http.Request) {
	id, ok := pathID(w, r, "id")
	if !ok {
		return
	}
	var c client.Contact
	if !decode(w, r, &c) {
		return
	}
	c.ID = id // the path wins over any id in the body
	if err := s.comms.UpdateContact(c); err != nil {
		writeErr(w, http.StatusBadGateway, err)
		return
	}
	writeJSON(w, http.StatusOK, map[string]bool{"ok": true})
}

func (s *Server) handleContactDelete(w http.ResponseWriter, r *http.Request) {
	id, ok := pathID(w, r, "id")
	if !ok {
		return
	}
	if err := s.comms.DeleteContact(id); err != nil {
		writeErr(w, http.StatusBadGateway, err)
		return
	}
	writeJSON(w, http.StatusOK, map[string]bool{"ok": true})
}

// --- Workspaces (agent client) — edit only, no create/delete ---

func (s *Server) handleWorkspacesList(w http.ResponseWriter, r *http.Request) {
	ws, err := s.agent.QueryWorkspaces()
	if err != nil {
		writeErr(w, http.StatusBadGateway, err)
		return
	}
	writeJSON(w, http.StatusOK, ws)
}

func (s *Server) handleWorkspaceSync(w http.ResponseWriter, r *http.Request) {
	s.agentCmd(w, "workspace sync")
}

func (s *Server) handleWorkspaceCap(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	var body struct {
		Role string `json:"role"`
	}
	if !decode(w, r, &body) {
		return
	}
	switch body.Role {
	case "read", "confirm", "edit", "full":
	default:
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "role must be read|confirm|edit|full"})
		return
	}
	s.agentCmd(w, "workspace cap "+id+" "+body.Role)
}

func (s *Server) handleWorkspacePin(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	var body struct {
		Pinned bool `json:"pinned"`
	}
	if !decode(w, r, &body) {
		return
	}
	verb := "workspace pin " + id
	if !body.Pinned {
		verb = "workspace unpin " + id
	}
	s.agentCmd(w, verb)
}

func (s *Server) handleWorkspaceIgnore(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	var body struct {
		Ignored bool `json:"ignored"`
	}
	if !decode(w, r, &body) {
		return
	}
	verb := "workspace ignore " + id
	if !body.Ignored {
		verb = "workspace unignore " + id
	}
	s.agentCmd(w, verb)
}

// --- Sessions (agent client) — read-only + label ---

func (s *Server) handleSessionsList(w http.ResponseWriter, r *http.Request) {
	wid, err := strconv.ParseInt(r.URL.Query().Get("workspace"), 10, 64)
	if err != nil {
		writeErr(w, http.StatusBadRequest, fmt.Errorf("workspace query param required"))
		return
	}
	sessions, err := s.agent.QuerySessions(wid)
	if err != nil {
		writeErr(w, http.StatusBadGateway, err)
		return
	}
	writeJSON(w, http.StatusOK, sessions)
}

func (s *Server) handleSessionLabel(w http.ResponseWriter, r *http.Request) {
	var body struct {
		WorkspaceID int64  `json:"workspace_id"`
		ExternalID  string `json:"external_id"`
		Label       string `json:"label"`
	}
	if !decode(w, r, &body) {
		return
	}
	s.agentCmd(w, fmt.Sprintf("session label %d %s %s", body.WorkspaceID, body.ExternalID, body.Label))
}

// --- Personas (agent client) — edit only ---

func (s *Server) handlePersonasList(w http.ResponseWriter, r *http.Request) {
	ps, err := s.agent.QueryPersonas()
	if err != nil {
		writeErr(w, http.StatusBadGateway, err)
		return
	}
	writeJSON(w, http.StatusOK, ps)
}

func (s *Server) handlePersonaSet(w http.ResponseWriter, r *http.Request) {
	key := r.PathValue("key")
	var body struct {
		Field string `json:"field"` // backend|model|seed|name
		Value string `json:"value"`
	}
	if !decode(w, r, &body) {
		return
	}
	switch body.Field {
	case "backend":
		if body.Value != "claude" && body.Value != "codex" {
			writeJSON(w, http.StatusBadRequest, map[string]string{"error": "backend must be claude|codex"})
			return
		}
	case "model", "seed", "name":
	default:
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "field must be backend|model|seed|name"})
		return
	}
	s.agentCmd(w, "persona set "+key+" "+body.Field+" "+body.Value)
}

// --- Allowlist (agent client) ---

func (s *Server) handleAllowlistList(w http.ResponseWriter, r *http.Request) {
	a, err := s.agent.QueryAllowlist()
	if err != nil {
		writeErr(w, http.StatusBadGateway, err)
		return
	}
	writeJSON(w, http.StatusOK, a)
}

func (s *Server) handleAllowlistAdd(w http.ResponseWriter, r *http.Request) {
	var body struct {
		Platform string `json:"platform"`
		Handle   string `json:"handle"`
		Role     string `json:"role"`
	}
	if !decode(w, r, &body) {
		return
	}
	platform := strings.ToLower(strings.TrimSpace(body.Platform))
	if platform != "whatsapp" {
		platform = "telegram"
	}
	handle := strings.TrimSpace(body.Handle)
	if handle == "" || strings.ContainsAny(handle, "\t\n") {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "a handle is required"})
		return
	}
	// The agent normalizes per platform (@-form for Telegram, digits for WhatsApp)
	// and treats the trailing token as the role, so a spaced WhatsApp number is fine.
	s.agentCmd(w, "allowlist add "+platform+" "+handle+" "+body.Role)
}

func (s *Server) handleAllowlistRemove(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	s.agentCmd(w, "allowlist rm "+id)
}

// --- Settings (agent client) ---

func (s *Server) handleSettingsList(w http.ResponseWriter, r *http.Request) {
	m, err := s.agent.QuerySettings()
	if err != nil {
		writeErr(w, http.StatusBadGateway, err)
		return
	}
	// Never echo the password hash back to the browser.
	delete(m, passwordSetKey)
	writeJSON(w, http.StatusOK, m)
}

func (s *Server) handleSettingsSet(w http.ResponseWriter, r *http.Request) {
	var body struct {
		Key   string `json:"key"`
		Value string `json:"value"`
	}
	if !decode(w, r, &body) {
		return
	}
	if body.Key == passwordSetKey {
		// Force password changes through the bcrypt path, not raw settings set.
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "use the password control"})
		return
	}
	s.agentCmd(w, "settings set "+body.Key+" "+body.Value)
}

func (s *Server) handlePasswordSet(w http.ResponseWriter, r *http.Request) {
	var body struct {
		Password string `json:"password"`
	}
	if !decode(w, r, &body) {
		return
	}
	if len(body.Password) < 6 {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "password too short"})
		return
	}
	if err := s.setPassword(body.Password); err != nil {
		writeErr(w, http.StatusBadGateway, err)
		return
	}
	writeJSON(w, http.StatusOK, map[string]bool{"ok": true})
}
