package main

import (
	"encoding/json"
	"net/http"

	agentclient "github.com/Zouriel/zcoms-agent/client"
)

// handleTriageGroupsList returns the triage groups (with sources) from agent.db.
func (s *Server) handleTriageGroupsList(w http.ResponseWriter, r *http.Request) {
	groups, err := s.agent.QueryTriageGroups()
	if err != nil {
		writeErr(w, http.StatusBadGateway, err)
		return
	}
	if groups == nil {
		groups = []agentclient.TriageGroup{}
	}
	writeJSON(w, http.StatusOK, groups)
}

// handleTriageGroupSave creates (id==0) or updates a group. The agent applies it
// under the owner guard and the dispatch tick picks up the change live.
func (s *Server) handleTriageGroupSave(w http.ResponseWriter, r *http.Request) {
	var g agentclient.TriageGroup
	if !decode(w, r, &g) {
		return
	}
	b, err := json.Marshal(g)
	if err != nil {
		writeErr(w, http.StatusBadRequest, err)
		return
	}
	s.agentCmd(w, "triage group save "+string(b))
}

// handleTriageGroupDelete removes a group (cascades its sources).
func (s *Server) handleTriageGroupDelete(w http.ResponseWriter, r *http.Request) {
	s.agentCmd(w, "triage group rm "+r.PathValue("id"))
}

// handleTriageGroupToggle enables/disables a group ({action} is enable|disable).
func (s *Server) handleTriageGroupToggle(w http.ResponseWriter, r *http.Request) {
	s.agentCmd(w, "triage group "+r.PathValue("action")+" "+r.PathValue("id"))
}
