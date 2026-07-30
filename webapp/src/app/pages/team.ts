import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UiToastService } from 'ui/dialog';
import { Api } from '../core/api';
import { UI } from '../core/ui';

// Team admin. Every read/write is proxied by the Go server to the zcoms-team
// module over team.sock; nothing here touches team.db. The module may be stopped,
// in which case /api/team/status reports running:false and the page shows a start
// hint instead of an error on each panel.

interface Delegator {
  id: string;
  name: string;
  github_owner?: string;
  github_project_number?: number;
  local_only: boolean;
  has_github: boolean;
}
interface Standup {
  id: string;
  name: string;
  delegator: string;
  telegram_group: string;
  schedule_time: string;
  timezone: string;
  enabled: boolean;
  next_run?: string;
}
interface Staff {
  id: string;
  telegram_username: string;
  github_username?: string;
  role: string;
  max_active_tasks: number;
  active_tasks: number;
}
interface Task {
  id: string;
  title: string;
  priority: string;
  status: string;
  assigned_to?: string;
}
interface Run {
  id: string;
  run_date: string;
  status: string;
  group_report?: string;
  error_message?: string;
}
interface Audit {
  actor: string;
  action: string;
  entity_type: string;
  entity_id: string;
  created_at: string;
}

const ROLES = [
  { label: 'Staff', value: 'staff' },
  { label: 'Lead', value: 'lead' },
  { label: 'Admin', value: 'admin' },
];
const PRIORITIES = [
  { label: 'Critical', value: 'critical' },
  { label: 'High', value: 'high' },
  { label: 'Medium', value: 'medium' },
  { label: 'Low', value: 'low' },
];
const STATUSES = [
  { label: 'Unassigned', value: 'unassigned' },
  { label: 'Assigned', value: 'assigned' },
  { label: 'Blocked', value: 'blocked' },
  { label: 'In review', value: 'review' },
  { label: 'Done', value: 'done' },
];
const EDIT_FIELDS = [
  { label: 'Time (HH:MM)', value: 'time' },
  { label: 'Timezone', value: 'timezone' },
  { label: 'Telegram group', value: 'group' },
];

function statusTone(s: string): 'success' | 'warning' | 'danger' | 'neutral' {
  if (s === 'done') return 'success';
  if (s === 'blocked') return 'danger';
  if (s === 'review' || s === 'assigned') return 'warning';
  return 'neutral';
}

@Component({
  selector: 'app-team',
  imports: [FormsModule, ...UI],
  template: `
    <div class="page-head">
      <ui-text variant="caption" class="muted">
        team coordination — delegators, standups, staff and the task pool. Everything here is
        proxied to the zcoms-team module; pausing a standup keeps all of its history.
      </ui-text>
    </div>

    @if (!running()) {
      <ui-alert tone="warning">
        <ui-text variant="body">
          The team module isn't running. Start it with
          <code>systemctl --user start zcoms-team</code>, then reload this page.
        </ui-text>
      </ui-alert>
    } @else {

    <!-- Delegators -->
    <ui-card padding="md">
      <ui-text variant="h4">Delegators</ui-text>
      <ui-text variant="caption" class="muted">A delegator is one project board. Local-only, or linked to a GitHub Projects v2 board.</ui-text>
      <div class="grid">
        <ui-form-field label="Name">
          <ui-input [(ngModel)]="newDel.name" placeholder="hems"></ui-input>
        </ui-form-field>
        <ui-form-field label="GitHub owner (optional)">
          <ui-input [(ngModel)]="newDel.github_owner" placeholder="Zouriel"></ui-input>
        </ui-form-field>
        <ui-form-field label="Project #">
          <ui-input inputmode="numeric" [(ngModel)]="newDel.github_project_number"></ui-input>
        </ui-form-field>
      </div>
      <div class="row">
        <span class="spacer"></span>
        <ui-button variant="primary" (click)="createDelegator()">Add delegator</ui-button>
      </div>

      <div class="tbl-scroll"><table class="tbl">
        <thead><tr><th>Name</th><th>Board</th><th style="width:1%"></th></tr></thead>
        <tbody>
          @for (d of delegators(); track d.id) {
            <tr [class.sel]="d.name === selected()">
              <td><a class="lnk" (click)="select(d.name)">{{ d.name }}</a></td>
              <td class="muted">
                @if (d.has_github) { {{ d.github_owner }}/#{{ d.github_project_number }} }
                @else { local-only }
              </td>
              <td class="actions">
                <ui-button variant="ghost" size="sm" (click)="select(d.name)">Open</ui-button>
                <ui-button variant="destructive" size="sm" (click)="removeDelegator(d)">Delete</ui-button>
              </td>
            </tr>
          } @empty { <tr><td colspan="3" class="empty">No delegators yet — add one above.</td></tr> }
        </tbody>
      </table></div>
    </ui-card>

    <div style="height:16px"></div>

    <!-- Standups -->
    <ui-card padding="md">
      <ui-text variant="h4">Standups</ui-text>
      <ui-text variant="caption" class="muted">Paused standups are listed too. Pausing is reversible and keeps every past run.</ui-text>
      <div class="grid">
        <ui-form-field label="Name">
          <ui-input [(ngModel)]="newSu.name" placeholder="hems-daily"></ui-input>
        </ui-form-field>
        <ui-form-field label="Delegator">
          <ui-select [options]="delegatorOptions()" [(ngModel)]="newSu.delegator"></ui-select>
        </ui-form-field>
        <ui-form-field label="Telegram group">
          <ui-input [(ngModel)]="newSu.telegram_group" placeholder="-4777377915"></ui-input>
        </ui-form-field>
        <ui-form-field label="Time (HH:MM)">
          <ui-input [(ngModel)]="newSu.schedule_time" placeholder="09:00"></ui-input>
        </ui-form-field>
        <ui-form-field label="Timezone">
          <ui-input [(ngModel)]="newSu.timezone" placeholder="Indian/Maldives"></ui-input>
        </ui-form-field>
      </div>
      <div class="row">
        <span class="spacer"></span>
        <ui-button variant="primary" (click)="createStandup()">Add standup</ui-button>
      </div>

      <div class="tbl-scroll"><table class="tbl">
        <thead><tr><th>Name</th><th>Delegator</th><th>Group</th><th>Schedule</th><th>Next run</th><th>Enabled</th><th style="width:1%"></th></tr></thead>
        <tbody>
          @for (su of standups(); track su.id) {
            <tr>
              <td>{{ su.name }}</td>
              <td class="muted">{{ su.delegator }}</td>
              <td class="muted">{{ su.telegram_group }}</td>
              <td>{{ su.schedule_time }} <span class="muted">({{ su.timezone }})</span></td>
              <td class="muted">{{ su.next_run ? fmt(su.next_run) : 'paused' }}</td>
              <td><ui-switch [ngModel]="su.enabled" (ngModelChange)="toggleStandup(su, $event)"></ui-switch></td>
              <td class="actions">
                <ui-button variant="ghost" size="sm" (click)="openEdit(su)">Edit</ui-button>
                <ui-button variant="ghost" size="sm" (click)="loadRuns(su)">Runs</ui-button>
              </td>
            </tr>
          } @empty { <tr><td colspan="7" class="empty">No standups configured.</td></tr> }
        </tbody>
      </table></div>
    </ui-card>

    <div style="height:16px"></div>

    @if (selected()) {
      <!-- Staff -->
      <ui-card padding="md">
        <ui-text variant="h4">Staff in {{ selected() }}</ui-text>
        <div class="grid">
          <ui-form-field label="Telegram">
            <ui-input [(ngModel)]="newStaff.telegram_username" placeholder="@handle"></ui-input>
          </ui-form-field>
          <ui-form-field label="GitHub (optional)">
            <ui-input [(ngModel)]="newStaff.github_username"></ui-input>
          </ui-form-field>
          <ui-form-field label="Role">
            <ui-select [options]="roles" [(ngModel)]="newStaff.role"></ui-select>
          </ui-form-field>
          <ui-form-field label="Task limit">
            <ui-input inputmode="numeric" [(ngModel)]="newStaff.max_active_tasks"></ui-input>
          </ui-form-field>
        </div>
        <div class="row">
          <span class="spacer"></span>
          <ui-button variant="primary" (click)="addStaff()">Add staff</ui-button>
        </div>

        <div class="tbl-scroll"><table class="tbl">
          <thead><tr><th>Telegram</th><th>GitHub</th><th>Role</th><th>Load</th><th style="width:1%"></th></tr></thead>
          <tbody>
            @for (st of staff(); track st.id) {
              <tr>
                <td>{{ st.telegram_username }}</td>
                <td class="muted">{{ st.github_username || '—' }}</td>
                <td>
                  <ui-select [options]="roles" [ngModel]="st.role" (ngModelChange)="setRole(st, $event)"></ui-select>
                </td>
                <td class="muted">{{ st.active_tasks }} / {{ st.max_active_tasks }}</td>
                <td class="actions">
                  <ui-button variant="destructive" size="sm" (click)="removeStaff(st)">Remove</ui-button>
                </td>
              </tr>
            } @empty { <tr><td colspan="5" class="empty">No staff in this delegator yet.</td></tr> }
          </tbody>
        </table></div>
      </ui-card>

      <div style="height:16px"></div>

      <!-- Tasks -->
      <ui-card padding="md">
        <ui-text variant="h4">Tasks in {{ selected() }}</ui-text>
        <div class="grid">
          <ui-form-field label="Title">
            <ui-input [(ngModel)]="newTask.title" placeholder="Ship the thing"></ui-input>
          </ui-form-field>
          <ui-form-field label="Priority">
            <ui-select [options]="priorities" [(ngModel)]="newTask.priority"></ui-select>
          </ui-form-field>
        </div>
        <div class="row">
          <span class="spacer"></span>
          <ui-button variant="primary" (click)="addTask()">Add task</ui-button>
        </div>

        <div class="tbl-scroll"><table class="tbl">
          <thead><tr><th>Task</th><th>Priority</th><th>Status</th><th>Assignee</th><th style="width:1%"></th></tr></thead>
          <tbody>
            @for (t of tasks(); track t.id) {
              <tr>
                <td class="title">{{ t.title }}</td>
                <td><ui-chip>{{ t.priority }}</ui-chip></td>
                <td>
                  <ui-select [options]="statuses" [ngModel]="t.status" (ngModelChange)="setStatus(t, $event)"></ui-select>
                </td>
                <td>
                  <ui-select [options]="assigneeOptions()" [ngModel]="t.assigned_to || ''" (ngModelChange)="assign(t, $event)"></ui-select>
                </td>
                <td class="actions">
                  <ui-badge [tone]="tone(t.status)">{{ t.status }}</ui-badge>
                </td>
              </tr>
            } @empty { <tr><td colspan="5" class="empty">No tasks in this delegator.</td></tr> }
          </tbody>
        </table></div>
      </ui-card>

      <div style="height:16px"></div>
    }

    <!-- Audit -->
    <ui-card padding="md">
      <div class="row" style="margin:0">
        <ui-text variant="h4">Recent activity</ui-text>
        <span class="spacer"></span>
        <ui-button variant="ghost" size="sm" (click)="loadAudit()">Refresh</ui-button>
      </div>
      <div class="tbl-scroll"><table class="tbl">
        <thead><tr><th>When</th><th>Action</th><th>Entity</th><th>Actor</th></tr></thead>
        <tbody>
          @for (a of audit(); track a.created_at + a.entity_id) {
            <tr>
              <td class="muted">{{ fmt(a.created_at) }}</td>
              <td>{{ a.action }}</td>
              <td class="muted">{{ a.entity_type }}</td>
              <td class="muted">{{ a.actor }}</td>
            </tr>
          } @empty { <tr><td colspan="4" class="empty">No activity recorded.</td></tr> }
        </tbody>
      </table></div>
    </ui-card>
    }

    <!-- Standup edit modal -->
    <ui-modal [(open)]="editOpen" title="Edit standup">
      @if (editing()) {
        <ui-text variant="caption" class="muted">{{ editing()!.name }}</ui-text>
        <div class="grid">
          <ui-form-field label="Field">
            <ui-select [options]="editFields" [(ngModel)]="editField"></ui-select>
          </ui-form-field>
          <ui-form-field label="Value">
            <ui-input [(ngModel)]="editValue" [placeholder]="editPlaceholder()"></ui-input>
          </ui-form-field>
        </div>
        <div class="row">
          <span class="spacer"></span>
          <ui-button variant="ghost" (click)="editOpen.set(false)">Cancel</ui-button>
          <ui-button variant="primary" (click)="saveEdit()">Save</ui-button>
        </div>
      }
    </ui-modal>

    <!-- Runs modal -->
    <ui-modal [(open)]="runsOpen" title="Standup runs">
      @if (runsFor()) {
        <ui-text variant="caption" class="muted">{{ runsFor() }}</ui-text>
        @for (r of runs(); track r.id) {
          <div class="run">
            <div class="row" style="margin:0">
              <strong>{{ r.run_date }}</strong>
              <span class="spacer"></span>
              <ui-badge [tone]="r.status === 'completed' ? 'success' : r.status === 'failed' ? 'danger' : 'neutral'">{{ r.status }}</ui-badge>
            </div>
            @if (r.group_report) { <pre class="report">{{ r.group_report }}</pre> }
            @if (r.error_message) { <ui-text variant="caption" class="err">{{ r.error_message }}</ui-text> }
          </div>
        } @empty { <ui-text variant="caption" class="muted">No runs recorded.</ui-text> }
      }
    </ui-modal>
  `,
  styles: [`
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; margin-top: 8px; }
    .row { display: flex; align-items: center; gap: 10px; margin: 12px 0; }
    .spacer { flex: 1; }
    .actions { display: flex; gap: 6px; align-items: center; }
    .lnk { cursor: pointer; text-decoration: underline; }
    tr.sel { background: var(--ui-color-surface-2, rgba(127,127,127,0.08)); }
    .title { max-width: 420px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .run { padding: 10px 0; border-bottom: 1px solid var(--ui-color-border, rgba(127,127,127,0.2)); }
    .report { white-space: pre-wrap; font-size: 12px; margin: 6px 0 0; overflow-x: auto; }
    .err { color: var(--ui-color-danger, #c33); }
  `],
})
export class TeamPage {
  private api = inject(Api);
  private toast = inject(UiToastService);

  running = signal(true);
  delegators = signal<Delegator[]>([]);
  standups = signal<Standup[]>([]);
  staff = signal<Staff[]>([]);
  tasks = signal<Task[]>([]);
  audit = signal<Audit[]>([]);
  runs = signal<Run[]>([]);
  selected = signal('');

  roles = ROLES;
  priorities = PRIORITIES;
  statuses = STATUSES;
  editFields = EDIT_FIELDS;

  newDel = { name: '', github_owner: '', github_project_number: 0 };
  newSu = { name: '', delegator: '', telegram_group: '', schedule_time: '09:00', timezone: 'Indian/Maldives' };
  newStaff = { telegram_username: '', github_username: '', role: 'staff', max_active_tasks: 5 };
  newTask = { title: '', priority: 'high' };

  editOpen = signal(false);
  editing = signal<Standup | null>(null);
  editField = signal('time');
  editValue = signal('');
  runsOpen = signal(false);
  runsFor = signal('');

  delegatorOptions = computed(() => this.delegators().map((d) => ({ label: d.name, value: d.name })));
  // An empty option is what "unassign" looks like in a select.
  assigneeOptions = computed(() => [
    { label: '— unassigned —', value: '' },
    ...this.staff().map((s) => ({ label: s.telegram_username, value: s.telegram_username })),
  ]);
  editPlaceholder = computed(() => {
    const f = this.editField();
    if (f === 'time') return '09:00';
    if (f === 'timezone') return 'Indian/Maldives';
    return '-4777377915';
  });

  constructor() { this.load(); }

  fmt(s: string) { return s ? new Date(s).toLocaleString() : ''; }
  tone(s: string) { return statusTone(s); }

  private fail(e: any, what: string) { this.toast.danger(e?.message || String(e), what); }

  async load() {
    try {
      const st = await this.api.get('/api/team/status');
      this.running.set(!!st.running);
      if (!st.running) return;
    } catch (e: any) { this.fail(e, 'Status failed'); return; }
    await Promise.all([this.loadCore(), this.loadAudit()]);
  }

  private async loadCore() {
    try {
      const ov = await this.api.get('/api/team/overview');
      this.delegators.set(ov.delegators || []);
      this.standups.set(ov.standups || []);
      if (!this.newSu.delegator && this.delegators().length) {
        this.newSu.delegator = this.delegators()[0].name;
      }
      // Keep a selection so the staff and task panels have a scope.
      if (!this.selected() && this.delegators().length) {
        await this.select(this.delegators()[0].name);
      }
    } catch (e: any) { this.fail(e, 'Load failed'); }
  }

  async loadAudit() {
    try { this.audit.set((await this.api.get('/api/team/audit?limit=25')) || []); }
    catch (e: any) { this.fail(e, 'Audit failed'); }
  }

  async select(name: string) {
    this.selected.set(name);
    await Promise.all([this.loadStaff(), this.loadTasks()]);
  }

  private async loadStaff() {
    try { this.staff.set((await this.api.get('/api/team/staff?delegator=' + encodeURIComponent(this.selected()))) || []); }
    catch (e: any) { this.fail(e, 'Staff failed'); }
  }

  private async loadTasks() {
    try { this.tasks.set((await this.api.get('/api/team/tasks?delegator=' + encodeURIComponent(this.selected()))) || []); }
    catch (e: any) { this.fail(e, 'Tasks failed'); }
  }

  // --- delegators ---

  async createDelegator() {
    const d = this.newDel;
    if (!d.name.trim()) { this.toast.danger('A delegator needs a name'); return; }
    try {
      const r = await this.api.post('/api/team/delegators', {
        name: d.name.trim(),
        github_owner: d.github_owner.trim(),
        github_project_number: Number(d.github_project_number) || 0,
      });
      this.toast.success(r.reply || 'Created');
      this.newDel = { name: '', github_owner: '', github_project_number: 0 };
      await this.loadCore();
    } catch (e: any) { this.fail(e, 'Create failed'); }
  }

  async removeDelegator(d: Delegator) {
    try {
      const r = await this.api.del('/api/team/delegators/' + encodeURIComponent(d.name));
      this.toast.success(r.reply || 'Deleted');
      if (this.selected() === d.name) { this.selected.set(''); }
      await this.loadCore();
    } catch (e: any) { this.fail(e, 'Delete failed'); }
  }

  // --- standups ---

  async createStandup() {
    const s = this.newSu;
    if (!s.name.trim() || !s.delegator || !s.telegram_group.trim()) {
      this.toast.danger('Name, delegator and Telegram group are required');
      return;
    }
    try {
      const r = await this.api.post('/api/team/standups', {
        name: s.name.trim(), delegator: s.delegator, telegram_group: s.telegram_group.trim(),
        schedule_time: s.schedule_time.trim(), timezone: s.timezone.trim(),
      });
      this.toast.success(r.reply || 'Created');
      this.newSu = { ...s, name: '', telegram_group: '' };
      await this.loadCore();
    } catch (e: any) { this.fail(e, 'Create failed'); }
  }

  async toggleStandup(su: Standup, on: boolean) {
    try {
      const r = await this.api.post(`/api/team/standups/${encodeURIComponent(su.name)}/${on ? 'enable' : 'disable'}`);
      this.toast.success(r.reply || (on ? 'Enabled' : 'Paused'));
    } catch (e: any) { this.fail(e, 'Update failed'); }
    await this.loadCore();
  }

  openEdit(su: Standup) {
    this.editing.set(su);
    this.editField.set('time');
    this.editValue.set(su.schedule_time);
    this.editOpen.set(true);
  }

  async saveEdit() {
    const su = this.editing();
    if (!su) return;
    const value = this.editValue().trim();
    if (!value) { this.toast.danger('A value is required'); return; }
    try {
      const r = await this.api.put('/api/team/standups/' + encodeURIComponent(su.name), {
        field: this.editField(), value,
      });
      this.toast.success(r.reply || 'Saved');
      this.editOpen.set(false);
      await this.loadCore();
    } catch (e: any) { this.fail(e, 'Save failed'); }
  }

  async loadRuns(su: Standup) {
    this.runsFor.set(su.name);
    this.runs.set([]);
    this.runsOpen.set(true);
    try { this.runs.set((await this.api.get(`/api/team/standups/${encodeURIComponent(su.name)}/runs?limit=10`)) || []); }
    catch (e: any) { this.fail(e, 'Runs failed'); }
  }

  // --- staff ---

  async addStaff() {
    const s = this.newStaff;
    if (!s.telegram_username.trim()) { this.toast.danger('A Telegram handle is required'); return; }
    try {
      const r = await this.api.post('/api/team/staff', { delegator: this.selected(), ...s, max_active_tasks: Number(s.max_active_tasks) || 0 });
      this.toast.success(r.reply || 'Added');
      this.newStaff = { telegram_username: '', github_username: '', role: 'staff', max_active_tasks: 5 };
      await this.loadStaff();
    } catch (e: any) { this.fail(e, 'Add failed'); }
  }

  async setRole(st: Staff, role: string) {
    if (role === st.role) return;
    try {
      await this.api.put('/api/team/staff/' + encodeURIComponent(st.telegram_username), { delegator: this.selected(), role });
      this.toast.success(`${st.telegram_username} is now ${role}`);
    } catch (e: any) { this.fail(e, 'Update failed'); }
    await this.loadStaff();
  }

  async removeStaff(st: Staff) {
    try {
      const r = await this.api.del(`/api/team/staff/${encodeURIComponent(st.telegram_username)}?delegator=${encodeURIComponent(this.selected())}`);
      this.toast.success(r.reply || 'Removed');
    } catch (e: any) { this.fail(e, 'Remove failed'); }
    await this.loadStaff();
  }

  // --- tasks ---

  async addTask() {
    const t = this.newTask;
    if (!t.title.trim()) { this.toast.danger('A task needs a title'); return; }
    try {
      const r = await this.api.post('/api/team/tasks', { delegator: this.selected(), priority: t.priority, title: t.title.trim() });
      this.toast.success(r.reply || 'Added');
      this.newTask = { title: '', priority: 'high' };
      await Promise.all([this.loadTasks(), this.loadStaff()]);
    } catch (e: any) { this.fail(e, 'Add failed'); }
  }

  async setStatus(t: Task, status: string) {
    if (status === t.status) return;
    try {
      const r = await this.api.post(`/api/team/tasks/${encodeURIComponent(t.id)}/status`, { delegator: this.selected(), status });
      this.toast.success(r.reply || 'Updated');
    } catch (e: any) { this.fail(e, 'Update failed'); }
    await Promise.all([this.loadTasks(), this.loadStaff()]);
  }

  async assign(t: Task, handle: string) {
    if (handle === (t.assigned_to || '')) return;
    try {
      const r = handle
        ? await this.api.post(`/api/team/tasks/${encodeURIComponent(t.id)}/assign`, { delegator: this.selected(), telegram_username: handle })
        : await this.api.post(`/api/team/tasks/${encodeURIComponent(t.id)}/unassign`, { delegator: this.selected() });
      this.toast.success(r.reply || 'Updated');
    } catch (e: any) { this.fail(e, 'Assign failed'); }
    await Promise.all([this.loadTasks(), this.loadStaff()]);
  }
}
