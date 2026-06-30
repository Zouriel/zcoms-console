import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UiToastService } from 'ui/dialog';
import type { UiStatus } from 'ui';
import { Api } from '../core/api';
import { UI } from '../core/ui';

interface Reminder {
  id: number;
  target_name?: string;
  target_transport: string;
  task_text: string;
  kind: string;
  recur_spec?: string;
  deadline_bound: boolean;
  state: string;
  next_at?: string;
  attempts: number;
}
interface RConfig {
  enabled: boolean; voice: string;
  first_nudge_mins: number; followup_mins: number;
  deadline_lead_mins: number; deadline_after_mins: number; max_nudges: number;
}
interface REvent { id: number; reminder_id: number; at: string; kind: string; detail?: string; }

const ACTIVE = ['scheduled', 'pre_reminded', 'awaiting_confirm', 'snoozed'];
const TONE: Record<string, UiStatus> = {
  scheduled: 'primary', pre_reminded: 'primary', snoozed: 'primary',
  awaiting_confirm: 'warning', done: 'success', missed: 'danger', cancelled: 'neutral',
};
const VOICES = [{ label: 'Agent (written each time)', value: 'agent' }, { label: 'Simple (templates)', value: 'simple' }];

@Component({
  selector: 'app-reminders',
  imports: [FormsModule, ...UI],
  template: `
    <div class="page-head">
      <ui-text variant="caption" class="muted">stateful reminders the agent drives — it nudges, checks in, motivates, and only closes when the task is actually done</ui-text>
    </div>

    <!-- Settings / tweaks -->
    <ui-card padding="md">
      <ui-text variant="h4">Settings</ui-text>
      @if (cfg(); as c) {
        <div class="grid">
          <label class="sw"><ui-switch [(ngModel)]="c.enabled"></ui-switch> Reminders enabled</label>
          <ui-form-field label="Voice" hint="how the messages are written">
            <ui-select [options]="voices" [(ngModel)]="c.voice"></ui-select>
          </ui-form-field>
          <ui-form-field label="First-nudge delay (min)" hint="when no time is given">
            <ui-input inputmode="numeric" [(ngModel)]="c.first_nudge_mins"></ui-input>
          </ui-form-field>
          <ui-form-field label="Follow-up gap (min)" hint="before 'did you do it?'">
            <ui-input inputmode="numeric" [(ngModel)]="c.followup_mins"></ui-input>
          </ui-form-field>
          <ui-form-field label="Deadline lead (min)" hint="nudge before a timed event">
            <ui-input inputmode="numeric" [(ngModel)]="c.deadline_lead_mins"></ui-input>
          </ui-form-field>
          <ui-form-field label="Deadline after (min)" hint="ask how it went, after">
            <ui-input inputmode="numeric" [(ngModel)]="c.deadline_after_mins"></ui-input>
          </ui-form-field>
          <ui-form-field label="Max nudges" hint="chase cap for open tasks">
            <ui-input inputmode="numeric" [(ngModel)]="c.max_nudges"></ui-input>
          </ui-form-field>
        </div>
        <div class="row">
          <span class="spacer"></span>
          <ui-button variant="primary" [disabled]="saving()" (click)="saveCfg(c)">Save settings</ui-button>
        </div>
      } @else { <ui-spinner></ui-spinner> }
    </ui-card>

    <div style="height:16px"></div>

    <!-- Quick create -->
    <ui-card padding="md">
      <ui-text variant="h4">New reminder</ui-text>
      <div class="create">
        <span class="prefix">remind</span>
        <ui-input class="grow" [(ngModel)]="line" placeholder="me to water the plants in 20 min  ·  Sara to send the invoice  ·  me about the 4pm call"></ui-input>
        <ui-button variant="primary" [disabled]="!line.trim()" (click)="create()">Add</ui-button>
      </div>
    </ui-card>

    <div style="height:16px"></div>

    <!-- List + logs -->
    <ui-card padding="md">
      @if (loading()) { <ui-spinner></ui-spinner> } @else {
        <div class="tbl-scroll"><table class="tbl">
          <thead><tr><th>Status</th><th>To</th><th>Task</th><th>When</th><th style="width:1%"></th></tr></thead>
          <tbody>
            @for (r of reminders(); track r.id) {
              <tr>
                <td><ui-badge [tone]="tone(r.state)">{{ r.state }}</ui-badge></td>
                <td>{{ r.target_name || 'you' }}<span class="muted"> · {{ r.target_transport }}</span></td>
                <td>{{ r.task_text }}@if (r.kind === 'recurring') { <span class="muted"> ({{ r.recur_spec }})</span> }</td>
                <td class="muted">{{ when(r) }}</td>
                <td class="actions">
                  <ui-button variant="ghost" size="sm" (click)="toggleLog(r.id)">{{ open().has(r.id) ? 'Hide' : 'Log' }}</ui-button>
                  @if (isActive(r.state)) { <ui-button variant="destructive" size="sm" (click)="cancel(r)">Cancel</ui-button> }
                </td>
              </tr>
              @if (open().has(r.id)) {
                <tr class="logrow"><td colspan="5">
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
            } @empty { <tr><td colspan="5" class="empty">No reminders yet — add one above or text the agent.</td></tr> }
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
  voices = VOICES;

  constructor() { this.load(); this.loadCfg(); }

  tone(state: string): UiStatus { return TONE[state] || 'neutral'; }
  isActive(state: string) { return ACTIVE.includes(state); }
  when(r: Reminder) {
    if (!this.isActive(r.state)) return '—';
    if (!r.next_at) return 'soon';
    const verb = r.state === 'awaiting_confirm' ? 're-check' : 'next';
    return `${verb} ${this.ts(r.next_at)}`;
  }
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
      ['enabled', String(c.enabled)], ['voice', c.voice],
      ['first_nudge_mins', String(c.first_nudge_mins)], ['followup_mins', String(c.followup_mins)],
      ['deadline_lead_mins', String(c.deadline_lead_mins)], ['deadline_after_mins', String(c.deadline_after_mins)],
      ['max_nudges', String(c.max_nudges)],
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
    try {
      await this.api.post(`/api/reminders/${r.id}/cancel`);
      this.toast.success('Cancelled');
      await this.load();
    } catch (e: any) { this.toast.danger(e.message, 'Cancel failed'); }
  }
}
