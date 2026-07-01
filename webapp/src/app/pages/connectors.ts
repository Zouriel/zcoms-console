import { Component, OnDestroy, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Api } from '../core/api';
import { UI } from '../core/ui';
import { UiToastService } from 'ui/dialog';

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
// roadmap is visible. Discord/Viber have no real-account API (self-bot /
// commercial-only), so they're parked. Instagram is now registered (it logs in
// via username/password + 2FA/challenge rather than a QR).
const RESERVED = [
  { transport: 'discord', label: 'Discord', note: 'No real-account API (a user token = a self-bot, ToS-bannable). Reserved.' },
  { transport: 'viber', label: 'Viber', note: 'No real-account API (bot/commercial only). Reserved.' },
];

const LABELS: Record<string, string> = { telegram: 'Telegram', whatsapp: 'WhatsApp', instagram: 'Instagram', discord: 'Discord', viber: 'Viber' };

@Component({
  selector: 'app-connectors',
  imports: [FormsModule, ...UI],
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

          @if (canPair(c)) {
            <div style="margin-top:14px">
              <ui-button variant="primary" size="sm" (click)="openPairing(c.transport)">
                {{ c.state === 'connected' ? 'Re-link' : (c.state === 'error' || c.state === 'session_expired' ? 'Retry pairing' : 'Pair ' + label(c.transport)) }}
              </ui-button>
            </div>
          }

          @if (isInstagram(c)) {
            <div style="margin-top:14px">
              @if (c.state === 'action_required' && needsCode(c)) {
                <div class="ig-code">
                  <ui-input [(ngModel)]="igCode" placeholder="Enter the code" size="sm"></ui-input>
                  <ui-button variant="primary" size="sm" [disabled]="busy() || !igCode.trim()" (click)="submitCode()">Submit code</ui-button>
                </div>
                <ui-text variant="caption" class="muted" style="display:block;margin-top:8px">
                  Instagram sent a code (SMS / email / authenticator). Enter it to finish signing in.
                </ui-text>
              } @else if (c.state !== 'connected') {
                <div class="ig-form">
                  <ui-input [(ngModel)]="igUser" placeholder="username" size="sm" autocomplete="off"></ui-input>
                  <ui-input [(ngModel)]="igPass" type="password" placeholder="password" size="sm" autocomplete="off"></ui-input>
                  <ui-input [(ngModel)]="igProxy" placeholder="proxy (optional, recommended)" size="sm"></ui-input>
                  <ui-button variant="primary" size="sm" [disabled]="busy() || !igUser.trim() || !igPass" (click)="igSaveAndLogin()">
                    {{ c.state === 'error' || c.state === 'session_expired' ? 'Log in again' : 'Log in' }}
                  </ui-button>
                </div>
                <ui-text variant="caption" class="muted" style="display:block;margin-top:8px">
                  Unofficial private API, real ban risk. Use a secondary account, ideally behind a proxy. Credentials are stored locally (0600) in ~/.config/zcoms/instagram.json.
                </ui-text>
              } @else {
                <ui-button variant="ghost" size="sm" [disabled]="busy()" (click)="igLogout()">Log out</ui-button>
              }
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

    <ui-modal [(open)]="qrModal" [title]="'Pair ' + label(qrTransport())" size="sm">
      <div class="qr-wrap">
        @if (activeQR()) {
          <img class="qr" [src]="qrSrc(qrTransport())" alt="pairing QR" width="260" height="260" />
          <ui-text variant="caption" class="muted">
            On your phone: WhatsApp → Settings → Linked Devices → Link a device, then scan. A fresh code is generated automatically if this one expires.
          </ui-text>
        } @else {
          <ui-spinner></ui-spinner>
          <ui-text variant="caption" class="muted">Generating a fresh code…</ui-text>
        }
        <ui-button variant="ghost" size="sm" (click)="regenerate()">Regenerate code</ui-button>
      </div>
    </ui-modal>
  `,
  styles: [`
    .conn-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
    .qr-wrap { display: flex; flex-direction: column; align-items: center; gap: 12px; text-align: center; padding: 8px 0; }
    .qr { background: #fff; padding: 10px; border-radius: var(--ui-radius); image-rendering: pixelated; }
    .caps { display: flex; gap: 6px; margin-top: 14px; flex-wrap: wrap; }
    .reserved { opacity: 0.6; }
    .ig-form { display: flex; flex-direction: column; gap: 8px; }
    .ig-code { display: flex; gap: 8px; align-items: center; }
  `],
})
export class ConnectorsPage implements OnDestroy {
  private api = inject(Api);
  private toast = inject(UiToastService);
  connectors = signal<Connector[]>([]);
  error = signal('');
  reserved = RESERVED;
  qrModal = signal(false);
  qrTransport = signal('whatsapp');
  igCode = '';
  igUser = '';
  igPass = '';
  igProxy = '';
  busy = signal(false);
  private tick = signal(0);
  private timer: any;
  private rearming = false;

  // The QR is ready when the connector for the open modal currently has one.
  activeQR = computed(() => {
    const c = this.connectors().find((x) => x.transport === this.qrTransport());
    return !!c?.has_qr;
  });

  constructor() {
    this.load();
    this.timer = setInterval(() => this.load(), 2000);
  }

  ngOnDestroy() { clearInterval(this.timer); }

  async load() {
    try {
      const res = await this.api.get('/api/connectors');
      this.connectors.set(res?.connectors || []);
      this.error.set('');
      this.tick.update((n) => n + 1);
      this.watchPairing();
    } catch (e: any) {
      this.error.set('Comms daemon unreachable — ' + (e?.message || 'is it running?'));
    }
  }

  // While the QR modal is open: close it on success, and silently re-arm a fresh
  // code if the current one expired (so the modal always shows a scannable QR).
  private watchPairing() {
    if (!this.qrModal()) return;
    const c = this.connectors().find((x) => x.transport === this.qrTransport());
    if (!c) return;
    if (c.state === 'connected') {
      this.qrModal.set(false);
      this.toast.success(this.label(c.transport) + ' paired');
      return;
    }
    if ((c.state === 'error' || c.state === 'session_expired') && !this.rearming) {
      this.reconnect(this.qrTransport());
    }
  }

  // Open the modal and arm a fresh code.
  async openPairing(transport: string) {
    this.qrTransport.set(transport);
    this.qrModal.set(true);
    await this.reconnect(transport);
  }

  async regenerate() { await this.reconnect(this.qrTransport()); }

  private async reconnect(transport: string) {
    if (this.rearming) return;
    this.rearming = true;
    try {
      await this.api.post(`/api/connectors/${transport}/reconnect`);
      await this.load();
    } catch (e: any) {
      this.toast.danger(e.message, 'Pairing failed');
    } finally {
      this.rearming = false;
    }
  }

  // Which transports expose a QR pairing flow (Telegram is always on; Instagram
  // uses username/password, handled separately below).
  canPair(c: Connector) { return c.transport === 'whatsapp'; }

  // Instagram uses a login + 2FA/challenge code flow instead of a QR.
  isInstagram(c: Connector) { return c.transport === 'instagram'; }
  needsCode(c: Connector) {
    return c.detail === 'needs_2fa' || c.detail === 'needs_challenge' || c.detail === 'needs_code';
  }

  // Save the entered credentials, then trigger the login. Blank fields fall back
  // to whatever is already stored (a plain re-login).
  async igSaveAndLogin() {
    const u = this.igUser.trim();
    const p = this.igPass;
    if (u && p) {
      this.busy.set(true);
      try {
        await this.api.post('/api/connectors/instagram/credentials', { username: u, password: p, proxy: this.igProxy.trim() });
      } catch (e: any) {
        this.toast.danger(e.message, 'Instagram');
        this.busy.set(false);
        return;
      }
      this.busy.set(false);
    }
    await this.igLogin();
    this.igPass = '';
  }

  async igLogin() { await this.igAction('login'); }
  async igLogout() { await this.igAction('logout'); }
  async submitCode() {
    const code = this.igCode.trim();
    if (!code) return;
    await this.igAction('code_' + encodeURIComponent(code));
    this.igCode = '';
  }

  private async igAction(action: string) {
    if (this.busy()) return;
    this.busy.set(true);
    try {
      await this.api.post(`/api/connectors/instagram/${action}`);
      await this.load();
    } catch (e: any) {
      this.toast.danger(e.message, 'Instagram');
    } finally {
      this.busy.set(false);
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
      case 'error': return 'Needs pairing';
      default: return state;
    }
  }
  detailLine(c: Connector) {
    if (c.state === 'session_expired') return 'Re-login needed — the account signed this session out.';
    if (c.state === 'error') return c.detail?.includes('timed out') ? 'The pairing code expired — tap Retry to get a fresh one.' : (c.detail || 'Pairing needed.');
    switch (c.detail) {
      case 'needs_qr': return 'Tap Pair to scan a QR and link this account.';
      case 'needs_code': return 'Waiting for the login code.';
      case 'needs_2fa': return 'Two-factor code required.';
      case 'needs_challenge': return 'Confirm the security challenge (SMS/email).';
      case 'needs_password': return 'Password required.';
      default: return '';
    }
  }
}
