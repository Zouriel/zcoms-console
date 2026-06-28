// Command zcoms-console is the owner-only local web UI for hand-editing every
// zcoms store table. It is a top-tier module (requires comms + agent): it never
// opens a .db file — every read and write goes through the published comms and
// agent clients, which already perform owner-level writes. Logging in is what
// authorizes the operator as the owner behind those seams.
//
// SECURITY: the server binds 127.0.0.1 only. Allow-listing/owner access here is
// roughly shell-level, so this must never be exposed beyond localhost. If it
// ever needs to listen off-loopback, that requires TLS + real auth first — out
// of scope today (see bindAddr below).
package main

import (
	"log"
	"net/http"
	"strconv"
	"time"

	agentclient "github.com/Zouriel/zcoms-agent/client"
	"github.com/Zouriel/zcoms/client"
)

const defaultPort = 7575

func main() {
	comms, err := client.NewDefault()
	if err != nil {
		log.Fatalf("comms client: %v", err)
	}
	// The console acts as the owner — roles gate the *agent's* writes, not the
	// operator's. The comms tier tags these writes as owner-originated.
	comms = comms.AsCaller("owner")

	agent, err := agentclient.New()
	if err != nil {
		log.Fatalf("agent client: %v", err)
	}

	srv := newServer(comms, agent)

	// Port lives in agent.db settings (console.port). If the agent is down we
	// can't read it; fall back to the default and surface the outage in the UI.
	port := defaultPort
	if v, ok := srv.setting("console.port"); ok && v != "" {
		if p, perr := strconv.Atoi(v); perr == nil && p > 0 {
			port = p
		}
	}

	// 127.0.0.1 ONLY — never 0.0.0.0. See the package SECURITY note.
	bindAddr := "127.0.0.1:" + strconv.Itoa(port)
	httpSrv := &http.Server{
		Addr:              bindAddr,
		Handler:           srv.routes(),
		ReadHeaderTimeout: 10 * time.Second,
	}

	log.Printf("zcoms-console listening on http://%s (agent reachable: %v)", bindAddr, agent.Available())
	if err := httpSrv.ListenAndServe(); err != nil {
		log.Fatalf("serve: %v", err)
	}
}
