import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UiToastService } from 'ui/dialog';
import type { UiStatus } from 'ui';
import { Api } from '../core/api';
import { UI } from '../core/ui';

interface Reminder {
  id: number;
  from_name?: string;
  recipient_transport: string;
  recipient_name?: string;
  task: string;
  carry_over?: string;
  state: string;
  next_at?: string;
  runs: number;
}
interface RConfig { enabled: boolean; max_runs: number; reply_wait_mins: number; }
interface REvent { id: number; reminder_id: number; at: string; kind: string; detail?: string; }

const TONE: Record<string, UiStatus> = { active: 'primary', done: 'success', cancelled: 'neutral' };

@Component({
  selector: 'app-reminders',
  imports: [FormsModule, ...UI],
  template: `
    <div class="page-head">
      <ui-text variant="caption" class="muted">an agent drives each reminder one run at a time: it composes the message, waits for the reply, and leaves itself a note for next time</ui-text>
    </div>

    <ui-card padding="md">
      <ui-text variant="h4">Settings</ui-text>
      @if (cfg(); as c) {
        <div class="grid">
          <label class="sw"><ui-switch [(ngModel)]="c.enabled"></ui-switch> Reminders enabled</label>
          <ui-form-field label="Max runs" hint="safety cap per reminder">
            <ui-input inputmode="numeric" [(ngModel)]="c.max_runs"></ui-input>
          </ui-form-field>
          <ui-form-field label="Reply wait (min)" hint="how long a run waits for the reply">
            <ui-input inputmode="numeric" [(ngModel)]="c.reply_wait_mins"></ui-input>
          </ui-form-field>
        </div>
        <ui-text variant="caption" class="muted" style="display:block;margin-top:8px">
          Tone, timing and wording are decided by the Reminder assistant agent — edit its prompt + backend on the Personas page.
        </ui-text>
        <div class="row">
          <span class="spacer"></span>
          <ui-button variant="primary" [disabled]="saving()" (click)="saveCfg(c)">Save settings</ui-button>
        </div>
      } @else { <ui-spinner></ui-spinner> }
    </ui-card>

    <div style="height:16px"></div>

    <ui-card padding="md">
      <ui-text variant="h4">New reminder</ui-text>
      <div class="create">
        <span class="prefix">remind</span>
        <ui-input class="grow" [(ngModel)]="line" placeholder="me to water the plants in 20 min  ·  Sara to send the invoice  ·  me to get ready for class at 6"></ui-input>
        <ui-button variant="primary" [disabled]="!line.trim()" (click)="create()">Add</ui-button>
      </div>
    </ui-card>

    <div style="height:16px"></div>

    <ui-card padding="md">
      @if (loading()) { <ui-spinner></ui-spinner> } @else {
        <div class="tbl-scroll"><table class="tbl">
          <thead><tr><th>Status</th><th>To</th><th>Task</th><th>Agent's note</th><th>Next run</th><th style="width:1%"></th></tr></thead>
          <tbody>
            @for (r of reminders(); track r.id) {
              <tr>
                <td><ui-badge [tone]="tone(r.state)">{{ r.state }}</ui-badge></td>
                <td>{{ r.recipient_name || 'you' }}<span class="muted"> · {{ r.recipient_transport }}</span></td>
                <td>{{ r.task }}</td>
                <td class="muted note">{{ r.carry_over || '—' }}</td>
                <td class="muted">{{ r.state === 'active' ? ts(r.next_at) : '—' }}</td>
                <td class="actions">
                  <ui-button variant="ghost" size="sm" (click)="toggleLog(r.id)">{{ open().has(r.id) ? 'Hide' : 'Log' }}</ui-button>
                  @if (r.state === 'active') { <ui-button variant="destructive" size="sm" (click)="cancel(r)">Cancel</ui-button> }
                </td>
              </tr>
              @if (open().has(r.id)) {
                <tr class="logrow"><td colspan="6">
                  @if (events()[r.id]; as evs) {
                    @if (evs.length) {
                      <ul class="log">
                        @for (e of evs; track e.id) {
                          <li><span class="muted">{{ ts(e.at) }}</span> <b>{{ e.kind }}</b>@if (e.detail) { — {{ e.detail }} }</li>
                        }
                      </ul>
                    } @else { <span class="muted">No events yet.</span> }
                  } @else { <ui-spinner></ui-spinner> }
                </td></tr>
              }
            } @empty { <tr><td colspan="6" class="empty">No reminders yet — add one above or text the agent.</td></tr> }
          </tbody>
        </table></div>
      }
    </ui-card>
  `,
  styles: [`
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 12px; margin-top: 10px; align-items: end; }
    .sw { display: inline-flex; gap: 8px; align-items: center; }
    .row { display: flex; align-items: center; margin-top: 14px; }
    .spacer { flex: 1; }
    .create { display: flex; gap: 8px; align-items: center; margin-top: 10px; }
    .create .prefix { color: var(--ui-color-text-muted); font-family: var(--ui-font-mono, monospace); }
    .grow { flex: 1; }
    .note { max-width: 280px; }
    .actions { display: flex; gap: 6px; justify-content: flex-end; }
    .logrow td { background: var(--ui-color-surface-raised); }
    .log { margin: 4px 0; padding-left: 18px; display: flex; flex-direction: column; gap: 3px; }
    .log li { font-size: var(--ui-font-size-sm); }
  `],
})
export class RemindersPage {
  private api = inject(Api);
  private toast = inject(UiToastService);
  reminders = signal<Reminder[]>([]);
  cfg = signal<RConfig | null>(null);
  events = signal<Record<number, REvent[]>>({});
  open = signal<Set<number>>(new Set());
  loading = signal(true);
  saving = signal(false);
  line = '';

  constructor() { this.load(); this.loadCfg(); }

  tone(state: string): UiStatus { return TONE[state] || 'neutral'; }
  ts(iso?: string) { return iso ? new Date(iso).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''; }

  async load() {
    this.loading.set(true);
    try { this.reminders.set((await this.api.get('/api/reminders')) || []); }
    catch (e: any) { this.toast.danger(e.message, 'Load failed'); }
    finally { this.loading.set(false); }
  }
  async loadCfg() {
    try { this.cfg.set(await this.api.get('/api/reminders/settings')); }
    catch (e: any) { this.toast.danger(e.message, 'Settings load failed'); }
  }

  async saveCfg(c: RConfig) {
    this.saving.set(true);
    const fields: [string, string][] = [
      ['enabled', String(c.enabled)], ['max_runs', String(c.max_runs)], ['reply_wait_mins', String(c.reply_wait_mins)],
    ];
    try {
      for (const [field, value] of fields) await this.api.post('/api/reminders/settings', { field, value });
      this.toast.success('Settings saved');
      await this.loadCfg();
    } catch (e: any) { this.toast.danger(e.message, 'Save failed'); }
    finally { this.saving.set(false); }
  }

  async create() {
    const line = this.line.trim();
    if (!line) return;
    try {
      const res: any = await this.api.post('/api/reminders', { line });
      this.toast.success(res?.reply || 'Added');
      this.line = '';
      await this.load();
    } catch (e: any) { this.toast.danger(e.message, 'Add failed'); }
  }

  async toggleLog(id: number) {
    const s = new Set(this.open());
    if (s.has(id)) { s.delete(id); this.open.set(s); return; }
    s.add(id); this.open.set(s);
    if (!this.events()[id]) {
      try {
        const evs = (await this.api.get(`/api/reminders/${id}/events`)) || [];
        this.events.set({ ...this.events(), [id]: evs });
      } catch (e: any) { this.toast.danger(e.message, 'Log failed'); }
    }
  }

  async cancel(r: Reminder) {
    try { await this.api.post(`/api/reminders/${r.id}/cancel`); this.toast.success('Cancelled'); await this.load(); }
    catch (e: any) { this.toast.danger(e.message, 'Cancel failed'); }
  }
}
