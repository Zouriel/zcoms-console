import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UiToastService } from 'ui/dialog';
import { Api } from '../core/api';
import { UI } from '../core/ui';

interface Allow { id: number; platform: string; handle: string; max_role: string; }
const ROLES = [
  { label: 'read', value: 'read' }, { label: 'confirm', value: 'confirm' },
  { label: 'edit', value: 'edit' }, { label: 'full', value: 'full' },
];

@Component({
  selector: 'app-allowlist',
  imports: [FormsModule, ...UI],
  template: `
    <div class="page-head">
      <ui-text variant="caption" class="muted">who may drive the agent over Telegram — keep this tiny (≈ shell access)</ui-text>
    </div>

    <ui-card padding="md">
      <div class="toolbar">
        <ui-input [(ngModel)]="handle" placeholder="@handle"></ui-input>
        <ui-select [options]="roles" [(ngModel)]="role"></ui-select>
        <ui-button variant="primary" (click)="add()">Add</ui-button>
      </div>
      @if (loading()) { <ui-spinner></ui-spinner> } @else {
        <table class="tbl">
          <thead><tr><th>ID</th><th>Platform</th><th>Handle</th><th>Max role</th><th style="width:1%"></th></tr></thead>
          <tbody>
            @for (a of items(); track a.id) {
              <tr>
                <td class="muted">{{ a.id }}</td>
                <td>{{ a.platform }}</td>
                <td>{{ a.handle }}</td>
                <td><ui-badge tone="neutral">{{ a.max_role }}</ui-badge></td>
                <td><ui-button variant="destructive" size="sm" (click)="remove(a)">Remove</ui-button></td>
              </tr>
            } @empty { <tr><td colspan="5" class="empty">No one allow-listed yet.</td></tr> }
          </tbody>
        </table>
      }
    </ui-card>
  `,
})
export class AllowlistPage {
  private api = inject(Api);
  private toast = inject(UiToastService);
  items = signal<Allow[]>([]);
  loading = signal(true);
  handle = '';
  role = 'read';
  roles = ROLES;

  constructor() { this.load(); }

  async load() {
    this.loading.set(true);
    try { this.items.set((await this.api.get('/api/allowlist')) || []); }
    catch (e: any) { this.toast.danger(e.message, 'Load failed'); }
    finally { this.loading.set(false); }
  }
  async add() {
    if (!this.handle.trim()) return;
    try { await this.api.post('/api/allowlist', { handle: this.handle, role: this.role }); this.handle = ''; this.toast.success('Added'); await this.load(); }
    catch (e: any) { this.toast.danger(e.message, 'Add failed'); }
  }
  async remove(a: Allow) {
    try { await this.api.del('/api/allowlist/' + a.id); this.toast.success('Removed'); await this.load(); }
    catch (e: any) { this.toast.danger(e.message, 'Remove failed'); }
  }
}
