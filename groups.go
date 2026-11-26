package main

import (
	"errors"
	"net/http"
	"strconv"

	agentclient "github.com/Zouriel/zcoms-agent/client"
)

// handleGroupPoliciesList returns every group the agent answers in, with its
// kind, transport, bound repo path and last call time. Read-only: group kind
// and binding are written only by owner commands on the agent side.
func (s *Server) handleGroupPoliciesList(w http.ResponseWriter, r *http.Request) {
	ps, err := s.agent.GroupPolicies()
	if err != nil {
		writeErr(w, http.StatusBadGateway, err)
		return
	}
	if ps == nil {
		ps = []agentclient.GroupPolicy{}
	}
	writeJSON(w, http.StatusOK, ps)
}

// handleProjectsList returns every bound project.
func (s *Server) handleProjectsList(w http.ResponseWriter, r *http.Request) {
	ps, err := s.agent.Projects()
	if err != nil {
		writeErr(w, http.StatusBadGateway, err)
		return
	}
	if ps == nil {
		ps = []agentclient.ProjectInfo{}
	}
	writeJSON(w, http.StatusOK, ps)
}

// handleProjectDetail returns one project's members, open tasks and summaries.
func (s *Server) handleProjectDetail(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.ParseInt(r.PathValue("id"), 10, 64)
	if err != nil || id <= 0 {
		writeErr(w, http.StatusBadRequest, errors.New("project id must be a positive number"))
		return
	}
	d, err := s.agent.ProjectDetail(id)
	if err != nil {
		writeErr(w, http.StatusBadGateway, err)
		return
	}
	if d.Members == nil {
		d.Members = []agentclient.ProjectMember{}
	}
	if d.OpenTasks == nil {
		d.OpenTasks = []agentclient.ProjectTask{}
	}
	if d.Summaries == nil {
		d.Summaries = []agentclient.ProjectSummary{}
	}
	writeJSON(w, http.StatusOK, d)
}
