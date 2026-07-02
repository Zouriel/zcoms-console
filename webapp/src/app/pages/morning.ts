import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UiToastService } from 'ui/dialog';
import { Api } from '../core/api';
import { UI } from '../core/ui';

interface MConfig { enabled: boolean; }
interface Reminder {
  id: number;
  recipient_name?: string;
  task: string;
  state: string;
  next_at?: string;
}

@Component({
  selector: 'app-morning',
  imports: [FormsModule, ...UI],
  template: `
    <div class="page-head">
      <ui-text variant="caption" class="muted">around 6am the morning agent greets you and waits until you reply, then walks you through the events you have that day and offers to reschedule or add anything</ui-text>
    </div>

    <ui-card padding="md">
      <ui-text variant="h4">Settings</ui-text>
      @if (cfg(); as c) {
        <div class="grid">
          <label class="sw"><ui-switch [(ngModel)]="c.enabled"></ui-switch> Morning agent enabled</label>
        </div>
        <ui-text variant="caption" class="muted" style="display:block;margin-top:8px">
          It fires once a day around 6am. If you don't reply it re-nudges gently a couple of times, then lets the day go. Tone and wording are the Morning assistant agent's job — edit its prompt + backend on the Personas page.
        </ui-text>
        <div class="row">
          <span class="spacer"></span>
          <ui-button variant="primary" [disabled]="saving()" (click)="saveCfg(c)">Save settings</ui-button>
        </div>
      } @else { <ui-spinner></ui-spinner> }
    </ui-card>

    <div style="height:16px"></div>

    <ui-card padding="md">
      <ui-text variant="h4">Today's events</ui-text>
      <ui-text variant="caption" class="muted" style="display:block;margin-bottom:8px">
        what this morning's briefing would cover (your active events for today). Add or reschedule from the Reminders page, or just tell the agent at 6am.
      </ui-text>
      @if (loading()) { <ui-spinner></ui-spinner> } @else {
        <div class="tbl-scroll"><table class="tbl">
          <thead><tr><th style="width:1%">Time</th><th>Event</th><th>To</th></tr></thead>
          <tbody>
            @for (r of today(); track r.id) {
              <tr>
                <td class="muted nowrap">{{ tm(r.next_at) }}</td>
                <td>{{ r.task }}</td>
                <td class="muted">{{ r.recipient_name || 'you' }}</td>
              </tr>
            } @empty { <tr><td colspan="3" class="empty">Nothing on the calendar for today yet.</td></tr> }
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
    .nowrap { white-space: nowrap; }
  `],
})
export class MorningPage {
  private api = inject(Api);
  private toast = inject(UiToastService);
  cfg = signal<MConfig | null>(null);
  reminders = signal<Reminder[]>([]);
  loading = signal(true);
  saving = signal(false);

  today = computed(() =>
    this.reminders()
      .filter((r) => r.state === 'active' && this.isToday(r.next_at))
      .sort((a, b) => (a.next_at || '').localeCompare(b.next_at || '')),
  );

  constructor() { this.load(); this.loadCfg(); }

  tm(iso?: string) { return iso ? new Date(iso).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }) : '—'; }
  isToday(iso?: string) {
    if (!iso) return false;
    const d = new Date(iso), n = new Date();
    return d.getFullYear() === n.getFullYear() && d.getMonth() === n.getMonth() && d.getDate() === n.getDate();
  }

  async load() {
    this.loading.set(true);
    try { this.reminders.set((await this.api.get('/api/reminders')) || []); }
    catch (e: any) { this.toast.danger(e.message, 'Load failed'); }
    finally { this.loading.set(false); }
  }
  async loadCfg() {
    try { this.cfg.set(await this.api.get('/api/morning/settings')); }
    catch (e: any) { this.toast.danger(e.message, 'Settings load failed'); }
  }

  async saveCfg(c: MConfig) {
    this.saving.set(true);
    try {
      await this.api.post('/api/morning/settings', { field: 'enabled', value: String(c.enabled) });
      this.toast.success('Settings saved');
      await this.loadCfg();
    } catch (e: any) { this.toast.danger(e.message, 'Save failed'); }
    finally { this.saving.set(false); }
  }
}
