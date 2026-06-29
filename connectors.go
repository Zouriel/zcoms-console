package main

import (
	"net/http"

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
