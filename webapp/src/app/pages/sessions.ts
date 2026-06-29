import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UiToastService } from 'ui/dialog';
import { Api } from '../core/api';
import { UI } from '../core/ui';

interface Workspace { id: number; name: string; path: string; }
interface Session { external_id: string; title?: string; backend?: string; label?: string; }

@Component({
  selector: 'app-sessions',
  imports: [FormsModule, ...UI],
  template: `
    <div class="page-head">
      <ui-text variant="caption" class="muted">live agent sessions per workspace — read-only, label only</ui-text>
    </div>

    <ui-card padding="md">
      <div class="toolbar">
        <ui-text variant="label">Workspace</ui-text>
        <ui-select [options]="wsOptions()" [(ngModel)]="picked" (ngModelChange)="loadSessions()" placeholder="pick a workspace"></ui-select>
      </div>
      @if (loadingSessions()) { <ui-spinner></ui-spinner> }
      @else if (picked) {
        <table class="tbl">
          <thead><tr><th>Title</th><th>Backend</th><th>Label</th><th style="width:1%"></th></tr></thead>
          <tbody>
            @for (s of sessions(); track s.external_id) {
              <tr>
                <td>{{ s.title || s.external_id }}</td>
                <td><ui-badge tone="neutral">{{ s.backend }}</ui-badge></td>
                <td><ui-input [(ngModel)]="s.label" placeholder="label"></ui-input></td>
                <td><ui-button variant="secondary" size="sm" (click)="setLabel(s)">Set</ui-button></td>
              </tr>
            } @empty { <tr><td colspan="4" class="empty">No sessions in this workspace.</td></tr> }
          </tbody>
        </table>
      }
    </ui-card>
  `,
})
export class SessionsPage {
  private api = inject(Api);
  private toast = inject(UiToastService);
  workspaces = signal<Workspace[]>([]);
  sessions = signal<Session[]>([]);
  loadingSessions = signal(false);
  picked = '';

  constructor() {
    this.api.get('/api/workspaces').then((w) => this.workspaces.set(w || [])).catch(() => {});
  }

  wsOptions() {
    return this.workspaces().map((w) => ({ label: w.name || w.path, value: String(w.id) }));
  }

  async loadSessions() {
    if (!this.picked) { this.sessions.set([]); return; }
    this.loadingSessions.set(true);
    try { this.sessions.set((await this.api.get('/api/sessions?workspace=' + this.picked)) || []); }
    catch (e: any) { this.toast.danger(e.message, 'Load failed'); }
    finally { this.loadingSessions.set(false); }
  }

  async setLabel(s: Session) {
    try {
      await this.api.post('/api/sessions/label', { workspace_id: Number(this.picked), external_id: s.external_id, label: s.label || '' });
      this.toast.success('Labelled');
    } catch (e: any) { this.toast.danger(e.message, 'Failed'); }
  }
}
