import { Injectable, signal } from '@angular/core';

// TeamLive keeps one EventSource onto /api/team/events for the whole app.
//
// The server polls the team module's cheap digest verb and pushes a version
// token whenever anything changes, so a panel refetches only when there is
// something new — and it sees edits made from Telegram or the CLI, not just the
// ones this browser made. Pages watch `version` in an effect and reload.
//
// Reference-counted: the Team shell starts it on enter and releases on leave, so
// no stream is held open while you are on another page.
@Injectable({ providedIn: 'root' })
export class TeamLive {
  /** Bumps whenever team data changes. Watch this to refetch. */
  readonly version = signal('');
  /** Whether the team module is answering. */
  readonly running = signal(true);
  /** Whether the event stream itself is connected. */
  readonly connected = signal(false);

  private es?: EventSource;
  private refs = 0;

  acquire() {
    this.refs++;
    if (this.es) return;
    this.open();
  }

  release() {
    this.refs = Math.max(0, this.refs - 1);
    if (this.refs > 0) return;
    this.es?.close();
    this.es = undefined;
    this.connected.set(false);
  }

  private open() {
    // EventSource is same-origin and sends the session cookie, so the stream is
    // gated by the same auth as every other /api call.
    const es = new EventSource('/api/team/events');
    this.es = es;
    es.addEventListener('change', (e) => {
      this.connected.set(true);
      try {
        const d = JSON.parse((e as MessageEvent).data);
        this.running.set(!!d.running);
        // Always write: the token is the trigger, and an identical token means
        // the server decided nothing changed (it only sends on change).
        this.version.set(String(d.version ?? ''));
      } catch { /* ignore a malformed frame; the next one will do */ }
    });
    es.onopen = () => this.connected.set(true);
    // EventSource reconnects on its own; just reflect the outage in the UI.
    es.onerror = () => this.connected.set(false);
  }
}
