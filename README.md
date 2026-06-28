# zcoms-console

The owner-only local web UI for hand-editing every zcoms store table.

`requires: [comms, agent]`

It is a top-tier module: a single pure-Go binary with an embedded (`go:embed`)
buildless frontend (one `index.html` + vanilla JS + a little CSS — no node, no
build step). It reaches every store table **through the published comms and
agent clients** — it never opens a `.db` file directly. Logging in is what
authorizes you as the owner behind those seams, so after auth the console can
edit personas / allowlist / settings that the chat agent cannot.

## Localhost-only + login

- The server binds **`127.0.0.1:<port>` only** — never `0.0.0.0`.
- Auth: the owner password is a **bcrypt** hash stored in `agent.db` settings
  under `console.password_hash`. On first run the login page becomes a *set a
  password* page. A successful login issues a short-lived, HMAC-signed,
  `HttpOnly`/`SameSite=Lax` session cookie; every `/api/...` request requires it.
- Port comes from the `console.port` setting (default **7575**).

> SECURITY: allow-listing / owner access here is roughly shell-level. This must
> never be exposed beyond localhost. If it ever needs to listen off-loopback,
> that requires TLS + real auth first (out of scope today).

## Screens

| Tab | Client | Ops |
|---|---|---|
| Contacts | comms | full CRUD + handle add/remove |
| Workspaces | agent | max-role / pin / **ignore** (no delete) + sync now |
| Sessions | agent | read-only list + label edit |
| Personas | agent | edit seed / model / backend / display name |
| Allowlist | agent | add / list / remove |
| Settings | agent | key/value editor + password change |

## Install / run

```sh
zc install console     # seeds config, installs the systemd user service
zc console             # prints the console URL (http://127.0.0.1:<port>)
```

## Develop

Go 1.25.6. The Go toolchain on this machine lives at `/usr/bin/go`:

```sh
PATH=$PATH:/usr/bin GOFLAGS=-mod=mod go build ./...
PATH=$PATH:/usr/bin GOFLAGS=-mod=mod go test ./...
PATH=$PATH:/usr/bin GOFLAGS=-mod=mod go vet ./...
```

`go.mod` carries `replace` directives so local dev builds against the in-tree
`../zcoms` and `../zcoms-agent`; release builds pin the published versions.
