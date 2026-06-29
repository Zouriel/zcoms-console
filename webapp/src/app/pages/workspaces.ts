import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UiToastService } from 'ui/dialog';
import { Api } from '../core/api';
import { UI } from '../core/ui';

interface Workspace {
  id: number; name: string; path: string; max_role: string;
  pinned?: boolean; ignored?: boolean; present?: boolean;
}
const ROLES = [
  { label: 'read', value: 'read' }, { label: 'confirm', value: 'confirm' },
  { label: 'edit', value: 'edit' }, { label: 'full', value: 'full' },
];

@Component({
  selector: 'app-workspaces',
  imports: [FormsModule, ...UI],
  template: `
    <div class="page-head">
      <ui-text variant="caption" class="muted">discovered repos — edit cap / pin / ignore (no create or delete)</ui-text>
      <span class="spacer"></span>
      <ui-button variant="secondary" [loading]="syncing()" (click)="sync()">Sync now</ui-button>
    </div>

    <ui-card padding="md">
      @if (loading()) { <ui-spinner></ui-spinner> } @else {
        <table class="tbl">
          <thead><tr><th>Name</th><th>Path</th><th>Max role</th><th>State</th><th style="width:1%"></th></tr></thead>
          <tbody>
            @for (w of items(); track w.id) {
              <tr>
                <td>{{ w.name }}</td>
                <td class="muted">{{ w.path }}</td>
                <td style="width:8rem">
                  <ui-select [options]="roles" [ngModel]="w.max_role" (ngModelChange)="setCap(w, $event)"></ui-select>
                </td>
                <td>
                  <div class="row">
                    @if (w.present) { <ui-badge tone="success">present</ui-badge> }
                    @if (w.pinned) { <ui-badge tone="primary">pinned</ui-badge> }
                    @if (w.ignored) { <ui-badge tone="warning">ignored</ui-badge> }
                  </div>
                </td>
                <td>
                  <div class="row-actions">
                    <ui-button variant="ghost" size="sm" (click)="pin(w)">{{ w.pinned ? 'Unpin' : 'Pin' }}</ui-button>
                    <ui-button variant="ghost" size="sm" (click)="ignore(w)">{{ w.ignored ? 'Unignore' : 'Ignore' }}</ui-button>
                  </div>
                </td>
              </tr>
            } @empty { <tr><td colspan="5" class="empty">No workspaces — set discovery_roots in Settings, then Sync.</td></tr> }
          </tbody>
        </table>
      }
    </ui-card>
  `,
})
export class WorkspacesPage {
  private api = inject(Api);
  private toast = inject(UiToastService);
  items = signal<Workspace[]>([]);
  loading = signal(true);
  syncing = signal(false);
  roles = ROLES;

  constructor() { this.load(); }

  async load() {
    this.loading.set(true);
    try { this.items.set((await this.api.get('/api/workspaces')) || []); }
    catch (e: any) { this.toast.danger(e.message, 'Load failed'); }
    finally { this.loading.set(false); }
  }
  async sync() {
    this.syncing.set(true);
    try { const r = await this.api.post('/api/workspaces/sync'); this.toast.success(r.reply || 'Synced'); await this.load(); }
    catch (e: any) { this.toast.danger(e.message, 'Sync failed'); }
    finally { this.syncing.set(false); }
  }
  async setCap(w: Workspace, role: string) {
    try { await this.api.post(`/api/workspaces/${w.id}/cap`, { role }); w.max_role = role; this.toast.success('Cap set'); }
    catch (e: any) { this.toast.danger(e.message, 'Failed'); }
  }
  async pin(w: Workspace) {
    try { await this.api.post(`/api/workspaces/${w.id}/pin`, { pinned: !w.pinned }); await this.load(); }
    catch (e: any) { this.toast.danger(e.message, 'Failed'); }
  }
  async ignore(w: Workspace) {
    try { await this.api.post(`/api/workspaces/${w.id}/ignore`, { ignored: !w.ignored }); await this.load(); }
    catch (e: any) { this.toast.danger(e.message, 'Failed'); }
  }
}
