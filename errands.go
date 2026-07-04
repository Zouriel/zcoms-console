package main

import (
	"net/http"

	agentclient "github.com/Zouriel/zcoms-agent/client"
)

// Errands page — read-only view of every errand's full flow, plus the two owner
// actions (retry a stalled/failed one, cancel an active one). Like every other
// page, this never touches the agent's files directly: it reads the assembled
// views over agent.sock and issues actions as `errand …` commands.

// handleErrandsList returns every errand (active + terminal), newest first.
func (s *Server) handleErrandsList(w http.ResponseWriter, r *http.Request) {
	list, err := s.agent.QueryErrands()
	if err != nil {
		writeErr(w, http.StatusBadGateway, err)
		return
	}
	if list == nil {
		list = []agentclient.ErrandView{}
	}
	writeJSON(w, http.StatusOK, list)
}

// handleErrandGet returns one errand's full flow: metadata, the collected info,
// the guard verdict, a merged timeline of every agent's steps, and what shipped.
func (s *Server) handleErrandGet(w http.ResponseWriter, r *http.Request) {
	det, err := s.agent.QueryErrand(r.PathValue("id"))
	if err != nil {
		writeErr(w, http.StatusBadGateway, err)
		return
	}
	writeJSON(w, http.StatusOK, det)
}

// handleErrandRetry resumes a stalled or failed errand from its furthest phase.
func (s *Server) handleErrandRetry(w http.ResponseWriter, r *http.Request) {
	s.agentCmd(w, "errand retry "+r.PathValue("id"))
}

// handleErrandCancel stops an active errand (the contact won't be messaged again).
func (s *Server) handleErrandCancel(w http.ResponseWriter, r *http.Request) {
	s.agentCmd(w, "errand cancel "+r.PathValue("id"))
}
