import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UiToastService } from 'ui/dialog';
import { Api } from '../core/api';
import { UI } from '../core/ui';

interface Contact {
  id: number;
  name: string;
  aliases?: string[];
  phone?: string;
  email?: string;
  telegram?: string;
  whatsapp?: string;
  instagram?: string;
  discord?: string;
  viber?: string;
  github?: string;
  note?: string;
}
const blank = (): Contact => ({ id: 0, name: '', aliases: [], phone: '', email: '', telegram: '', whatsapp: '', instagram: '', discord: '', viber: '', github: '', note: '' });

@Component({
  selector: 'app-contacts',
  imports: [FormsModule, ...UI],
  template: `
    <div class="page-head">
      <ui-text variant="caption" class="muted">addressing directory — a phone reaches Telegram/WhatsApp/Viber; Discord needs its own id</ui-text>
      <span class="spacer"></span>
      <ui-button variant="primary" (click)="openNew()">Add contact</ui-button>
    </div>

    <ui-card padding="md">
      @if (loading()) { <ui-spinner></ui-spinner> } @else {
        <div class="tbl-scroll"><table class="tbl">
          <thead><tr><th>Name</th><th>Aliases</th><th>Phone</th><th>Telegram</th><th>Email</th><th style="width:1%"></th></tr></thead>
          <tbody>
            @for (c of contacts(); track c.id) {
              <tr>
                <td>{{ c.name }}</td>
                <td class="muted">{{ (c.aliases && c.aliases.length) ? c.aliases.join(', ') : '—' }}</td>
                <td class="muted">{{ c.phone || '—' }}</td>
                <td class="muted">{{ c.telegram || '—' }}</td>
                <td class="muted">{{ c.email || '—' }}</td>
                <td>
                  <div class="row-actions">
                    <ui-button variant="secondary" size="sm" (click)="openEdit(c)">Edit</ui-button>
                    <ui-button variant="destructive" size="sm" (click)="confirmDelete(c)">Delete</ui-button>
                  </div>
                </td>
              </tr>
            } @empty { <tr><td colspan="6" class="empty">No contacts yet.</td></tr> }
          </tbody>
        </table></div>
      }
    </ui-card>

    <ui-modal [(open)]="editing" [title]="form.id ? 'Edit contact' : 'New contact'">
      <div class="grid">
        <ui-form-field label="Name"><ui-input class="f" [(ngModel)]="form.name" placeholder="e.g. Ali"></ui-input></ui-form-field>
        <ui-form-field label="Aliases" hint="comma-separated nicknames — must be unique across all contacts">
          <ui-input class="f" [(ngModel)]="aliasesText" placeholder="e.g. Aliyya, Ali bro"></ui-input>
        </ui-form-field>
        <ui-form-field label="Mobile number" hint="reaches Telegram / WhatsApp / Viber">
          <ui-input class="f" [(ngModel)]="form.phone" placeholder="+960 …"></ui-input>
        </ui-form-field>
        <ui-form-field label="Email"><ui-input class="f" type="email" [(ngModel)]="form.email" placeholder="name@example.com"></ui-input></ui-form-field>
        <ui-form-field label="Telegram" hint="@handle — else the phone is used">
          <ui-input class="f" [(ngModel)]="form.telegram" placeholder="@handle"></ui-input>
        </ui-form-field>
        <ui-form-field label="WhatsApp" hint="id/number — else the phone is used">
          <ui-input class="f" [(ngModel)]="form.whatsapp" placeholder="defaults to phone"></ui-input>
        </ui-form-field>
        <ui-form-field label="Instagram" hint="@handle — no phone fallback (not active yet)">
          <ui-input class="f" [(ngModel)]="form.instagram" placeholder="@handle"></ui-input>
        </ui-form-field>
        <ui-form-field label="Discord" hint="needs its own id — no phone fallback (not active yet)">
          <ui-input class="f" [(ngModel)]="form.discord" placeholder="discord id"></ui-input>
        </ui-form-field>
        <ui-form-field label="Viber" hint="id — else the phone is used (not active yet)">
          <ui-input class="f" [(ngModel)]="form.viber" placeholder="defaults to phone"></ui-input>
        </ui-form-field>
        <ui-form-field label="GitHub" hint="handle (contact info)">
          <ui-input class="f" [(ngModel)]="form.github" placeholder="octocat"></ui-input>
        </ui-form-field>
        <ui-form-field label="Note" class="span2"><ui-input class="f" [(ngModel)]="form.note" placeholder="optional"></ui-input></ui-form-field>
      </div>
      <div modal-footer class="row-actions">
        <ui-button variant="ghost" (click)="editing.set(false)">Cancel</ui-button>
        <ui-button variant="primary" (click)="save()">{{ form.id ? 'Save' : 'Create' }}</ui-button>
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
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--ui-space-3); }
    .span2 { grid-column: 1 / -1; }
    ui-input.f { display: block; width: 100%; }
    @media (max-width: 620px) { .grid { grid-template-columns: 1fr; } }
  `],
})
export class ContactsPage {
  private api = inject(Api);
  private toast = inject(UiToastService);

  contacts = signal<Contact[]>([]);
  loading = signal(true);
  editing = signal(false);
  deleting = signal(false);
  target = signal<Contact | null>(null);
  form: Contact = blank();

  // Aliases are edited as one comma-separated field, stored as a string[].
  get aliasesText(): string { return (this.form.aliases || []).join(', '); }
  set aliasesText(v: string) {
    this.form.aliases = v.split(',').map(s => s.trim()).filter(Boolean);
  }

  constructor() { this.load(); }

  async load() {
    this.loading.set(true);
    try { this.contacts.set((await this.api.get('/api/contacts')) || []); }
    catch (e: any) { this.toast.danger(e.message, 'Load failed'); }
    finally { this.loading.set(false); }
  }

  openNew() { this.form = blank(); this.editing.set(true); }
  openEdit(c: Contact) { this.form = { ...blank(), ...c }; this.editing.set(true); }

  async save() {
    if (!this.form.name.trim()) { this.toast.warning('Name is required'); return; }
    try {
      if (this.form.id) await this.api.put('/api/contacts/' + this.form.id, this.form);
      else await this.api.post('/api/contacts', this.form);
      this.editing.set(false);
      this.toast.success('Saved');
      await this.load();
    } catch (e: any) { this.toast.danger(e.message, 'Save failed'); }
  }

  confirmDelete(c: Contact) { this.target.set(c); this.deleting.set(true); }
  async doDelete() {
    const c = this.target();
    if (!c) return;
    try { await this.api.del('/api/contacts/' + c.id); this.deleting.set(false); this.toast.success('Deleted'); await this.load(); }
    catch (e: any) { this.toast.danger(e.message, 'Delete failed'); }
  }
}
