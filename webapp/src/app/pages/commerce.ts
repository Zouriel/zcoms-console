import { Component, computed, inject, signal } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UiToastService } from 'ui/dialog';
import { Api } from '../core/api';
import { UI } from '../core/ui';

type Row = Record<string, any>;
const SECTIONS = ['stores', 'products', 'orders', 'refunds', 'billing', 'reports'] as const;
type Section = (typeof SECTIONS)[number];
const STORE_TYPES = ['files', 'services', 'subscriptions', 'mixed'].map((v) => ({ label: v, value: v }));

@Component({
  selector: 'app-commerce',
  imports: [FormsModule, TitleCasePipe, ...UI],
  template: `
    <div class="page-head">
      <ui-text variant="caption" class="muted">{{ status() }}</ui-text>
    </div>

    <div class="subnav">
      @for (s of sections; track s) {
        <ui-button [variant]="section() === s ? 'primary' : 'ghost'" size="sm" (click)="select(s)">{{ s | titlecase }}</ui-button>
      }
    </div>

    <ui-card padding="md">
      <!-- store filter for the per-store sections -->
      @if (section() !== 'stores' && section() !== 'reports') {
        <div class="toolbar">
          <ui-input [(ngModel)]="storeId" placeholder="store id" (keydown.enter)="reload()"></ui-input>
          <ui-button variant="secondary" (click)="reload()">Load</ui-button>
          @if (section() === 'billing' && storeId) { <ui-button variant="secondary" (click)="invoice()">Send invoice</ui-button> }
          @if (section() === 'products') { <ui-button variant="primary" (click)="newProduct.set(true)">New product</ui-button> }
        </div>
      }
      @if (section() === 'stores') {
        <div class="toolbar"><span class="spacer"></span><ui-button variant="primary" (click)="newStore.set(true)">New store</ui-button></div>
      }
      @if (section() === 'reports') {
        <div class="toolbar">
          <ui-button variant="secondary" (click)="platformReport()">Platform report</ui-button>
          <ui-input [(ngModel)]="storeId" placeholder="store id"></ui-input>
          <ui-button variant="secondary" (click)="storeReport()">Store report</ui-button>
        </div>
      }

      @if (loading()) { <ui-spinner></ui-spinner> }
      @else if (text()) { <pre class="raw">{{ text() }}</pre> }
      @else if (rows().length) {
        <table class="tbl">
          <thead><tr>@for (c of cols(); track c) { <th>{{ c }}</th> }<th style="width:1%"></th></tr></thead>
          <tbody>
            @for (r of rows(); track $index) {
              <tr>
                @for (c of cols(); track c) { <td>{{ fmt(r[c]) }}</td> }
                <td><div class="row-actions">
                  @for (a of actionsFor(r); track a.label) {
                    <ui-button [variant]="a.variant" size="sm" (click)="a.run()">{{ a.label }}</ui-button>
                  }
                </div></td>
              </tr>
            }
          </tbody>
        </table>
      } @else { <ui-text variant="body" class="muted">Nothing to show.</ui-text> }
    </ui-card>

    <!-- New store -->
    <ui-modal [(open)]="newStore" title="New store">
      <div class="stack">
        <ui-form-field label="Store name"><ui-input [(ngModel)]="ns.name"></ui-input></ui-form-field>
        <ui-form-field label="Slug (optional)"><ui-input [(ngModel)]="ns.slug" placeholder="derived from name"></ui-input></ui-form-field>
        <ui-form-field label="Merchant @handle"><ui-input [(ngModel)]="ns.merchant_handle" placeholder="@merchant"></ui-input></ui-form-field>
        <ui-form-field label="Store type"><ui-select [options]="storeTypes" [(ngModel)]="ns.store_type"></ui-select></ui-form-field>
        <ui-form-field label="Monthly price (Stars)"><ui-input [(ngModel)]="ns.monthly_price_stars" placeholder="0"></ui-input></ui-form-field>
        <ui-form-field label="Bot token"><ui-input [(ngModel)]="ns.bot_token" placeholder="from BotFather"></ui-input></ui-form-field>
      </div>
      <div modal-footer class="row-actions">
        <ui-button variant="ghost" (click)="newStore.set(false)">Cancel</ui-button>
        <ui-button variant="primary" (click)="createStore()">Create</ui-button>
      </div>
    </ui-modal>

    <!-- New product (raw JSON) -->
    <ui-modal [(open)]="newProduct" title="New product (JSON)">
      <ui-textarea [(ngModel)]="productJson" [rows]="6" placeholder='{"store_id":"…","type":"file","title":"…","price_stars":100}'></ui-textarea>
      <div modal-footer class="row-actions">
        <ui-button variant="ghost" (click)="newProduct.set(false)">Cancel</ui-button>
        <ui-button variant="primary" (click)="createProduct()">Create</ui-button>
      </div>
    </ui-modal>

    <!-- Read-only detail (order show, report) -->
    <ui-modal [(open)]="detailOpen" [title]="detailTitle()">
      <pre class="raw">{{ detailText() }}</pre>
    </ui-modal>

    <!-- Deny refund reason -->
    <ui-modal [(open)]="denyOpen" [title]="detailTitle()" size="sm">
      <ui-form-field label="Denial reason (optional)"><ui-input [(ngModel)]="denyReason"></ui-input></ui-form-field>
      <div modal-footer class="row-actions">
        <ui-button variant="ghost" (click)="denyOpen.set(false)">Cancel</ui-button>
        <ui-button variant="destructive" (click)="confirmDeny()">Deny refund</ui-button>
      </div>
    </ui-modal>
  `,
  styles: [`.subnav { display: flex; gap: var(--ui-space-2); margin-bottom: var(--ui-space-4); flex-wrap: wrap; }`],
})
export class CommercePage {
  private api = inject(Api);
  private toast = inject(UiToastService);

  sections = SECTIONS;
  storeTypes = STORE_TYPES;
  section = signal<Section>('stores');
  status = signal('checking runtime…');
  loading = signal(false);
  rows = signal<Row[]>([]);
  text = signal('');
  cols = computed(() => {
    const r = this.rows();
    return r.length ? Array.from(new Set(r.flatMap((x) => Object.keys(x)))).slice(0, 7) : [];
  });
  storeId = '';

  newStore = signal(false);
  newProduct = signal(false);
  productJson = '';
  ns: any = { name: '', slug: '', merchant_handle: '', store_type: 'mixed', monthly_price_stars: '0', bot_token: '' };

  detailOpen = signal(false);
  detailTitle = signal('');
  detailText = signal('');
  denyOpen = signal(false);
  denyTarget = signal<string | null>(null);
  denyReason = '';

  constructor() {
    this.api.get('/api/commerce/status')
      .then((d) => this.status.set((d.text || '').replace(/\n/g, '  ')))
      .catch((e) => this.status.set(e.message));
    this.reload();
  }

  select(s: Section) { this.section.set(s); this.reload(); }

  fmt(v: any) { return v === null || v === undefined ? '' : typeof v === 'object' ? JSON.stringify(v) : String(v); }

  private setData(d: any) {
    if (d && d.json) {
      const items = Array.isArray(d.json) ? d.json : Array.isArray(d.json.items) ? d.json.items : [];
      this.rows.set(items); this.text.set(items.length ? '' : (d.text || ''));
    } else { this.rows.set([]); this.text.set((d && d.text) || ''); }
  }

  async reload() {
    const s = this.section();
    this.rows.set([]); this.text.set('');
    if ((s === 'products' || s === 'orders' || s === 'billing') && !this.storeId) return;
    this.loading.set(true);
    try {
      let path = '';
      if (s === 'stores') path = '/api/commerce/stores';
      else if (s === 'products') path = '/api/commerce/products?store_id=' + encodeURIComponent(this.storeId);
      else if (s === 'orders') path = '/api/commerce/orders?store_id=' + encodeURIComponent(this.storeId);
      else if (s === 'refunds') path = '/api/commerce/refunds' + (this.storeId ? '?store_id=' + encodeURIComponent(this.storeId) : '');
      else if (s === 'billing') path = '/api/commerce/billing?store_id=' + encodeURIComponent(this.storeId);
      else if (s === 'reports') return;
      this.setData(await this.api.get(path));
    } catch (e: any) { this.toast.danger(e.message, 'Load failed'); }
    finally { this.loading.set(false); }
  }

  actionsFor(r: Row): { label: string; variant: any; run: () => void }[] {
    const s = this.section();
    const id = r['id'] ?? r['store_id'] ?? r['order_id'] ?? r['refund_id'] ?? r['product_id'] ?? r['slug'];
    if (s === 'stores') return [
      { label: 'Activate', variant: 'ghost', run: () => this.storeAction(id, 'activate') },
      { label: 'Suspend', variant: 'ghost', run: () => this.storeAction(id, 'suspend') },
      { label: 'Archive', variant: 'destructive', run: () => this.storeAction(id, 'archive') },
    ];
    if (s === 'products') return [{ label: 'Delete', variant: 'destructive', run: () => this.write('DELETE', '/api/commerce/products/' + encodeURIComponent(id)) }];
    if (s === 'orders') return [{ label: 'Show', variant: 'ghost', run: () => this.showDetail('Order ' + id, '/api/commerce/orders/' + encodeURIComponent(id)) }];
    if (s === 'refunds') return [
      { label: 'Approve', variant: 'primary', run: () => this.write('POST', '/api/commerce/refunds/' + encodeURIComponent(id) + '/approve') },
      { label: 'Deny', variant: 'destructive', run: () => { this.denyTarget.set(id); this.denyReason = ''; this.detailTitle.set('Deny refund ' + id); this.denyOpen.set(true); } },
    ];
    return [];
  }

  async storeAction(id: string, action: string) {
    await this.write('POST', `/api/commerce/stores/${encodeURIComponent(id)}/${action}`);
  }

  async write(method: string, path: string, body?: unknown) {
    try {
      const fn = method === 'POST' ? this.api.post(path, body) : method === 'DELETE' ? this.api.del(path) : this.api.put(path, body);
      const r = await fn;
      this.toast.success(r.reply || 'Done');
      await this.reload();
    } catch (e: any) { this.toast.danger(e.message, 'Failed'); }
  }

  async showDetail(title: string, path: string) {
    try { const d = await this.api.get(path); this.detailTitle.set(title); this.detailText.set(d.text || JSON.stringify(d.json, null, 2)); this.detailOpen.set(true); }
    catch (e: any) { this.toast.danger(e.message, 'Failed'); }
  }

  async confirmDeny() {
    const id = this.denyTarget();
    if (!id) return;
    this.denyOpen.set(false);
    await this.write('POST', '/api/commerce/refunds/' + encodeURIComponent(id) + '/deny', { reason: this.denyReason });
    this.denyTarget.set(null);
  }

  async invoice() {
    if (!this.storeId) return;
    await this.write('POST', '/api/commerce/billing/invoice', { store_id: this.storeId });
  }

  async createStore() {
    try {
      const r = await this.api.post('/api/commerce/stores', { ...this.ns, monthly_price_stars: Number(this.ns.monthly_price_stars || 0) });
      this.newStore.set(false); this.toast.success(r.reply || 'Store created'); await this.reload();
    } catch (e: any) { this.toast.danger(e.message, 'Create failed'); }
  }

  async createProduct() {
    let obj: any;
    try { obj = JSON.parse(this.productJson); } catch { this.toast.warning('Invalid JSON'); return; }
    try { const r = await this.api.post('/api/commerce/products', obj); this.newProduct.set(false); this.toast.success(r.reply || 'Created'); await this.reload(); }
    catch (e: any) { this.toast.danger(e.message, 'Create failed'); }
  }

  async platformReport() {
    this.loading.set(true);
    try { const d = await this.api.get('/api/commerce/report/platform'); this.rows.set([]); this.text.set(d.text || JSON.stringify(d.json, null, 2)); }
    catch (e: any) { this.toast.danger(e.message, 'Failed'); }
    finally { this.loading.set(false); }
  }
  async storeReport() {
    if (!this.storeId) return;
    this.loading.set(true);
    try { const d = await this.api.get('/api/commerce/report/store?store_id=' + encodeURIComponent(this.storeId)); this.rows.set([]); this.text.set(d.text || JSON.stringify(d.json, null, 2)); }
    catch (e: any) { this.toast.danger(e.message, 'Failed'); }
    finally { this.loading.set(false); }
  }
}
