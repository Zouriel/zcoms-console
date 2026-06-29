import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UiToastService } from 'ui/dialog';
import { Api } from '../core/api';
import { UI } from '../core/ui';

interface Persona { key: string; display_name?: string; backend?: string; model?: string; seed_prompt?: string; }
const BACKENDS = [{ label: 'claude', value: 'claude' }, { label: 'codex', value: 'codex' }];

@Component({
  selector: 'app-personas',
  imports: [FormsModule, ...UI],
  template: `
    <div class="page-head">
      <ui-text variant="caption" class="muted">each agent identity's backend, model and seed prompt (edits take effect live)</ui-text>
    </div>

    @if (loading()) { <ui-spinner></ui-spinner> } @else {
      <div class="grid">
        @for (p of items(); track p.key) {
          <ui-card padding="md">
            <div class="row" style="justify-content:space-between">
              <div>
                <ui-text variant="h4">{{ p.display_name || p.key }}</ui-text>
                <ui-text variant="caption" class="muted">key: {{ p.key }}</ui-text>
              </div>
              <ui-badge tone="neutral">{{ p.backend || 'claude' }}</ui-badge>
            </div>
            <div class="stack" style="margin-top:12px">
              <ui-form-field label="Display name">
                <div class="row">
                  <ui-input [(ngModel)]="p.display_name" placeholder="name"></ui-input>
                  <ui-button variant="secondary" size="sm" (click)="set(p, 'name', p.display_name)">Save</ui-button>
                </div>
              </ui-form-field>
              <ui-form-field label="Backend">
                <ui-select [options]="backends" [ngModel]="p.backend || 'claude'" (ngModelChange)="set(p, 'backend', $event)"></ui-select>
              </ui-form-field>
              <ui-form-field label="Model (optional)">
                <div class="row">
                  <ui-input [(ngModel)]="p.model" placeholder="default"></ui-input>
                  <ui-button variant="secondary" size="sm" (click)="set(p, 'model', p.model || '')">Save</ui-button>
                </div>
              </ui-form-field>
              <ui-form-field label="Seed prompt">
                <ui-textarea [(ngModel)]="p.seed_prompt" [rows]="6"></ui-textarea>
              </ui-form-field>
              <div class="row-actions">
                <ui-button variant="primary" size="sm" (click)="set(p, 'seed', p.seed_prompt || '')">Save seed</ui-button>
              </div>
            </div>
          </ui-card>
        }
      </div>
    }
  `,
  styles: [`.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 420px), 1fr)); gap: var(--ui-space-4); }`],
})
export class PersonasPage {
  private api = inject(Api);
  private toast = inject(UiToastService);
  items = signal<Persona[]>([]);
  loading = signal(true);
  backends = BACKENDS;

  constructor() { this.load(); }

  async load() {
    this.loading.set(true);
    try { this.items.set((await this.api.get('/api/personas')) || []); }
    catch (e: any) { this.toast.danger(e.message, 'Load failed'); }
    finally { this.loading.set(false); }
  }
  async set(p: Persona, field: string, value: string | undefined) {
    try { await this.api.post('/api/personas/' + encodeURIComponent(p.key), { field, value: value ?? '' }); this.toast.success(field + ' saved'); }
    catch (e: any) { this.toast.danger(e.message, 'Save failed'); }
  }
}
