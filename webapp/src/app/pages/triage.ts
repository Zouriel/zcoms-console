import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UiToastService } from 'ui/dialog';
import { Api } from '../core/api';
import { UI } from '../core/ui';

interface Source { transport: string; account?: string; chat_filter?: string; }
interface Group {
  id: number;
  name: string;
  schedule_kind: string; // 'interval' | 'daily'
  schedule_spec: string;
  enabled: boolean;
  last_run_at?: string;
  sources: Source[];
}

const KINDS = [
  { label: 'Interval', value: 'interval' },
  { label: 'Daily at', value: 'daily' },
];
// Transports a group can triage. Instagram lands with Phase C.
const TRANSPORTS = ['telegram', 'whatsapp'];

function blank(): Group {
  return { id: 0, name: '', schedule_kind: 'interval', schedule_spec: '1h', enabled: true, sources: [{ transport: 'telegram' }] };
}

@Component({
  selector: 'app-triage',
  imports: [FormsModule, ...UI],
  template: `
    <div class="page-head">
      <ui-text variant="caption" class="muted">triage groups — batch apps together or split them to their own schedules; the digest never includes your own messages</ui-text>
    </div>

    <ui-card padding="md">
      <ui-text variant="h4">{{ form().id ? 'Edit group' : 'New group' }}</ui-text>
      <div class="grid">
        <ui-form-field label="Name">
          <ui-input [(ngModel)]="form().name" placeholder="Work apps"></ui-input>
        </ui-form-field>
        <ui-form-field label="Schedule">
          <ui-select [options]="kinds" [(ngModel)]="form().schedule_kind"></ui-select>
        </ui-form-field>
        <ui-form-field [label]="form().schedule_kind === 'daily' ? 'Times (HH:MM, comma-sep)' : 'Every'">
          <ui-input [(ngModel)]="form().schedule_spec" [placeholder]="form().schedule_kind === 'daily' ? '09:00,18:00' : '1h'"></ui-input>
        </ui-form-field>
      </div>

      <ui-text variant="caption" class="muted" style="display:block;margin:10px 0 4px">Sources</ui-text>
      <div class="sources">
        @for (t of transports; track t) {
          <label class="src">
            <input type="checkbox" [checked]="hasSource(t)" (change)="toggleSource(t)" />
            {{ t }}
          </label>
        }
        <span class="src disabled" title="Available in Phase C">instagram (soon)</span>
      </div>

      <div class="row">
        <label class="src"><input type="checkbox" [(ngModel)]="form().enabled" /> enabled</label>
        <span class="spacer"></span>
        @if (form().id) { <ui-button variant="ghost" (click)="reset()">Cancel</ui-button> }
        <ui-button variant="primary" (click)="save()">{{ form().id ? 'Save' : 'Create' }}</ui-button>
      </div>
    </ui-card>

    <div style="height:16px"></div>

    <ui-card padding="md">
      @if (loading()) { <ui-spinner></ui-spinner> } @else {
        <div class="tbl-scroll"><table class="tbl">
          <thead><tr><th>Name</th><th>Schedule</th><th>Sources</th><th>Enabled</th><th style="width:1%"></th></tr></thead>
          <tbody>
            @for (g of groups(); track g.id) {
              <tr>
                <td>{{ g.name }}</td>
                <td class="muted">{{ g.schedule_kind === 'daily' ? 'daily ' + g.schedule_spec : 'every ' + g.schedule_spec }}</td>
                <td>
                  @for (s of g.sources; track s.transport) { <ui-chip>{{ s.transport }}</ui-chip> }
                </td>
                <td><ui-switch [ngModel]="g.enabled" (ngModelChange)="toggle(g, $event)"></ui-switch></td>
                <td class="actions">
                  <ui-button variant="ghost" size="sm" (click)="edit(g)">Edit</ui-button>
                  <ui-button variant="destructive" size="sm" (click)="remove(g)">Delete</ui-button>
                </td>
              </tr>
            } @empty { <tr><td colspan="5" class="empty">No triage groups yet — create one above.</td></tr> }
          </tbody>
        </table></div>
      }
    </ui-card>
  `,
  styles: [`
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; margin-top: 8px; }
    .sources { display: flex; gap: 16px; flex-wrap: wrap; align-items: center; }
    .src { display: inline-flex; gap: 6px; align-items: center; text-transform: capitalize; cursor: pointer; }
    .src.disabled { opacity: 0.45; cursor: default; }
    .row { display: flex; align-items: center; gap: 10px; margin-top: 16px; }
    .spacer { flex: 1; }
    .actions { display: flex; gap: 6px; }
  `],
})
export class TriagePage {
  private api = inject(Api);
  private toast = inject(UiToastService);
  groups = signal<Group[]>([]);
  loading = signal(true);
  form = signal<Group>(blank());
  kinds = KINDS;
  transports = TRANSPORTS;

  constructor() { this.load(); }

  async load() {
    this.loading.set(true);
    try { this.groups.set((await this.api.get('/api/triage/groups')) || []); }
    catch (e: any) { this.toast.danger(e.message, 'Load failed'); }
    finally { this.loading.set(false); }
  }

  hasSource(t: string) { return this.form().sources.some((s) => s.transport === t); }
  toggleSource(t: string) {
    const f = this.form();
    const has = f.sources.some((s) => s.transport === t);
    f.sources = has ? f.sources.filter((s) => s.transport !== t) : [...f.sources, { transport: t }];
    this.form.set({ ...f });
  }

  reset() { this.form.set(blank()); }
  edit(g: Group) { this.form.set({ ...g, sources: g.sources.map((s) => ({ ...s })) }); }

  async save() {
    const f = this.form();
    if (!f.name.trim()) { this.toast.danger('A group needs a name'); return; }
    if (!f.sources.length) { this.toast.danger('Pick at least one source'); return; }
    try {
      await this.api.post('/api/triage/groups', f);
      this.toast.success(f.id ? 'Saved' : 'Created');
      this.reset();
      await this.load();
    } catch (e: any) { this.toast.danger(e.message, 'Save failed'); }
  }

  async toggle(g: Group, on: boolean) {
    try { await this.api.post(`/api/triage/groups/${g.id}/${on ? 'enable' : 'disable'}`); await this.load(); }
    catch (e: any) { this.toast.danger(e.message, 'Update failed'); await this.load(); }
  }

  async remove(g: Group) {
    try { await this.api.del('/api/triage/groups/' + g.id); this.toast.success('Deleted'); await this.load(); }
    catch (e: any) { this.toast.danger(e.message, 'Delete failed'); }
  }
}
