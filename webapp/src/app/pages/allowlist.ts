import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UiToastService } from 'ui/dialog';
import { Api } from '../core/api';
import { UI } from '../core/ui';

interface Allow { id: number; platform: string; handle: string; max_role: string; }
interface Contact {
  id: number; name: string; aliases?: string[];
  phone?: string; telegram?: string; whatsapp?: string; instagram?: string; discord?: string; viber?: string;
}
const ROLES = [
  { label: 'read', value: 'read' }, { label: 'confirm', value: 'confirm' },
  { label: 'edit', value: 'edit' }, { label: 'full', value: 'full' },
];
// The channels an allow-list entry can target, with the fallback rule the server
// uses (phone reaches Telegram/WhatsApp/Viber). Kept in sync with Contact.Address.
const CHANNELS: { key: keyof Contact; phoneFallback: boolean }[] = [
  { key: 'telegram', phoneFallback: true },
  { key: 'whatsapp', phoneFallback: true },
  { key: 'instagram', phoneFallback: false },
  { key: 'discord', phoneFallback: false },
  { key: 'viber', phoneFallback: true },
];

@Component({
  selector: 'app-allowlist',
  imports: [FormsModule, ...UI],
  template: `
    <div class="page-head">
      <ui-text variant="caption" class="muted">who may drive the agent — keep this tiny (≈ shell access). Add a saved contact to allow-list every channel they have at once.</ui-text>
    </div>

    <ui-card padding="md">
      <ui-text variant="label" style="display:block;margin-bottom:8px">Add from a contact</ui-text>
      <div class="toolbar">
        <ui-combobox class="grow" [options]="contactOptions()" [(ngModel)]="contactId" placeholder="Search contacts…"></ui-combobox>
        <ui-select [options]="roles" [(ngModel)]="contactRole"></ui-select>
        <ui-button variant="primary" [disabled]="!contactId" (click)="addContact()">Add all channels</ui-button>
      </div>
      @if (pickedChannels().length) {
        <ui-text variant="caption" class="muted" style="display:block;margin:-6px 0 14px">
          Will allow-list: {{ pickedChannels().join(', ') }}
        </ui-text>
      } @else {
        <ui-text variant="caption" class="muted" style="display:block;margin:-6px 0 14px">
          Telegram + WhatsApp are routed today; Instagram/Discord/Viber are stored for when those connect.
        </ui-text>
      }

      <ui-text variant="label" style="display:block;margin:6px 0 8px">Or add a single handle</ui-text>
      <div class="toolbar">
        <ui-select [options]="platforms" [(ngModel)]="platform"></ui-select>
        <ui-input class="grow" [(ngModel)]="handle" [placeholder]="platform === 'whatsapp' ? '+960 number' : '@handle'"></ui-input>
        <ui-select [options]="roles" [(ngModel)]="role"></ui-select>
        <ui-button variant="secondary" (click)="add()">Add</ui-button>
      </div>

      @if (loading()) { <ui-spinner></ui-spinner> } @else {
        <div class="tbl-scroll"><table class="tbl">
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
        </table></div>
      }
    </ui-card>
  `,
  styles: [`
    .toolbar { display: flex; gap: var(--ui-space-2); align-items: center; margin-bottom: 6px; flex-wrap: wrap; }
    .grow { flex: 1; min-width: 200px; }
  `],
})
export class AllowlistPage {
  private api = inject(Api);
  private toast = inject(UiToastService);
  items = signal<Allow[]>([]);
  contacts = signal<Contact[]>([]);
  loading = signal(true);
  roles = ROLES;

  // Manual single-handle add.
  platform = 'telegram';
  handle = '';
  role = 'read';
  platforms = [
    { label: 'Telegram', value: 'telegram' }, { label: 'WhatsApp', value: 'whatsapp' },
    { label: 'Instagram', value: 'instagram' }, { label: 'Discord', value: 'discord' }, { label: 'Viber', value: 'viber' },
  ];

  // Contact picker.
  contactId = '';
  contactRole = 'read';
  contactOptions = computed(() =>
    this.contacts().map(c => ({ label: c.name + (c.aliases?.length ? ` (${c.aliases.join(', ')})` : ''), value: String(c.id) })));
  // The channels that *would* be allow-listed for the currently picked contact.
  pickedChannels = computed(() => {
    const c = this.contacts().find(x => String(x.id) === this.contactId);
    if (!c) return [];
    return CHANNELS.filter(ch => (c[ch.key] as string) || (ch.phoneFallback && c.phone)).map(ch => ch.key as string);
  });

  constructor() { this.load(); }

  async load() {
    this.loading.set(true);
    try {
      const [allow, contacts] = await Promise.all([this.api.get('/api/allowlist'), this.api.get('/api/contacts')]);
      this.items.set(allow || []);
      this.contacts.set(contacts || []);
    } catch (e: any) { this.toast.danger(e.message, 'Load failed'); }
    finally { this.loading.set(false); }
  }

  async add() {
    if (!this.handle.trim()) return;
    try { await this.api.post('/api/allowlist', { platform: this.platform, handle: this.handle, role: this.role }); this.handle = ''; this.toast.success('Added'); await this.load(); }
    catch (e: any) { this.toast.danger(e.message, 'Add failed'); }
  }

  async addContact() {
    if (!this.contactId) return;
    try {
      const res: any = await this.api.post('/api/allowlist/from-contact', { contact_id: Number(this.contactId), role: this.contactRole });
      const added = (res?.added || []).join(', ');
      this.toast.success(`Allow-listed ${res?.contact} on ${added || 'no channels'}`);
      if (res?.failed?.length) this.toast.warning(res.failed.join('; '), 'Some channels failed');
      this.contactId = '';
      await this.load();
    } catch (e: any) { this.toast.danger(e.message, 'Add failed'); }
  }

  async remove(a: Allow) {
    try { await this.api.del('/api/allowlist/' + a.id); this.toast.success('Removed'); await this.load(); }
    catch (e: any) { this.toast.danger(e.message, 'Remove failed'); }
  }
}
