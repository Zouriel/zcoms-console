import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UiToastService } from 'ui/dialog';
import { Api } from '../core/api';
import { UI } from '../core/ui';

interface Persona { key: string; display_name?: string; backend?: string; model?: string; seed_prompt?: string; }
interface BrainModel { id: string; display: string; }
interface Brain { name: string; installed: boolean; models?: BrainModel[]; source?: string; }

type Option = { label: string; value: string };

// Sentinel option value: reveals a text box for a model the discovery didn't list
// (a pinned id, or one newer than the installed CLI's own catalogue).
const CUSTOM = '__custom__';

@Component({
  selector: 'app-personas',
  imports: [FormsModule, ...UI],
  template: `
    <div class="page-head">
      <ui-text variant="caption" class="muted">each agent identity's backend, model and seed prompt (edits take effect live)</ui-text>
    </div>

    @if (only().length) {
      <div class="toolbar">
        <ui-text variant="caption" class="muted">Showing {{ only().join(', ') }}</ui-text>
        <ui-button variant="ghost" size="sm" (click)="showAll()">Show all</ui-button>
      </div>
    }
    @if (loading()) { <ui-spinner></ui-spinner> } @else {
      <div class="grid">
        @for (p of shown(); track p.key) {
          <ui-card padding="md">
            <div class="row" style="justify-content:space-between">
              <div>
                <ui-text variant="h4">{{ p.display_name || p.key }}</ui-text>
                <ui-text variant="caption" class="muted">key: {{ p.key }}</ui-text>
              </div>
              <ui-badge [tone]="installed(p.backend) ? 'neutral' : 'warning'">{{ brainLabel(p) }}</ui-badge>
            </div>
            <div class="stack" style="margin-top:12px">
              <ui-form-field label="Display name">
                <div class="row">
                  <ui-input [(ngModel)]="p.display_name" placeholder="name"></ui-input>
                  <ui-button variant="secondary" size="sm" (click)="set(p, 'name', p.display_name)">Save</ui-button>
                </div>
              </ui-form-field>
              <ui-form-field label="Backend">
                <ui-select [options]="backendOptions()" [ngModel]="p.backend || 'claude'" (ngModelChange)="setBackend(p, $event)"></ui-select>
              </ui-form-field>
              <ui-form-field label="Model">
                @if (custom().has(p.key)) {
                  <div class="row">
                    <ui-input [(ngModel)]="p.model" placeholder="model name or alias"></ui-input>
                    <ui-button variant="secondary" size="sm" (click)="set(p, 'model', p.model || '')">Save</ui-button>
                  </div>
                } @else {
                  <ui-select [options]="modelOptions(p)" [ngModel]="p.model || ''" (ngModelChange)="setModel(p, $event)"></ui-select>
                }
                <ui-text variant="caption" class="muted">{{ modelHint(p) }}</ui-text>
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
  private router = inject(Router);
  items = signal<Persona[]>([]);
  // ?keys=a,b narrows the page to those personas (the Groups tab links here).
  only = signal<string[]>(
    (inject(ActivatedRoute).snapshot.queryParamMap.get('keys') || '').split(',').map(k => k.trim()).filter(Boolean));
  shown = computed(() => {
    const keys = this.only();
    return keys.length ? this.items().filter(p => keys.includes(p.key)) : this.items();
  });
  brains = signal<Brain[]>([]);
  loading = signal(true);
  // Persona keys whose model is being typed by hand rather than picked.
  custom = signal<Set<string>>(new Set());

  constructor() { this.load(); }

  async load() {
    this.loading.set(true);
    try {
      const [personas, brains] = await Promise.all([
        this.api.get('/api/personas'),
        // Discovery is a convenience: if it fails the page still edits personas,
        // just with a free-text model box.
        this.api.get('/api/brains').catch(() => []),
      ]);
      this.items.set(personas || []);
      this.brains.set(brains || []);
    } catch (e: any) { this.toast.danger(e.message, 'Load failed'); }
    finally { this.loading.set(false); }
  }

  showAll() { this.only.set([]); this.router.navigate(['personas']); }

  private brain(name?: string): Brain | undefined {
    return this.brains().find(b => b.name === (name || 'claude'));
  }

  installed(name?: string): boolean {
    const b = this.brain(name);
    // No discovery data: don't cry wolf about a missing CLI we never checked.
    return b ? b.installed : true;
  }

  brainLabel(p: Persona): string {
    const name = p.backend || 'claude';
    return this.installed(name) ? name : name + ' (not installed)';
  }

  // Only the backends the agent knows about, each labelled with whether its CLI
  // is actually present on that machine.
  backendOptions(): Option[] {
    const bs = this.brains();
    if (!bs.length) return [{ label: 'claude', value: 'claude' }, { label: 'codex', value: 'codex' }];
    return bs.map(b => ({ label: b.installed ? b.name : b.name + ' (not installed)', value: b.name }));
  }

  modelOptions(p: Persona): Option[] {
    const models = this.brain(p.backend)?.models || [];
    const opts: Option[] = [{ label: "Default (the CLI's own choice)", value: '' }];
    for (const m of models) opts.push({ label: m.display, value: m.id });
    // A stored model the discovery didn't list still has to be selectable, or
    // opening the page would silently offer to change it.
    const cur = (p.model || '').trim();
    if (cur && !models.some(m => m.id === cur)) opts.push({ label: cur + ' (custom)', value: cur });
    opts.push({ label: 'Custom…', value: CUSTOM });
    return opts;
  }

  modelHint(p: Persona): string {
    const b = this.brain(p.backend);
    if (!b) return 'type a model name or alias';
    if (!b.installed) return b.name + ' is not installed on the agent host';
    const n = (b.models || []).length;
    return n ? `${n} model(s) from ${b.source}` : `no models discovered (${b.source})`;
  }

  async setBackend(p: Persona, backend: string) {
    const prev = p.backend;
    p.backend = backend;
    // A model belongs to one CLI, so switching backend clears it back to that
    // CLI's default rather than sending the other CLI's model name.
    if (prev !== backend && (p.model || '').trim()) {
      p.model = '';
      await this.set(p, 'model', '');
    }
    await this.set(p, 'backend', backend);
  }

  async setModel(p: Persona, value: string) {
    if (value === CUSTOM) {
      this.custom.update(s => new Set(s).add(p.key));
      return;
    }
    p.model = value;
    await this.set(p, 'model', value);
  }

  async set(p: Persona, field: string, value: string | undefined) {
    try { await this.api.post('/api/personas/' + encodeURIComponent(p.key), { field, value: value ?? '' }); this.toast.success(field + ' saved'); }
    catch (e: any) { this.toast.danger(e.message, 'Save failed'); }
  }
}
