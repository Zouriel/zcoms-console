import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UiToastService } from 'ui/dialog';
import { Api } from '../core/api';
import { UI } from '../core/ui';

@Component({
  selector: 'app-settings',
  imports: [FormsModule, ...UI],
  template: `
    <div class="page-head">
      <ui-text variant="caption" class="muted">agent.db scalars · owner password · console bind address</ui-text>
    </div>

    <div class="cols">
      <ui-card padding="md">
        <ui-text variant="h4">Owner password</ui-text>
        <div class="toolbar" style="margin-top:12px">
          <ui-password-input [(ngModel)]="pw" placeholder="new password"></ui-password-input>
          <ui-button variant="primary" (click)="changePw()">Change</ui-button>
        </div>
        <ui-alert tone="info">
          Set <code>console.bind</code> to a Tailscale IP (100.x) below for phone access; keep it
          <code>127.0.0.1</code> for localhost-only.
        </ui-alert>
      </ui-card>

      <ui-card padding="md">
        <ui-text variant="h4">Add / set a key</ui-text>
        <div class="toolbar" style="margin-top:12px">
          <ui-input [(ngModel)]="newKey" placeholder="key (e.g. console.bind)"></ui-input>
          <ui-input [(ngModel)]="newVal" placeholder="value"></ui-input>
          <ui-button variant="primary" (click)="setKey(newKey, newVal)">Set</ui-button>
        </div>
      </ui-card>
    </div>

    <ui-card padding="md" style="margin-top:16px">
      @if (loading()) { <ui-spinner></ui-spinner> } @else {
        <table class="tbl">
          <thead><tr><th>Key</th><th>Value</th><th style="width:1%"></th></tr></thead>
          <tbody>
            @for (k of keys(); track k) {
              <tr>
                <td>{{ k }}</td>
                <td><ui-input [(ngModel)]="map[k]"></ui-input></td>
                <td><ui-button variant="secondary" size="sm" (click)="setKey(k, map[k])">Save</ui-button></td>
              </tr>
            } @empty { <tr><td colspan="3" class="empty">No settings.</td></tr> }
          </tbody>
        </table>
      }
    </ui-card>
  `,
  styles: [`.cols { display: grid; grid-template-columns: 1fr 1fr; gap: var(--ui-space-4); } @media (max-width: 900px){ .cols { grid-template-columns: 1fr; } }`],
})
export class SettingsPage {
  private api = inject(Api);
  private toast = inject(UiToastService);
  map: Record<string, string> = {};
  keys = signal<string[]>([]);
  loading = signal(true);
  pw = '';
  newKey = '';
  newVal = '';

  constructor() { this.load(); }

  async load() {
    this.loading.set(true);
    try {
      const m = (await this.api.get('/api/settings')) || {};
      this.map = m;
      this.keys.set(Object.keys(m).sort());
    } catch (e: any) { this.toast.danger(e.message, 'Load failed'); }
    finally { this.loading.set(false); }
  }
  async setKey(key: string, value: string) {
    if (!key.trim()) return;
    try { await this.api.post('/api/settings', { key, value }); this.toast.success('Saved'); this.newKey = ''; this.newVal = ''; await this.load(); }
    catch (e: any) { this.toast.danger(e.message, 'Save failed'); }
  }
  async changePw() {
    if (this.pw.length < 6) { this.toast.warning('Password too short'); return; }
    try { await this.api.post('/api/password', { password: this.pw }); this.pw = ''; this.toast.success('Password changed'); }
    catch (e: any) { this.toast.danger(e.message, 'Failed'); }
  }
}
