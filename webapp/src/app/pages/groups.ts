import { Component, inject, signal } from '@angular/core';
import { UiToastService } from 'ui/dialog';
import { Api } from '../core/api';
import { UI } from '../core/ui';

interface GroupPolicy {
  transport: string;
  native_id: string;
  name?: string;
  kind: string; // 'general' | 'project'
  project_id?: number;
  project_path?: string;
  last_call?: number; // unix seconds
}

@Component({
  selector: 'app-groups',
  imports: [...UI],
  template: `
    <div class="page-head">
      <ui-text variant="caption" class="muted">chat groups the agent answers in. Turn a group on or off, or bind it to a repo, with zc group from the owner chat.</ui-text>
    </div>

    <ui-card padding="md">
      @if (loading()) { <ui-spinner></ui-spinner> } @else {
        <div class="tbl-scroll"><table class="tbl">
          <thead><tr><th>Group</th><th>Kind</th><th>Transport</th><th>Bound repo</th><th>Last call</th></tr></thead>
          <tbody>
            @for (g of groups(); track g.transport + ':' + g.native_id) {
              <tr>
                <td>
                  {{ g.name || g.native_id }}
                  @if (g.name) { <div class="muted small">{{ g.native_id }}</div> }
                </td>
                <td><ui-badge [tone]="g.kind === 'project' ? 'primary' : 'neutral'">{{ g.kind }}</ui-badge></td>
                <td><ui-chip>{{ g.transport }}</ui-chip></td>
                <td class="mono">{{ g.project_path || (g.kind === 'project' ? '(unbound)' : '') }}</td>
                <td class="muted">{{ when(g.last_call) }}</td>
              </tr>
            } @empty { <tr><td colspan="5" class="empty">No groups yet. The agent lists a group here once it is turned on.</td></tr> }
          </tbody>
        </table></div>
      }
    </ui-card>
  `,
  styles: [`
    .small { font-size: var(--ui-font-size-sm); }
    .mono { font-family: var(--ui-font-mono, monospace); font-size: var(--ui-font-size-sm); word-break: break-all; }
  `],
})
export class GroupsPage {
  private api = inject(Api);
  private toast = inject(UiToastService);
  groups = signal<GroupPolicy[]>([]);
  loading = signal(true);

  constructor() { this.load(); }

  async load() {
    this.loading.set(true);
    try { this.groups.set((await this.api.get('/api/groups')) || []); }
    catch (e: any) { this.toast.danger(e.message, 'Load failed'); }
    finally { this.loading.set(false); }
  }

  when(ts?: number) { return ts ? new Date(ts * 1000).toLocaleString() : 'never'; }
}
