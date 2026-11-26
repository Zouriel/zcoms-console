import { Component, inject, signal } from '@angular/core';
import { UiToastService } from 'ui/dialog';
import { Api } from '../core/api';
import { UI } from '../core/ui';

interface Project {
  id: number;
  path: string;
  transport: string;
  native_id: string;
  group_name?: string;
  follow_tasks: boolean;
}
interface Member { id: number; name: string; transport: string; platform_id: string; active: boolean; aliases?: string[]; }
interface Task { id: number; title: string; assignee?: string; status: string; created_at: string; }
interface Summary { date: string; text: string; }
interface Detail { project: Project; members: Member[]; open_tasks: Task[]; summaries: Summary[]; }

@Component({
  selector: 'app-projects',
  imports: [...UI],
  template: `
    <div class="page-head">
      <ui-text variant="caption" class="muted">repos bound to a project group: who is in it, what is open, and the daily summaries</ui-text>
    </div>

    <ui-card padding="md">
      @if (loading()) { <ui-spinner></ui-spinner> } @else {
        <div class="tbl-scroll"><table class="tbl">
          <thead><tr><th>Repo</th><th>Group</th><th>Transport</th><th>Follow tasks</th><th style="width:1%"></th></tr></thead>
          <tbody>
            @for (p of projects(); track p.id) {
              <tr [class.sel]="selected()?.project?.id === p.id">
                <td class="mono">{{ p.path }}</td>
                <td>{{ p.group_name || p.native_id }}</td>
                <td><ui-chip>{{ p.transport }}</ui-chip></td>
                <td><ui-badge [tone]="p.follow_tasks ? 'success' : 'neutral'">{{ p.follow_tasks ? 'on' : 'off' }}</ui-badge></td>
                <td class="actions">
                  <ui-button variant="ghost" size="sm" (click)="open(p)">{{ selected()?.project?.id === p.id ? 'Refresh' : 'Open' }}</ui-button>
                </td>
              </tr>
            } @empty { <tr><td colspan="5" class="empty">No projects yet. Bind a project group to a repo to see it here.</td></tr> }
          </tbody>
        </table></div>
      }
    </ui-card>

    @if (detailLoading()) {
      <div style="height:16px"></div>
      <ui-card padding="md"><ui-spinner></ui-spinner></ui-card>
    } @else if (selected(); as d) {
      <div style="height:16px"></div>
      <ui-card padding="md">
        <div class="head">
          <ui-text variant="h4">{{ d.project.group_name || d.project.path }}</ui-text>
          <span class="spacer"></span>
          <ui-button variant="ghost" size="sm" (click)="close()">Close</ui-button>
        </div>
        <ui-text variant="caption" class="muted mono">{{ d.project.path }}</ui-text>

        <ui-text variant="caption" class="muted section">Members</ui-text>
        <div class="tbl-scroll"><table class="tbl">
          <thead><tr><th>Name</th><th>Aliases</th><th>Transport</th><th>Active</th></tr></thead>
          <tbody>
            @for (m of d.members; track m.id) {
              <tr>
                <td>{{ m.name }} <div class="muted small">{{ m.platform_id }}</div></td>
                <td>@for (a of m.aliases || []; track a) { <ui-chip>{{ a }}</ui-chip> }</td>
                <td class="muted">{{ m.transport }}</td>
                <td><ui-badge [tone]="m.active ? 'success' : 'neutral'">{{ m.active ? 'active' : 'inactive' }}</ui-badge></td>
              </tr>
            } @empty { <tr><td colspan="4" class="empty">No members recorded yet.</td></tr> }
          </tbody>
        </table></div>

        <ui-text variant="caption" class="muted section">Open tasks</ui-text>
        <div class="tbl-scroll"><table class="tbl">
          <thead><tr><th style="width:1%">ID</th><th>Title</th><th>Assignee</th></tr></thead>
          <tbody>
            @for (t of d.open_tasks; track t.id) {
              <tr>
                <td class="muted">#{{ t.id }}</td>
                <td>{{ t.title }}</td>
                <td>{{ t.assignee || 'unassigned' }}</td>
              </tr>
            } @empty { <tr><td colspan="3" class="empty">No open tasks.</td></tr> }
          </tbody>
        </table></div>

        <ui-text variant="caption" class="muted section">Past summaries</ui-text>
        @for (s of d.summaries; track s.date) {
          <div class="summary">
            <ui-text variant="caption" class="muted">{{ s.date }}</ui-text>
            <div class="text">{{ s.text }}</div>
          </div>
        } @empty { <div class="empty">No summaries yet.</div> }
      </ui-card>
    }
  `,
  styles: [`
    .head { display: flex; align-items: center; gap: 10px; }
    .spacer { flex: 1; }
    .actions { display: flex; gap: 6px; }
    .section { display: block; margin: 18px 0 6px; }
    .small { font-size: var(--ui-font-size-sm); }
    .mono { font-family: var(--ui-font-mono, monospace); font-size: var(--ui-font-size-sm); word-break: break-all; }
    tr.sel td { background: var(--ui-color-surface-raised); }
    .summary { padding: 8px 0; border-top: 1px solid var(--ui-color-border); }
    .summary:first-of-type { border-top: 0; }
    .text { white-space: pre-wrap; word-break: break-word; margin-top: 2px; }
  `],
})
export class ProjectsPage {
  private api = inject(Api);
  private toast = inject(UiToastService);
  projects = signal<Project[]>([]);
  loading = signal(true);
  selected = signal<Detail | null>(null);
  detailLoading = signal(false);

  constructor() { this.load(); }

  async load() {
    this.loading.set(true);
    try { this.projects.set((await this.api.get('/api/projects')) || []); }
    catch (e: any) { this.toast.danger(e.message, 'Load failed'); }
    finally { this.loading.set(false); }
  }

  async open(p: Project) {
    this.detailLoading.set(true);
    try { this.selected.set(await this.api.get('/api/projects/' + p.id)); }
    catch (e: any) { this.toast.danger(e.message, 'Load failed'); }
    finally { this.detailLoading.set(false); }
  }

  close() { this.selected.set(null); }
}
