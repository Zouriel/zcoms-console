package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/Zouriel/zcoms/client"
	qrcode "github.com/skip2/go-qrcode"
)

// connectorView is the wire shape for the Connectors page: the daemon's live
// transport status, minus the raw QR payload (served separately as a PNG) and
// plus a flag telling the page a QR is available to render.
type connectorView struct {
	Transport string      `json:"transport"`
	State     string      `json:"state"`
	Detail    string      `json:"detail,omitempty"`
	Since     int64       `json:"since,omitempty"`
	Caps      client.Caps `json:"caps"`
	HasQR     bool        `json:"has_qr"`
}

// handleConnectors returns each registered transport's live status (telegram,
// whatsapp, …). The page renders one card per entry plus the reserved
// Discord/Viber/Instagram slots it adds client-side.
func (s *Server) handleConnectors(w http.ResponseWriter, r *http.Request) {
	cs, err := s.comms.Connectors()
	if err != nil {
		writeErr(w, http.StatusBadGateway, err)
		return
	}
	out := make([]connectorView, 0, len(cs))
	for _, c := range cs {
		out = append(out, connectorView{
			Transport: c.Transport,
			State:     c.State,
			Detail:    c.Detail,
			Since:     c.Since,
			Caps:      c.Caps,
			HasQR:     c.QR != "",
		})
	}
	writeJSON(w, http.StatusOK, map[string]any{"connectors": out})
}

// handleConnectorAction runs a connect/disconnect action on a transport
// ({action} is e.g. "reconnect" to re-arm a fresh WhatsApp QR, or "logout").
func (s *Server) handleConnectorAction(w http.ResponseWriter, r *http.Request) {
	if err := s.comms.ConnectorAction(r.PathValue("transport"), r.PathValue("action")); err != nil {
		writeErr(w, http.StatusBadGateway, err)
		return
	}
	writeJSON(w, http.StatusOK, map[string]bool{"ok": true})
}

// handleInstagramCredentials writes the Instagram account credentials the owner
// entered on the connectors page to ~/.config/zcoms/instagram.json (mode 0600).
// The daemon re-reads that file when the owner then triggers the "login" action,
// so the whole login can be driven from the browser. Instagram has no OAuth, so
// the username/password necessarily live on disk like an account-level secret.
func (s *Server) handleInstagramCredentials(w http.ResponseWriter, r *http.Request) {
	var body struct {
		Username    string `json:"username"`
		Password    string `json:"password"`
		Proxy       string `json:"proxy"`
		PollSeconds int    `json:"poll_seconds"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		writeErr(w, http.StatusBadRequest, err)
		return
	}
	if strings.TrimSpace(body.Username) == "" || strings.TrimSpace(body.Password) == "" {
		writeErr(w, http.StatusBadRequest, fmt.Errorf("username and password are required"))
		return
	}
	dir, err := client.DefaultAppDir()
	if err != nil {
		writeErr(w, http.StatusInternalServerError, err)
		return
	}
	if body.PollSeconds <= 0 {
		body.PollSeconds = 45
	}
	out, err := json.MarshalIndent(body, "", "  ")
	if err != nil {
		writeErr(w, http.StatusInternalServerError, err)
		return
	}
	if err := os.MkdirAll(dir, 0o700); err != nil {
		writeErr(w, http.StatusInternalServerError, err)
		return
	}
	if err := os.WriteFile(filepath.Join(dir, "instagram.json"), out, 0o600); err != nil {
		writeErr(w, http.StatusInternalServerError, err)
		return
	}
	writeJSON(w, http.StatusOK, map[string]bool{"ok": true})
}

// handleConnectorQR renders the named transport's current pairing QR as a PNG
// (WhatsApp). 404 when there's no QR to show — the page only requests it while
// the connector is in action_required/needs_qr.
func (s *Server) handleConnectorQR(w http.ResponseWriter, r *http.Request) {
	transport := r.PathValue("transport")
	cs, err := s.comms.Connectors()
	if err != nil {
		writeErr(w, http.StatusBadGateway, err)
		return
	}
	payload := ""
	for _, c := range cs {
		if c.Transport == transport {
			payload = c.QR
			break
		}
	}
	if payload == "" {
		http.Error(w, "no qr", http.StatusNotFound)
		return
	}
	png, err := qrcode.Encode(payload, qrcode.Medium, 320)
	if err != nil {
		writeErr(w, http.StatusInternalServerError, err)
		return
	}
	w.Header().Set("Content-Type", "image/png")
	w.Header().Set("Cache-Control", "no-store")
	_, _ = w.Write(png)
}
