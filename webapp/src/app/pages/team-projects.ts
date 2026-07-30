import { Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UiToastService } from 'ui/dialog';
import { AuditEntry, Delegator, Standup, TeamApi } from '../core/team-api';
import { TeamLive } from '../core/team-live';
import { UI } from '../core/ui';

// The /team index: every project at a glance, a create form, and the audit trail
// that spans all of them. Per-project detail lives at /team/:project.

@Component({
  selector: 'app-team-projects',
  imports: [FormsModule, ...UI],
  template: `
    <ui-card padding="md">
      <ui-text variant="h4">New project</ui-text>
      <ui-text variant="caption" class="muted">
        A project (delegator) is one task board. Leave the GitHub fields empty for a local-only board,
        or point it at a Projects v2 board to sync.
      </ui-text>
      <div class="grid">
        <ui-form-field label="Name">
          <ui-input [(ngModel)]="form.name" placeholder="hems"></ui-input>
        </ui-form-field>
        <ui-form-field label="GitHub owner (optional)">
          <ui-input [(ngModel)]="form.owner" placeholder="Zouriel"></ui-input>
        </ui-form-field>
        <ui-form-field label="Project #">
          <ui-input inputmode="numeric" [(ngModel)]="form.project"></ui-input>
        </ui-form-field>
      </div>
      <div class="row">
        <span class="spacer"></span>
        <ui-button variant="primary" (click)="create()">Create project</ui-button>
      </div>
    </ui-card>

    <div style="height:16px"></div>

    <ui-card padding="md">
      <ui-text variant="h4">Projects</ui-text>
      <div class="cards">
        @for (d of delegators(); track d.id) {
          <div class="proj" (click)="open(d)">
            <div class="row" style="margin:0">
              <ui-text variant="h4">{{ d.name }}</ui-text>
              <span class="spacer"></span>
              @if (d.has_github) {
                <ui-chip>{{ d.github_owner }}/#{{ d.github_project_number }}</ui-chip>
              } @else { <ui-chip>local</ui-chip> }
            </div>
            <ui-text variant="caption" class="muted">
              {{ standupCount(d.name) }} standup{{ standupCount(d.name) === 1 ? '' : 's' }},
              {{ activeStandupCount(d.name) }} active
            </ui-text>
          </div>
        } @empty {
          <ui-text variant="caption" class="muted">No projects yet — create one above.</ui-text>
        }
      </div>
    </ui-card>

    <div style="height:16px"></div>

    <ui-card padding="md">
      <ui-text variant="h4">Recent activity</ui-text>
      <ui-text variant="caption" class="muted">Across every project. Updates live.</ui-text>
      <div class="tbl-scroll"><table class="tbl">
        <thead><tr><th>When</th><th>Action</th><th>Entity</th><th>Actor</th></tr></thead>
        <tbody>
          @for (a of audit(); track a.created_at + a.entity_id) {
            <tr>
              <td class="muted">{{ fmt(a.created_at) }}</td>
              <td>{{ a.action }}</td>
              <td class="muted">{{ a.entity_type }}</td>
              <td class="muted">{{ a.actor }}</td>
            </tr>
          } @empty { <tr><td colspan="4" class="empty">No activity recorded.</td></tr> }
        </tbody>
      </table></div>
    </ui-card>
  `,
  styles: [`
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; margin-top: 8px; }
    .row { display: flex; align-items: center; gap: 10px; margin: 12px 0; }
    .spacer { flex: 1; }
    .cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 12px; margin-top: 12px; }
    .proj {
      padding: 12px; border-radius: 10px; cursor: pointer;
      border: 1px solid var(--ui-color-border, rgba(127,127,127,0.25));
    }
    .proj:hover { background: var(--ui-color-surface-2, rgba(127,127,127,0.08)); }
  `],
})
export class TeamProjectsPage {
  private api = inject(TeamApi);
  private router = inject(Router);
  private toast = inject(UiToastService);
  private live = inject(TeamLive);

  delegators = signal<Delegator[]>([]);
  standups = signal<Standup[]>([]);
  audit = signal<AuditEntry[]>([]);
  form = { name: '', owner: '', project: 0 };

  constructor() {
    effect(() => {
      this.live.version();
      void this.load();
    });
  }

  fmt(s: string) { return s ? new Date(s).toLocaleString() : ''; }
  standupCount(name: string) { return this.standups().filter((s) => s.delegator === name).length; }
  activeStandupCount(name: string) {
    return this.standups().filter((s) => s.delegator === name && s.enabled).length;
  }

  private async load() {
    try {
      const [ov, audit] = await Promise.all([this.api.overview(), this.api.audit(25)]);
      this.delegators.set(ov.delegators || []);
      this.standups.set(ov.standups || []);
      this.audit.set(audit || []);
    } catch (e: any) {
      if (this.live.running()) this.toast.danger(e?.message || String(e), 'Load failed');
    }
  }

  open(d: Delegator) { this.router.navigate(['team', d.name]); }

  async create() {
    const name = this.form.name.trim();
    if (!name) { this.toast.danger('A project needs a name'); return; }
    try {
      const r = await this.api.createDelegator(name, this.form.owner.trim(), Number(this.form.project) || 0);
      this.toast.success(r.reply || 'Created');
      this.form = { name: '', owner: '', project: 0 };
      // The live stream will refresh the lists; jump straight into the new project.
      this.router.navigate(['team', name]);
    } catch (e: any) { this.toast.danger(e?.message || String(e), 'Create failed'); }
  }
}
