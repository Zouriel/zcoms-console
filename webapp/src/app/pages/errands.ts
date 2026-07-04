import { Component, inject, signal } from '@angular/core';
import { UiToastService } from 'ui/dialog';
import type { UiStatus } from 'ui';
import { Api } from '../core/api';
import { UI } from '../core/ui';

interface ErrandView {
  id: string;
  status: string;
  brief: string;
  target_name: string;
  platform: string;
  delivered: boolean;
  created_at: string;
  updated_at: string;
}
interface ErrandEvent { time: string; role: string; event: string; detail: string; }
interface ErrandDelivery { to: string; path: string; caption?: string; at: string; }
interface ErrandDetail extends ErrandView {
  auto_start: boolean;
  deliver_to_target: boolean;
  guard_verdict?: string;
  interview_file?: string;
  collected_info?: string;
  transcript?: string[];
  context_files?: string[];
  deliveries?: ErrandDelivery[];
  timeline: ErrandEvent[];
}

// Each status maps to a badge tone; failed is loud, done is green, the working
// phases are primary, and the terminal-but-fine ones stay neutral.
const TONE: Record<string, UiStatus> = {
  pending_approval: 'warning',
  active: 'primary',
  guarding: 'primary',
  producing: 'primary',
  done: 'success',
  failed: 'danger',
  cancelled: 'neutral',
};
// The three-agent flow, so a role's steps read as belonging to a known stage.
const ROLE_LABEL: Record<string, string> = {
  lifecycle: 'Flow',
  interviewer: 'Interviewer',
  guard: 'Guard',
  producer: 'Producer',
};

@Component({
  selector: 'app-errands',
  imports: [...UI],
  template: `
    <div class="page-head">
      <ui-text variant="caption" class="muted">every errand runs three agents in sequence: an interviewer collects the answers, a guard vets them, then a producer builds and sends the deliverable. the whole flow, and whatever it produced, is logged below</ui-text>
    </div>

    <ui-card padding="md">
      <div class="row">
        <ui-text variant="h4">Errands</ui-text>
        <span class="spacer"></span>
        <ui-button variant="ghost" size="sm" (click)="load()">Refresh</ui-button>
      </div>
      @if (loading()) { <ui-spinner></ui-spinner> } @else {
        <div class="tbl-scroll"><table class="tbl">
          <thead><tr><th>Status</th><th>Contact</th><th>Brief</th><th>Started</th><th style="width:1%"></th></tr></thead>
          <tbody>
            @for (e of errands(); track e.id) {
              <tr>
                <td><ui-badge [tone]="tone(e.status)">{{ label(e.status) }}</ui-badge></td>
                <td>{{ e.target_name }}<span class="muted"> · {{ e.platform }}</span></td>
                <td class="brief">{{ e.brief }}</td>
                <td class="muted">{{ ts(e.created_at) }}</td>
                <td class="actions">
                  <ui-button variant="ghost" size="sm" (click)="toggle(e.id)">{{ open().has(e.id) ? 'Hide' : 'Flow' }}</ui-button>
                  @if (canRetry(e.status)) { <ui-button variant="secondary" size="sm" (click)="retry(e)">Retry</ui-button> }
                  @if (canCancel(e.status)) { <ui-button variant="destructive" size="sm" (click)="cancel(e)">Cancel</ui-button> }
                </td>
              </tr>
              @if (open().has(e.id)) {
                <tr class="detailrow"><td colspan="5">
                  @if (details()[e.id]; as d) {
                    <div class="detail">
                      @if (d.guard_verdict) {
                        <div class="verdict" [class.bad]="d.guard_verdict.startsWith('FLAG')">
                          <b>Guard:</b> {{ d.guard_verdict }}
                        </div>
                      }

                      <div class="cols">
                        <div class="col">
                          <ui-text variant="label" class="muted">Flow</ui-text>
                          @if (d.timeline?.length) {
                            <ul class="timeline">
                              @for (ev of d.timeline; track $index) {
                                <li>
                                  <span class="muted mono">{{ tsShort(ev.time) }}</span>
                                  <ui-badge tone="neutral">{{ roleLabel(ev.role) }}</ui-badge>
                                  <b>{{ ev.event }}</b>
                                  @if (ev.detail) { <span class="muted"> — {{ ev.detail }}</span> }
                                </li>
                              }
                            </ul>
                          } @else { <span class="muted">No steps logged.</span> }
                        </div>

                        <div class="col">
                          <ui-text variant="label" class="muted">Produced &amp; delivered</ui-text>
                          @if (d.deliveries?.length) {
                            <ul class="files">
                              @for (f of d.deliveries; track $index) {
                                <li>
                                  <ui-badge [tone]="f.to === 'contact' ? 'primary' : 'neutral'">{{ f.to }}</ui-badge>
                                  <span class="mono">{{ base(f.path) }}</span>
                                  @if (f.caption) { <span class="muted"> — {{ f.caption }}</span> }
                                </li>
                              }
                            </ul>
                          } @else { <span class="muted">Nothing shipped yet.</span> }

                          @if (d.transcript?.length) {
                            <ui-text variant="label" class="muted" style="display:block;margin-top:12px">Conversation</ui-text>
                            <ul class="transcript">
                              @for (line of d.transcript; track $index) { <li>{{ line }}</li> }
                            </ul>
                          }
                        </div>
                      </div>

                      @if (d.collected_info) {
                        <ui-text variant="label" class="muted" style="display:block;margin-top:12px">Collected info</ui-text>
                        <pre class="collected">{{ d.collected_info }}</pre>
                      }
                    </div>
                  } @else { <ui-spinner></ui-spinner> }
                </td></tr>
              }
            } @empty { <tr><td colspan="5" class="empty">No errands yet — dispatch one by texting the agent, e.g. "ask my wife what she needs for her CV, make it, send it to her".</td></tr> }
          </tbody>
        </table></div>
      }
    </ui-card>
  `,
  styles: [`
    .row { display: flex; align-items: center; }
    .spacer { flex: 1; }
    .brief { max-width: 360px; }
    .actions { display: flex; gap: 6px; justify-content: flex-end; }
    .detailrow td { background: var(--ui-color-surface-raised); }
    .detail { padding: 6px 2px; }
    .mono { font-family: var(--ui-font-mono, monospace); font-size: var(--ui-font-size-sm); }
    .verdict { padding: 8px 10px; border-radius: var(--ui-radius); background: color-mix(in srgb, var(--ui-color-success) 14%, transparent); margin-bottom: 12px; }
    .verdict.bad { background: color-mix(in srgb, var(--ui-color-danger) 16%, transparent); }
    .cols { display: grid; grid-template-columns: 1.4fr 1fr; gap: 20px; }
    @media (max-width: 780px) { .cols { grid-template-columns: 1fr; } }
    .col ui-text[variant=label] { display: block; margin-bottom: 6px; }
    .timeline, .files, .transcript { margin: 0; padding-left: 0; list-style: none; display: flex; flex-direction: column; gap: 5px; }
    .timeline li { font-size: var(--ui-font-size-sm); display: flex; gap: 6px; align-items: baseline; flex-wrap: wrap; }
    .files li { font-size: var(--ui-font-size-sm); display: flex; gap: 6px; align-items: baseline; }
    .transcript li { font-size: var(--ui-font-size-sm); }
    .collected { max-height: 300px; overflow: auto; white-space: pre-wrap; word-break: break-word; background: var(--ui-color-bg); padding: 10px; border-radius: var(--ui-radius); font-size: var(--ui-font-size-sm); margin: 6px 0 0; }
  `],
})
export class ErrandsPage {
  private api = inject(Api);
  private toast = inject(UiToastService);
  errands = signal<ErrandView[]>([]);
  details = signal<Record<string, ErrandDetail>>({});
  open = signal<Set<string>>(new Set());
  loading = signal(true);

  constructor() { this.load(); }

  tone(status: string): UiStatus { return TONE[status] || 'neutral'; }
  label(status: string) { return status.replace(/_/g, ' '); }
  roleLabel(role: string) { return ROLE_LABEL[role] || role; }
  canRetry(status: string) { return status === 'failed' || status === 'active' || status === 'guarding' || status === 'producing'; }
  canCancel(status: string) { return status === 'pending_approval' || status === 'active' || status === 'guarding' || status === 'producing'; }
  base(path: string) { return path.split('/').pop() || path; }
  ts(iso?: string) { return iso ? new Date(iso).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''; }
  tsShort(iso?: string) { return iso ? new Date(iso).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : ''; }

  async load() {
    this.loading.set(true);
    try { this.errands.set((await this.api.get('/api/errands')) || []); }
    catch (e: any) { this.toast.danger(e.message, 'Load failed'); }
    finally { this.loading.set(false); }
  }

  async toggle(id: string) {
    const s = new Set(this.open());
    if (s.has(id)) { s.delete(id); this.open.set(s); return; }
    s.add(id); this.open.set(s);
    await this.loadDetail(id);
  }

  private async loadDetail(id: string) {
    try {
      const d = await this.api.get(`/api/errands/${id}`);
      this.details.set({ ...this.details(), [id]: d });
    } catch (e: any) { this.toast.danger(e.message, 'Flow load failed'); }
  }

  async retry(e: ErrandView) {
    try {
      const res: any = await this.api.post(`/api/errands/${e.id}/retry`);
      this.toast.success(res?.reply || 'Retrying');
      await this.load();
      if (this.open().has(e.id)) await this.loadDetail(e.id);
    } catch (err: any) { this.toast.danger(err.message, 'Retry failed'); }
  }

  async cancel(e: ErrandView) {
    try {
      const res: any = await this.api.post(`/api/errands/${e.id}/cancel`);
      this.toast.success(res?.reply || 'Cancelled');
      await this.load();
    } catch (err: any) { this.toast.danger(err.message, 'Cancel failed'); }
  }
}
