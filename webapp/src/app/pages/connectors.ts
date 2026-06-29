import { Component, OnDestroy, computed, inject, signal } from '@angular/core';
import { Api } from '../core/api';
import { UI } from '../core/ui';

interface Caps { receive: boolean; blocking_ask: boolean; files: boolean; presence: boolean; }
interface Connector {
  transport: string;
  state: string;
  detail?: string;
  since?: number;
  caps: Caps;
  has_qr?: boolean;
}

// Reserved transports the daemon doesn't register: shown as inert cards so the
// roadmap is visible. Instagram lands in Phase C; Discord/Viber have no
// real-account API (self-bot / commercial-only), so they're parked.
const RESERVED = [
  { transport: 'instagram', label: 'Instagram', note: 'Coming soon — real personal account via the private API (Phase C).', state: 'unavailable' },
  { transport: 'discord', label: 'Discord', note: 'No real-account API (a user token = a self-bot, ToS-bannable). Reserved.', state: 'unavailable' },
  { transport: 'viber', label: 'Viber', note: 'No real-account API (bot/commercial only). Reserved.', state: 'unavailable' },
];

const LABELS: Record<string, string> = { telegram: 'Telegram', whatsapp: 'WhatsApp', instagram: 'Instagram', discord: 'Discord', viber: 'Viber' };

@Component({
  selector: 'app-connectors',
  imports: [...UI],
  template: `
    <div class="page-head">
      <ui-text variant="caption" class="muted">your connected accounts — live status, and pairing where an account needs it</ui-text>
    </div>

    @if (error()) { <ui-alert tone="danger">{{ error() }}</ui-alert> }

    <ui-grid min="320px" [gap]="4">
      @for (c of connectors(); track c.transport) {
        <ui-card padding="md">
          <div class="conn-head">
            <ui-text variant="h4">{{ label(c.transport) }}</ui-text>
            <ui-badge [tone]="tone(c.state)">{{ stateLabel(c.state) }}</ui-badge>
          </div>

          @if (detailLine(c)) {
            <ui-text variant="caption" class="muted" style="display:block;margin-top:6px">{{ detailLine(c) }}</ui-text>
          }

          @if (c.has_qr) {
            <div class="qr-wrap">
              <img class="qr" [src]="qrSrc(c.transport)" alt="WhatsApp pairing QR" width="240" height="240" />
              <ui-text variant="caption" class="muted">
                On your phone: WhatsApp → Settings → Linked Devices → Link a device, then scan. The code refreshes automatically.
              </ui-text>
            </div>
          }

          @if (c.caps && c.state === 'connected') {
            <div class="caps">
              @if (c.caps.receive) { <ui-chip>receive</ui-chip> }
              @if (c.caps.blocking_ask) { <ui-chip>ask</ui-chip> }
              @if (c.caps.files) { <ui-chip>files</ui-chip> }
            </div>
          }
        </ui-card>
      }

      @for (r of reserved; track r.transport) {
        <ui-card padding="md" class="reserved">
          <div class="conn-head">
            <ui-text variant="h4">{{ r.label }}</ui-text>
            <ui-badge tone="neutral">unavailable</ui-badge>
          </div>
          <ui-text variant="caption" class="muted" style="display:block;margin-top:6px">{{ r.note }}</ui-text>
        </ui-card>
      }
    </ui-grid>
  `,
  styles: [`
    .conn-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
    .qr-wrap { display: flex; flex-direction: column; align-items: center; gap: 10px; margin-top: 16px; text-align: center; }
    .qr { background: #fff; padding: 10px; border-radius: var(--ui-radius); image-rendering: pixelated; }
    .caps { display: flex; gap: 6px; margin-top: 14px; flex-wrap: wrap; }
    .reserved { opacity: 0.6; }
  `],
})
export class ConnectorsPage implements OnDestroy {
  private api = inject(Api);
  connectors = signal<Connector[]>([]);
  error = signal('');
  reserved = RESERVED;
  private tick = signal(0);
  private timer: any;

  constructor() {
    this.load();
    // Live poll: status (and a freshly-rotated WhatsApp QR) reflect within ~2s.
    this.timer = setInterval(() => this.load(), 2000);
  }

  ngOnDestroy() { clearInterval(this.timer); }

  async load() {
    try {
      const res = await this.api.get('/api/connectors');
      this.connectors.set(res?.connectors || []);
      this.error.set('');
      this.tick.update((n) => n + 1);
    } catch (e: any) {
      this.error.set('Comms daemon unreachable — ' + (e?.message || 'is it running?'));
    }
  }

  label(t: string) { return LABELS[t] || t; }
  qrSrc(t: string) { return `/api/connectors/${t}/qr?t=${this.tick()}`; }

  tone(state: string) {
    switch (state) {
      case 'connected': return 'success';
      case 'connecting': return 'warning';
      case 'action_required': return 'warning';
      case 'error':
      case 'session_expired': return 'danger';
      default: return 'neutral';
    }
  }
  stateLabel(state: string) {
    switch (state) {
      case 'connected': return 'Connected';
      case 'connecting': return 'Connecting…';
      case 'action_required': return 'Action needed';
      case 'disconnected': return 'Disconnected';
      case 'session_expired': return 'Session expired';
      case 'error': return 'Error';
      default: return state;
    }
  }
  detailLine(c: Connector) {
    if (c.state === 'session_expired') return 'Re-login needed — the account signed this session out.';
    switch (c.detail) {
      case 'needs_qr': return 'Scan the QR below to pair this account.';
      case 'needs_code': return 'Waiting for the login code.';
      case 'needs_2fa': return 'Two-factor code required.';
      case 'needs_challenge': return 'Confirm the security challenge (SMS/email).';
      case 'needs_password': return 'Password required.';
      default: return c.state === 'error' ? (c.detail || 'Something went wrong.') : '';
    }
  }
}
