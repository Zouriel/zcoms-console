import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UiTab, UiTabs } from 'ui/tabs';
import { UiToastService } from 'ui/dialog';
import { Delegator, Run, Staff, Standup, Task, TeamApi } from '../core/team-api';
import { TeamLive } from '../core/team-live';
import { UI } from '../core/ui';

// One project. Its own tasks, standups, staff and settings — everything scoped to
// the delegator named in the route. Every panel refetches when the live stream
// reports a change, so an edit made here, from another tab, from Telegram or from
// the CLI all show up without a manual refresh.

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

function statusTone(s: string): 'success' | 'warning' | 'danger' | 'neutral' {
  if (s === 'done') return 'success';
  if (s === 'blocked') return 'danger';
  if (s === 'review' || s === 'assigned') return 'warning';
  return 'neutral';
}

@Component({
  selector: 'app-team-project',
  imports: [FormsModule, UiTabs, UiTab, ...UI],
  template: `
    @if (missing()) {
      <ui-alert tone="warning">
        <ui-text variant="body">No project named "{{ name() }}".</ui-text>
      </ui-alert>
    } @else {
    <ui-tabs [(selectedIndex)]="tab" label="Project sections">

      <!-- Tasks -->
      <ui-tab label="Tasks">
        <ui-card padding="md">
          <div class="grid">
            <ui-form-field label="New task">
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
                  <td class="title" [title]="t.title">{{ t.title }}</td>
                  <td><ui-chip>{{ t.priority }}</ui-chip></td>
                  <td><ui-select [options]="statuses" [ngModel]="t.status" (ngModelChange)="setStatus(t, $event)"></ui-select></td>
                  <td><ui-select [options]="assigneeOptions()" [ngModel]="t.assigned_to || ''" (ngModelChange)="assign(t, $event)"></ui-select></td>
                  <td><ui-badge [tone]="tone(t.status)">{{ t.status }}</ui-badge></td>
                </tr>
              } @empty { <tr><td colspan="5" class="empty">No tasks in this project.</td></tr> }
            </tbody>
          </table></div>
        </ui-card>
      </ui-tab>

      <!-- Standups -->
      <ui-tab label="Standups">
        <ui-card padding="md">
          <ui-text variant="caption" class="muted">
            Pausing a standup keeps every past run. Schedule changes take effect within 30 seconds, no restart.
          </ui-text>
          <div class="grid">
            <ui-form-field label="Name">
              <ui-input [(ngModel)]="newSu.name" placeholder="daily"></ui-input>
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
            <ui-button variant="primary" (click)="addStandup()">Add standup</ui-button>
          </div>

          <div class="tbl-scroll"><table class="tbl">
            <thead><tr><th>Name</th><th>Group</th><th>Schedule</th><th>Next run</th><th>Enabled</th><th style="width:1%"></th></tr></thead>
            <tbody>
              @for (su of standups(); track su.id) {
                <tr>
                  <td>{{ su.name }}</td>
                  <td class="muted">{{ su.telegram_group }}</td>
                  <td>{{ su.schedule_time }} <span class="muted">({{ su.timezone }})</span></td>
                  <td class="muted">{{ su.next_run ? fmt(su.next_run) : 'paused' }}</td>
                  <td><ui-switch [ngModel]="su.enabled" (ngModelChange)="toggleStandup(su, $event)"></ui-switch></td>
                  <td class="actions">
                    <ui-button variant="ghost" size="sm" (click)="openEdit(su)">Edit</ui-button>
                    <ui-button variant="ghost" size="sm" (click)="loadRuns(su)">Runs</ui-button>
                  </td>
                </tr>
              } @empty { <tr><td colspan="6" class="empty">No standups in this project.</td></tr> }
            </tbody>
          </table></div>
        </ui-card>
      </ui-tab>

      <!-- Staff -->
      <ui-tab label="Staff">
        <ui-card padding="md">
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
            <thead><tr><th>Telegram</th><th>GitHub</th><th>Role</th><th>Limit</th><th>Load</th><th style="width:1%"></th></tr></thead>
            <tbody>
              @for (st of staff(); track st.id) {
                <tr>
                  <td>{{ st.telegram_username }}</td>
                  <td class="muted">{{ st.github_username || '—' }}</td>
                  <td><ui-select [options]="roles" [ngModel]="st.role" (ngModelChange)="setRole(st, $event)"></ui-select></td>
                  <td><ui-input inputmode="numeric" [ngModel]="st.max_active_tasks" (ngModelChange)="setLimit(st, $event)"></ui-input></td>
                  <td class="muted">{{ st.active_tasks }} active</td>
                  <td class="actions">
                    <ui-button variant="destructive" size="sm" (click)="removeStaff(st)">Remove</ui-button>
                  </td>
                </tr>
              } @empty { <tr><td colspan="6" class="empty">No staff in this project yet.</td></tr> }
            </tbody>
          </table></div>
        </ui-card>
      </ui-tab>

      <!-- Settings -->
      <ui-tab label="Settings">
        <ui-card padding="md">
          <ui-text variant="h4">GitHub board</ui-text>
          <ui-text variant="caption" class="muted">
            Link this project to a GitHub Projects v2 board, or clear the owner to make it local-only.
            Changing the board drops the resolved project id so the next sync re-resolves it.
          </ui-text>
          <div class="grid">
            <ui-form-field label="GitHub owner">
              <ui-input [(ngModel)]="settings.owner" placeholder="Zouriel"></ui-input>
            </ui-form-field>
            <ui-form-field label="Project #">
              <ui-input inputmode="numeric" [(ngModel)]="settings.project"></ui-input>
            </ui-form-field>
          </div>
          <div class="row">
            <span class="spacer"></span>
            <ui-button variant="primary" (click)="saveSettings()">Save</ui-button>
          </div>
        </ui-card>

        <div style="height:16px"></div>

        <ui-card padding="md">
          <ui-text variant="h4">Danger zone</ui-text>
          <ui-text variant="caption" class="muted">
            Deleting a project hides it and everything scoped to it. The rows stay in the database.
          </ui-text>
          <div class="row">
            <span class="spacer"></span>
            <ui-button variant="destructive" (click)="confirmDelete.set(true)">Delete project</ui-button>
          </div>
        </ui-card>
      </ui-tab>

    </ui-tabs>
    }

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

    <ui-modal [(open)]="runsOpen" title="Standup runs">
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
    </ui-modal>

    <ui-modal [(open)]="confirmDelete" title="Delete project">
      <ui-text variant="body">Delete "{{ name() }}"? Its standups, staff and tasks go with it.</ui-text>
      <div class="row">
        <span class="spacer"></span>
        <ui-button variant="ghost" (click)="confirmDelete.set(false)">Cancel</ui-button>
        <ui-button variant="destructive" (click)="deleteProject()">Delete</ui-button>
      </div>
    </ui-modal>
  `,
  styles: [`
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; margin-top: 8px; }
    .row { display: flex; align-items: center; gap: 10px; margin: 12px 0; }
    .spacer { flex: 1; }
    .actions { display: flex; gap: 6px; align-items: center; }
    .title { max-width: 380px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .run { padding: 10px 0; border-bottom: 1px solid var(--ui-color-border, rgba(127,127,127,0.2)); }
    .report { white-space: pre-wrap; font-size: 12px; margin: 6px 0 0; overflow-x: auto; }
    .err { color: var(--ui-color-danger, #c33); }
  `],
})
export class TeamProjectPage {
  private api = inject(TeamApi);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toast = inject(UiToastService);
  private live = inject(TeamLive);

  name = signal('');
  missing = signal(false);
  tab = signal(0);

  delegator = signal<Delegator | null>(null);
  standups = signal<Standup[]>([]);
  staff = signal<Staff[]>([]);
  tasks = signal<Task[]>([]);
  runs = signal<Run[]>([]);

  roles = ROLES;
  priorities = PRIORITIES;
  statuses = STATUSES;
  editFields = [
    { label: 'Time (HH:MM)', value: 'time' },
    { label: 'Timezone', value: 'timezone' },
    { label: 'Telegram group', value: 'group' },
  ];

  newTask = { title: '', priority: 'high' };
  newSu = { name: '', telegram_group: '', schedule_time: '09:00', timezone: 'Indian/Maldives' };
  newStaff = { telegram_username: '', github_username: '', role: 'staff', max_active_tasks: 5 };
  settings = { owner: '', project: 0 };

  editOpen = signal(false);
  editing = signal<Standup | null>(null);
  editField = signal('time');
  editValue = signal('');
  runsOpen = signal(false);
  runsFor = signal('');
  confirmDelete = signal(false);

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

  constructor() {
    this.route.paramMap.subscribe((p) => {
      this.name.set(p.get('project') || '');
      this.tab.set(0);
      void this.load();
    });
    // Refetch on any change the module reports, from wherever it originated.
    effect(() => {
      this.live.version();
      void this.load();
    });
  }

  fmt(s: string) { return s ? new Date(s).toLocaleString() : ''; }
  tone(s: string) { return statusTone(s); }
  private fail(e: any, what: string) {
    if (this.live.running()) this.toast.danger(e?.message || String(e), what);
  }

  private async load() {
    const n = this.name();
    if (!n) return;
    try {
      const [dels, sus, staff, tasks] = await Promise.all([
        this.api.delegators(), this.api.standups(n), this.api.staff(n), this.api.tasks(n),
      ]);
      const d = (dels || []).find((x) => x.name === n) || null;
      this.missing.set(!d);
      this.delegator.set(d);
      if (d) {
        // Only refill the settings form when it isn't being edited, so a live
        // refresh can't overwrite half-typed input.
        if (document.activeElement?.tagName !== 'INPUT') {
          this.settings = { owner: d.github_owner === 'local' ? '' : (d.github_owner || ''), project: d.github_project_number || 0 };
        }
      }
      this.standups.set(sus || []);
      this.staff.set(staff || []);
      this.tasks.set(tasks || []);
    } catch (e: any) { this.fail(e, 'Load failed'); }
  }

  // --- tasks ---

  async addTask() {
    if (!this.newTask.title.trim()) { this.toast.danger('A task needs a title'); return; }
    try {
      const r = await this.api.addTask(this.name(), this.newTask.priority, this.newTask.title.trim());
      this.toast.success(r.reply || 'Added');
      this.newTask = { title: '', priority: 'high' };
      await this.load();
    } catch (e: any) { this.fail(e, 'Add failed'); }
  }

  async setStatus(t: Task, status: string) {
    if (status === t.status) return;
    try {
      const r = await this.api.setTaskStatus(this.name(), t.id, status);
      this.toast.success(r.reply || 'Updated');
    } catch (e: any) { this.fail(e, 'Update failed'); }
    await this.load();
  }

  async assign(t: Task, handle: string) {
    if (handle === (t.assigned_to || '')) return;
    try {
      const r = handle
        ? await this.api.assignTask(this.name(), t.id, handle)
        : await this.api.unassignTask(this.name(), t.id);
      this.toast.success(r.reply || 'Updated');
    } catch (e: any) { this.fail(e, 'Assign failed'); }
    await this.load();
  }

  // --- standups ---

  async addStandup() {
    const s = this.newSu;
    if (!s.name.trim() || !s.telegram_group.trim()) {
      this.toast.danger('Name and Telegram group are required');
      return;
    }
    try {
      const r = await this.api.createStandup({
        name: s.name.trim(), delegator: this.name(), telegram_group: s.telegram_group.trim(),
        schedule_time: s.schedule_time.trim(), timezone: s.timezone.trim(),
      });
      this.toast.success(r.reply || 'Created');
      this.newSu = { ...s, name: '', telegram_group: '' };
      await this.load();
    } catch (e: any) { this.fail(e, 'Create failed'); }
  }

  async toggleStandup(su: Standup, on: boolean) {
    try {
      const r = await this.api.toggleStandup(su.name, on);
      this.toast.success(r.reply || (on ? 'Enabled' : 'Paused'));
    } catch (e: any) { this.fail(e, 'Update failed'); }
    await this.load();
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
      const r = await this.api.editStandup(su.name, this.editField(), value);
      this.toast.success(r.reply || 'Saved');
      this.editOpen.set(false);
      await this.load();
    } catch (e: any) { this.fail(e, 'Save failed'); }
  }

  async loadRuns(su: Standup) {
    this.runsFor.set(su.name);
    this.runs.set([]);
    this.runsOpen.set(true);
    try { this.runs.set((await this.api.runs(su.name, 10)) || []); }
    catch (e: any) { this.fail(e, 'Runs failed'); }
  }

  // --- staff ---

  async addStaff() {
    const s = this.newStaff;
    if (!s.telegram_username.trim()) { this.toast.danger('A Telegram handle is required'); return; }
    try {
      const r = await this.api.addStaff({
        delegator: this.name(), telegram_username: s.telegram_username.trim(),
        github_username: s.github_username.trim(), role: s.role,
        max_active_tasks: Number(s.max_active_tasks) || 0,
      });
      this.toast.success(r.reply || 'Added');
      this.newStaff = { telegram_username: '', github_username: '', role: 'staff', max_active_tasks: 5 };
      await this.load();
    } catch (e: any) { this.fail(e, 'Add failed'); }
  }

  async setRole(st: Staff, role: string) {
    if (role === st.role) return;
    try { await this.api.setStaffRole(this.name(), st.telegram_username, role); this.toast.success(`${st.telegram_username} is now ${role}`); }
    catch (e: any) { this.fail(e, 'Update failed'); }
    await this.load();
  }

  async setLimit(st: Staff, raw: string | number) {
    const n = Number(raw);
    if (!Number.isFinite(n) || n < 0 || n === st.max_active_tasks) return;
    try { await this.api.setStaffLimit(this.name(), st.telegram_username, n); this.toast.success('Limit updated'); }
    catch (e: any) { this.fail(e, 'Update failed'); }
    await this.load();
  }

  async removeStaff(st: Staff) {
    try { const r = await this.api.removeStaff(this.name(), st.telegram_username); this.toast.success(r.reply || 'Removed'); }
    catch (e: any) { this.fail(e, 'Remove failed'); }
    await this.load();
  }

  // --- settings ---

  async saveSettings() {
    try {
      const r = await this.api.updateDelegator(this.name(), this.settings.owner.trim(), Number(this.settings.project) || 0);
      this.toast.success(r.reply || 'Saved');
      await this.load();
    } catch (e: any) { this.fail(e, 'Save failed'); }
  }

  async deleteProject() {
    try {
      const r = await this.api.deleteDelegator(this.name());
      this.toast.success(r.reply || 'Deleted');
      this.confirmDelete.set(false);
      this.router.navigate(['team']);
    } catch (e: any) { this.fail(e, 'Delete failed'); }
  }
}
