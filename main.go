// Command zcoms-console is the owner-only local web UI for hand-editing every
// zcoms store table. It is a top-tier module (requires comms + agent): it never
// opens a .db file — every read and write goes through the published comms and
// agent clients, which already perform owner-level writes. Logging in is what
// authorizes the operator as the owner behind those seams.
//
// SECURITY: the server binds 127.0.0.1 by default. Allow-listing/owner access
// here is roughly shell-level, so it must never face the public internet. The
// console.bind setting may move it off loopback for a PRIVATE overlay only —
// intended for a Tailscale IP (100.x.y.z), where the tailnet is WireGuard-
// encrypted and device-scoped. Password auth gates access; there is no TLS on a
// plain bind, so never bind a public interface or 0.0.0.0 on an untrusted LAN.
package main

import (
	"log"
	"net"
	"net/http"
	"strconv"
	"strings"
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

	// Bind host defaults to 127.0.0.1 (loopback only — the safe default). It can
	// be overridden via the console.bind setting for tailnet access: set it to a
	// Tailscale IP (100.x.y.z) so the UI is reachable from your own devices over
	// WireGuard-encrypted Tailscale, while staying invisible to the LAN/internet.
	// Do NOT set 0.0.0.0 unless you understand it exposes the UI to every network
	// this host is on. There is still password auth, but no TLS on a plain bind.
	host := "127.0.0.1"
	if v, ok := srv.setting("console.bind"); ok && strings.TrimSpace(v) != "" {
		host = strings.TrimSpace(v)
	}
	bindAddr := net.JoinHostPort(host, strconv.Itoa(port))
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
