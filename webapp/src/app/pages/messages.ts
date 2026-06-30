import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UiToastService } from 'ui/dialog';
import { Api } from '../core/api';
import { UI } from '../core/ui';

interface Phrase { key: string; label: string; value: string; default: string; }

@Component({
  selector: 'app-messages',
  imports: [FormsModule, ...UI],
  template: `
    <div class="page-head">
      <ui-text variant="caption" class="muted">canned messages the assistant sends in set situations — reword them to taste (changes apply live)</ui-text>
    </div>

    @if (loading()) { <ui-spinner></ui-spinner> } @else {
      <div class="grid">
        @for (p of phrases(); track p.key) {
          <ui-card padding="md">
            <ui-text variant="h4">{{ p.label }}</ui-text>
            <ui-text variant="caption" class="muted">key: {{ p.key }}</ui-text>
            <div style="margin-top:10px">
              <ui-textarea [(ngModel)]="p.value" [rows]="2"></ui-textarea>
            </div>
            <div class="row-actions" style="margin-top:8px">
              <ui-button variant="ghost" size="sm" [disabled]="p.value === p.default" (click)="reset(p)">Reset to default</ui-button>
              <span class="spacer"></span>
              <ui-button variant="primary" size="sm" (click)="save(p)">Save</ui-button>
            </div>
          </ui-card>
        }
      </div>
    }
  `,
  styles: [`
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 460px), 1fr)); gap: var(--ui-space-4); }
    .row-actions { display: flex; align-items: center; gap: 8px; }
    .spacer { flex: 1; }
  `],
})
export class MessagesPage {
  private api = inject(Api);
  private toast = inject(UiToastService);
  phrases = signal<Phrase[]>([]);
  loading = signal(true);

  constructor() { this.load(); }

  async load() {
    this.loading.set(true);
    try { this.phrases.set((await this.api.get('/api/phrases')) || []); }
    catch (e: any) { this.toast.danger(e.message, 'Load failed'); }
    finally { this.loading.set(false); }
  }

  async save(p: Phrase) {
    const value = (p.value || '').trim();
    if (!value) { this.toast.warning('Message cannot be empty'); return; }
    try { await this.api.post('/api/phrases', { key: p.key, value }); this.toast.success('Saved'); await this.load(); }
    catch (e: any) { this.toast.danger(e.message, 'Save failed'); }
  }

  async reset(p: Phrase) {
    try { await this.api.post('/api/phrases', { key: p.key, value: p.default }); this.toast.success('Reset to default'); await this.load(); }
    catch (e: any) { this.toast.danger(e.message, 'Reset failed'); }
  }
}
