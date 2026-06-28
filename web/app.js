"use strict";

// Vanilla SPA. Every call goes to /api/... which proxies the comms/agent
// clients server-side; the browser never touches a db. The UI renders only
// matrix-allowed operations (e.g. workspaces show Ignore, never Delete).

const $ = (sel, root = document) => root.querySelector(sel);
const el = (tag, props = {}, ...kids) => {
  const n = Object.assign(document.createElement(tag), props);
  for (const k of kids) n.append(k);
  return n;
};

async function api(method, path, body) {
  const opt = { method, headers: {} };
  if (body !== undefined) {
    opt.headers["Content-Type"] = "application/json";
    opt.body = JSON.stringify(body);
  }
  const res = await fetch(path, opt);
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  if (res.status === 401) { showLogin(); throw new Error("not authenticated"); }
  if (!res.ok) throw new Error(data.error || res.statusText);
  return data;
}

function toast(msg) {
  const t = el("div", { className: "toast", textContent: msg });
  document.body.append(t);
  setTimeout(() => t.remove(), 3000);
}
function fail(e) { toast("Error: " + e.message); }

// ---- auth gate ----

async function boot() {
  const st = await api("GET", "/api/auth/status");
  const banner = $("#banner");
  if (!st.agent_available) {
    banner.textContent = "agent not reachable — agent-backed screens will error";
    banner.classList.remove("hidden");
  } else {
    banner.classList.add("hidden");
  }
  if (st.authenticated) showApp();
  else showLogin(st.needs_setup);
}

function showLogin(needsSetup) {
  $("#app").classList.add("hidden");
  $("#logout").classList.add("hidden");
  $("#login").classList.remove("hidden");
  $("#login-title").textContent = needsSetup ? "Set a password" : "Log in";
  $("#login-hint").textContent = needsSetup
    ? "First run: choose the owner password for this console."
    : "";
  $("#login-pw").value = "";
  $("#login-error").textContent = "";
}

function showApp() {
  $("#login").classList.add("hidden");
  $("#app").classList.remove("hidden");
  $("#logout").classList.remove("hidden");
  switchTab(currentTab);
}

$("#login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    await api("POST", "/api/login", { password: $("#login-pw").value });
    showApp();
  } catch (err) {
    $("#login-error").textContent = err.message;
  }
});

$("#logout").addEventListener("click", async () => {
  try { await api("POST", "/api/logout"); } catch (_) {}
  showLogin(false);
});

// ---- tab routing ----

let currentTab = "contacts";
const views = {};

document.querySelectorAll("#tabs button").forEach((b) =>
  b.addEventListener("click", () => switchTab(b.dataset.tab))
);

function switchTab(tab) {
  currentTab = tab;
  document.querySelectorAll("#tabs button").forEach((b) =>
    b.classList.toggle("active", b.dataset.tab === tab)
  );
  const view = $("#view");
  view.replaceChildren();
  views[tab](view).catch(fail);
}

// ---- Contacts ----

views.contacts = async (view) => {
  const contacts = await api("GET", "/api/contacts");

  const nameIn = el("input", { placeholder: "name" });
  const noteIn = el("input", { placeholder: "note" });
  const add = el("button", { textContent: "Add contact" });
  add.onclick = async () => {
    if (!nameIn.value.trim()) return;
    try {
      await api("POST", "/api/contacts", { name: nameIn.value, note: noteIn.value });
      switchTab("contacts");
    } catch (e) { fail(e); }
  };
  view.append(el("div", { className: "toolbar" }, nameIn, noteIn, add));

  const tbl = el("table");
  tbl.append(el("tr", {}, el("th", { textContent: "Name" }),
    el("th", { textContent: "Note" }), el("th", { textContent: "Handles" }),
    el("th", { textContent: "" })));

  for (const c of contacts) {
    const name = el("input", { value: c.name });
    const note = el("input", { value: c.note || "" });

    const handles = el("td");
    for (const h of (c.handles || [])) {
      const rm = el("button", { className: "ghost", textContent: "x" });
      rm.onclick = async () => {
        try { await api("DELETE", "/api/handles", { platform: h.platform, handle: h.handle }); switchTab("contacts"); }
        catch (e) { fail(e); }
      };
      handles.append(el("div", { className: "row-actions" },
        el("span", { className: "tag", textContent: h.platform + ":" + h.handle }), rm));
    }
    const hp = el("input", { placeholder: "platform", style: "width:6rem" });
    const hh = el("input", { placeholder: "handle", style: "width:8rem" });
    const ha = el("button", { className: "ghost", textContent: "+handle" });
    ha.onclick = async () => {
      if (!hp.value || !hh.value) return;
      try { await api("POST", `/api/contacts/${c.id}/handles`, { platform: hp.value, handle: hh.value }); switchTab("contacts"); }
      catch (e) { fail(e); }
    };
    handles.append(el("div", { className: "row-actions" }, hp, hh, ha));

    const save = el("button", { textContent: "Save" });
    save.onclick = async () => {
      try { await api("PUT", `/api/contacts/${c.id}`, { name: name.value, note: note.value }); toast("saved"); }
      catch (e) { fail(e); }
    };
    const del = el("button", { className: "danger", textContent: "Delete" });
    del.onclick = async () => {
      if (!confirm(`Delete ${c.name}?`)) return;
      try { await api("DELETE", `/api/contacts/${c.id}`); switchTab("contacts"); }
      catch (e) { fail(e); }
    };
    tbl.append(el("tr", {}, el("td", {}, name), el("td", {}, note), handles,
      el("td", {}, el("div", { className: "row-actions" }, save, del))));
  }
  view.append(tbl);
};

// ---- Workspaces (Ignore, not Delete) ----

views.workspaces = async (view) => {
  const sync = el("button", { textContent: "Sync now" });
  sync.onclick = async () => {
    try { const r = await api("POST", "/api/workspaces/sync"); toast(r.reply || "synced"); switchTab("workspaces"); }
    catch (e) { fail(e); }
  };
  view.append(el("div", { className: "toolbar" }, sync));

  const ws = await api("GET", "/api/workspaces");
  const tbl = el("table");
  tbl.append(el("tr", {}, el("th", { textContent: "Name" }), el("th", { textContent: "Path" }),
    el("th", { textContent: "Max role" }), el("th", { textContent: "State" }), el("th", { textContent: "" })));

  for (const w of ws) {
    const cap = el("select");
    for (const role of ["read", "confirm", "edit", "full"]) {
      cap.append(el("option", { value: role, textContent: role, selected: w.max_role === role }));
    }
    cap.onchange = async () => {
      try { await api("POST", `/api/workspaces/${w.id}/cap`, { role: cap.value }); toast("cap set"); }
      catch (e) { fail(e); }
    };

    const pin = el("button", { className: "ghost", textContent: w.pinned ? "Unpin" : "Pin" });
    pin.onclick = async () => {
      try { await api("POST", `/api/workspaces/${w.id}/pin`, { pinned: !w.pinned }); switchTab("workspaces"); }
      catch (e) { fail(e); }
    };
    // Ignore (never Delete): there is no delete verb for workspaces.
    const ign = el("button", { className: "ghost", textContent: w.ignored ? "Unignore" : "Ignore" });
    ign.onclick = async () => {
      try { await api("POST", `/api/workspaces/${w.id}/ignore`, { ignored: !w.ignored }); switchTab("workspaces"); }
      catch (e) { fail(e); }
    };

    const state = [];
    if (w.pinned) state.push("pinned");
    if (w.ignored) state.push("ignored");
    if (w.present) state.push("present");

    tbl.append(el("tr", {}, el("td", { textContent: w.name }), el("td", { textContent: w.path }),
      el("td", {}, cap), el("td", { textContent: state.join(", ") || "-" }),
      el("td", {}, el("div", { className: "row-actions" }, pin, ign))));
  }
  view.append(tbl);
};

// ---- Sessions (read-only + label) ----

views.sessions = async (view) => {
  const ws = await api("GET", "/api/workspaces");
  const pick = el("select");
  pick.append(el("option", { value: "", textContent: "— pick a workspace —" }));
  for (const w of ws) pick.append(el("option", { value: w.id, textContent: w.name || w.path }));
  view.append(el("div", { className: "toolbar" }, el("span", { textContent: "Workspace:" }), pick));

  const out = el("div");
  view.append(out);
  pick.onchange = async () => {
    out.replaceChildren();
    if (!pick.value) return;
    let sessions;
    try { sessions = await api("GET", `/api/sessions?workspace=${pick.value}`); }
    catch (e) { return fail(e); }
    const tbl = el("table");
    tbl.append(el("tr", {}, el("th", { textContent: "Title" }), el("th", { textContent: "Backend" }),
      el("th", { textContent: "Label" }), el("th", { textContent: "" })));
    for (const s of sessions) {
      const lbl = el("input", { value: s.label || "" });
      const save = el("button", { textContent: "Set label" });
      save.onclick = async () => {
        try {
          await api("POST", "/api/sessions/label", { workspace_id: Number(pick.value), external_id: s.external_id, label: lbl.value });
          toast("labelled");
        } catch (e) { fail(e); }
      };
      tbl.append(el("tr", {}, el("td", { textContent: s.title || s.external_id }),
        el("td", { textContent: s.backend }), el("td", {}, lbl), el("td", {}, save)));
    }
    out.append(tbl);
  };
};

// ---- Personas (edit only) ----

views.personas = async (view) => {
  const ps = await api("GET", "/api/personas");
  for (const p of ps) {
    const card = el("div", { className: "card", style: "max-width:640px;margin:1rem 0" });
    card.append(el("h3", { textContent: p.display_name || p.key }),
      el("p", { className: "muted", textContent: "key: " + p.key }));

    const name = el("input", { value: p.display_name || "", placeholder: "display name" });
    const model = el("input", { value: p.model || "", placeholder: "model" });
    const backend = el("select");
    for (const b of ["claude", "codex"]) backend.append(el("option", { value: b, textContent: b, selected: p.backend === b }));
    const seed = el("textarea", { value: p.seed_prompt || "" });

    const setField = async (field, value) => {
      try { await api("POST", `/api/personas/${encodeURIComponent(p.key)}`, { field, value }); toast(field + " saved"); }
      catch (e) { fail(e); }
    };

    card.append(
      labeled("Display name", name, el("button", { textContent: "Save", onclick: () => setField("name", name.value) })),
      labeled("Backend", backend, el("button", { textContent: "Save", onclick: () => setField("backend", backend.value) })),
      labeled("Model", model, el("button", { textContent: "Save", onclick: () => setField("model", model.value) })),
      el("label", { textContent: "Seed prompt" }), seed,
      el("button", { textContent: "Save seed", onclick: () => setField("seed", seed.value) })
    );
    view.append(card);
  }
};

function labeled(text, ...controls) {
  const row = el("div", { className: "toolbar" }, el("span", { textContent: text, style: "width:8rem" }));
  for (const c of controls) row.append(c);
  return row;
}

// ---- Allowlist ----

views.allowlist = async (view) => {
  const handle = el("input", { placeholder: "@handle" });
  const role = el("select");
  for (const r of ["read", "confirm", "edit", "full"]) role.append(el("option", { value: r, textContent: r }));
  const add = el("button", { textContent: "Add" });
  add.onclick = async () => {
    if (!handle.value.trim()) return;
    try { await api("POST", "/api/allowlist", { handle: handle.value, role: role.value }); switchTab("allowlist"); }
    catch (e) { fail(e); }
  };
  view.append(el("div", { className: "toolbar" }, handle, role, add));

  const entries = await api("GET", "/api/allowlist");
  const tbl = el("table");
  tbl.append(el("tr", {}, el("th", { textContent: "ID" }), el("th", { textContent: "Platform" }),
    el("th", { textContent: "Handle" }), el("th", { textContent: "Max role" }), el("th", { textContent: "" })));
  for (const a of entries) {
    const rm = el("button", { className: "danger", textContent: "Remove" });
    rm.onclick = async () => {
      try { await api("DELETE", `/api/allowlist/${a.id}`); switchTab("allowlist"); }
      catch (e) { fail(e); }
    };
    tbl.append(el("tr", {}, el("td", { textContent: a.id }), el("td", { textContent: a.platform }),
      el("td", { textContent: a.handle }), el("td", { textContent: a.max_role }), el("td", {}, rm)));
  }
  view.append(tbl);
};

// ---- Settings ----

views.settings = async (view) => {
  // Password change control.
  const pwCard = el("div", { className: "card", style: "max-width:480px;margin:0 0 1.5rem" });
  const pw = el("input", { type: "password", placeholder: "new password" });
  const pwBtn = el("button", { textContent: "Change password" });
  pwBtn.onclick = async () => {
    if (pw.value.length < 6) return toast("password too short");
    try { await api("POST", "/api/password", { password: pw.value }); pw.value = ""; toast("password changed"); }
    catch (e) { fail(e); }
  };
  pwCard.append(el("h3", { textContent: "Owner password" }), el("div", { className: "toolbar" }, pw, pwBtn));
  view.append(pwCard);

  // New key/value.
  const k = el("input", { placeholder: "key (e.g. console.port)" });
  const v = el("input", { placeholder: "value" });
  const setBtn = el("button", { textContent: "Set" });
  setBtn.onclick = async () => {
    if (!k.value.trim()) return;
    try { await api("POST", "/api/settings", { key: k.value, value: v.value }); switchTab("settings"); }
    catch (e) { fail(e); }
  };
  view.append(el("div", { className: "toolbar" }, k, v, setBtn));

  const m = await api("GET", "/api/settings");
  const tbl = el("table");
  tbl.append(el("tr", {}, el("th", { textContent: "Key" }), el("th", { textContent: "Value" }), el("th", { textContent: "" })));
  for (const key of Object.keys(m).sort()) {
    const val = el("input", { value: m[key] });
    const save = el("button", { textContent: "Save" });
    save.onclick = async () => {
      try { await api("POST", "/api/settings", { key, value: val.value }); toast("saved"); }
      catch (e) { fail(e); }
    };
    tbl.append(el("tr", {}, el("td", { textContent: key }), el("td", {}, val), el("td", {}, save)));
  }
  view.append(tbl);
};

boot().catch((e) => { showLogin(false); console.error(e); });
