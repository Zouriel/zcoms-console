import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UiToastService } from 'ui/dialog';
import { Api } from '../core/api';
import { UI } from '../core/ui';

interface Handle { platform: string; handle: string; }
interface Contact { id: number; name: string; note?: string; handles?: Handle[]; }

@Component({
  selector: 'app-contacts',
  imports: [FormsModule, ...UI],
  template: `
    <div class="page-head">
      <ui-text variant="caption" class="muted">addressing directory — every tier resolves "message &lt;name&gt;" through here</ui-text>
      <span class="spacer"></span>
      <ui-button variant="primary" (click)="openAdd()">Add contact</ui-button>
    </div>

    <ui-card padding="md">
      @if (loading()) {
        <ui-spinner></ui-spinner>
      } @else {
        <div class="tbl-scroll"><table class="tbl">
          <thead>
            <tr><th>Name</th><th>Note</th><th>Handles</th><th style="width:1%"></th></tr>
          </thead>
          <tbody>
            @for (c of contacts(); track c.id) {
              <tr>
                <td><ui-input [(ngModel)]="c.name" placeholder="name"></ui-input></td>
                <td><ui-input [(ngModel)]="c.note" placeholder="note"></ui-input></td>
                <td>
                  <div class="row">
                    @for (h of c.handles || []; track h.platform + h.handle) {
                      <ui-chip tone="neutral">{{ h.platform }}:{{ h.handle }}
                        <button class="x" (click)="removeHandle(h)">×</button>
                      </ui-chip>
                    }
                  </div>
                  <div class="row" style="margin-top:6px">
                    <input class="mini" [(ngModel)]="getDraft(c.id).platform" placeholder="platform">
                    <input class="mini" [(ngModel)]="getDraft(c.id).handle" placeholder="handle">
                    <ui-button variant="ghost" size="sm" (click)="addHandle(c)">+ handle</ui-button>
                  </div>
                </td>
                <td>
                  <div class="row-actions">
                    <ui-button variant="secondary" size="sm" (click)="save(c)">Save</ui-button>
                    <ui-button variant="destructive" size="sm" (click)="confirmDelete(c)">Delete</ui-button>
                  </div>
                </td>
              </tr>
            } @empty {
              <tr><td colspan="4" class="empty">No contacts yet.</td></tr>
            }
          </tbody>
        </table></div>
      }
    </ui-card>

    <ui-modal [(open)]="adding" title="New contact">
      <div class="stack">
        <ui-form-field label="Name"><ui-input [(ngModel)]="newName" placeholder="e.g. Ali"></ui-input></ui-form-field>
        <ui-form-field label="Note"><ui-input [(ngModel)]="newNote" placeholder="optional"></ui-input></ui-form-field>
      </div>
      <div modal-footer class="row-actions">
        <ui-button variant="ghost" (click)="adding.set(false)">Cancel</ui-button>
        <ui-button variant="primary" (click)="create()">Create</ui-button>
      </div>
    </ui-modal>

    <ui-modal [(open)]="deleting" title="Delete contact" size="sm">
      <ui-text variant="body">Delete <b>{{ target()?.name }}</b>?</ui-text>
      <div modal-footer class="row-actions">
        <ui-button variant="ghost" (click)="deleting.set(false)">Cancel</ui-button>
        <ui-button variant="destructive" (click)="doDelete()">Delete</ui-button>
      </div>
    </ui-modal>
  `,
  styles: [`
    .x { background: none; border: 0; color: var(--ui-color-text-muted); cursor: pointer; font-size: 14px; padding: 0 0 0 4px; }
    .mini { background: var(--ui-color-bg); color: var(--ui-color-text); border: 1px solid var(--ui-color-border);
            border-radius: var(--ui-radius); padding: 4px 8px; font: inherit; width: 8rem; }
  `],
})
export class ContactsPage {
  private api = inject(Api);
  private toast = inject(UiToastService);

  contacts = signal<Contact[]>([]);
  loading = signal(true);
  adding = signal(false);
  deleting = signal(false);
  target = signal<Contact | null>(null);
  newName = '';
  newNote = '';
  draft: Record<number, Handle> = {};

  constructor() { this.load(); }

  getDraft(id: number): Handle {
    if (!this.draft[id]) this.draft[id] = { platform: '', handle: '' };
    return this.draft[id];
  }

  async load() {
    this.loading.set(true);
    try { this.contacts.set((await this.api.get('/api/contacts')) || []); }
    catch (e: any) { this.toast.danger(e.message, 'Load failed'); }
    finally { this.loading.set(false); }
  }

  openAdd() { this.newName = ''; this.newNote = ''; this.adding.set(true); }

  async create() {
    if (!this.newName.trim()) return;
    try {
      await this.api.post('/api/contacts', { name: this.newName, note: this.newNote });
      this.adding.set(false);
      this.toast.success('Contact added');
      this.load();
    } catch (e: any) { this.toast.danger(e.message, 'Create failed'); }
  }

  async save(c: Contact) {
    try { await this.api.put('/api/contacts/' + c.id, { name: c.name, note: c.note }); this.toast.success('Saved'); }
    catch (e: any) { this.toast.danger(e.message, 'Save failed'); }
  }

  confirmDelete(c: Contact) { this.target.set(c); this.deleting.set(true); }

  async doDelete() {
    const c = this.target();
    if (!c) return;
    try { await this.api.del('/api/contacts/' + c.id); this.deleting.set(false); this.toast.success('Deleted'); this.load(); }
    catch (e: any) { this.toast.danger(e.message, 'Delete failed'); }
  }

  async addHandle(c: Contact) {
    const d = this.getDraft(c.id);
    if (!d.platform || !d.handle) return;
    try { await this.api.post(`/api/contacts/${c.id}/handles`, { platform: d.platform, handle: d.handle }); this.draft[c.id] = { platform: '', handle: '' }; this.load(); }
    catch (e: any) { this.toast.danger(e.message, 'Add handle failed'); }
  }

  async removeHandle(h: Handle) {
    try { await this.api.del('/api/handles', { platform: h.platform, handle: h.handle }); this.load(); }
    catch (e: any) { this.toast.danger(e.message, 'Remove failed'); }
  }
}
