import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UiToastService } from 'ui/dialog';
import { Api } from '../core/api';
import { UI } from '../core/ui';

interface GroupRow {
  transport: string;
  native_id: string;
  name: string;
  kind: string; // 'off' | 'general' | 'tasks' | 'project'
  project_id?: number;
  project_path?: string;
  folder?: string; // bound folder of a tasks or project group
  tracked?: boolean; // the folder came from Track tasks, not zc project init
  listen: boolean;
  follow: boolean;
  last_call?: number; // unix seconds
  in_registry: boolean;
}
interface GroupsView { groups: GroupRow[]; errors: Record<string, string>; }
interface Contact { id: number; name: string; aliases?: string[]; phone?: string; telegram?: string; whatsapp?: string; }
interface GroupMember { id: string; name: string; username?: string; is_self?: boolean; }
interface GroupMessage { id: string; sender_name: string; text: string; kind: string; date: number; outgoing?: boolean; }

interface Project { id: number; path: string; transport: string; native_id: string; group_name?: string; follow_tasks: boolean; tracked?: boolean; }
interface Member { id: number; name: string; transport: string; platform_id: string; active: boolean; aliases?: string[]; }
interface Task { id: number; title: string; assignee?: string; status: string; created_at: string; }
interface Summary { date: string; text: string; }
interface Detail { project: Project; members: Member[]; open_tasks: Task[]; closed_tasks?: Task[]; summaries: Summary[]; }

type Option = { label: string; value: string };
type View = 'groups' | 'projects';

const PLATFORMS: Option[] = [{ label: 'Telegram', value: 'telegram' }, { label: 'WhatsApp', value: 'whatsapp' }];
const PERSONA_KEYS = 'group,group_understand,project_standup';

@Component({
  selector: 'app-groups',
  imports: [FormsModule, ...UI],
  template: `
    <div class="page-head">
      <ui-text variant="caption" class="muted">every Telegram and WhatsApp group you are in, what the agent does in each, and the folders of task and project groups</ui-text>
    </div>

    <div class="subnav">
      <ui-button [variant]="view() === 'groups' ? 'primary' : 'ghost'" size="sm" (click)="view.set('groups')">Groups</ui-button>
      <ui-button [variant]="view() === 'projects' ? 'primary' : 'ghost'" size="sm" (click)="showProjects()">Projects</ui-button>
      <span class="spacer"></span>
      <ui-button variant="ghost" size="sm" (click)="personas()">Group personas</ui-button>
    </div>

    @if (view() === 'groups') {
      @for (e of transportErrors(); track e.transport) {
        <ui-alert tone="warning" class="gap">{{ e.transport }}: {{ e.error }}</ui-alert>
      }
      <ui-card padding="md">
        <div class="toolbar">
          <ui-select [options]="platformFilters" [(ngModel)]="platformFilter"></ui-select>
          <ui-select [options]="kindFilters" [(ngModel)]="kindFilter"></ui-select>
          <ui-input class="grow" [(ngModel)]="search" placeholder="Search groups"></ui-input>
          <ui-button variant="secondary" (click)="load()">Refresh</ui-button>
          <ui-button variant="primary" (click)="openCreate()">New group</ui-button>
        </div>
        @if (loading()) { <ui-spinner></ui-spinner> } @else {
          <div class="tbl-scroll"><table class="tbl">
            <thead><tr><th>Group</th><th>Platform</th><th>Agent</th><th>Track tasks</th><th>Folder</th><th>Listen / follow</th><th>Last call</th><th style="width:1%"></th></tr></thead>
            <tbody>
              @for (g of filtered(); track g.transport + ':' + g.native_id) {
                <tr>
                  <td>
                    {{ g.name || g.native_id }}
                    <div class="muted small mono">{{ g.native_id }}</div>
                    @if (!g.in_registry) { <div class="muted small">not in the latest group list</div> }
                  </td>
                  <td><ui-chip>{{ g.transport }}</ui-chip></td>
                  <td>
                    @if (g.kind === 'project' || g.kind === 'tasks') {
                      <ui-badge [tone]="g.kind === 'project' ? 'primary' : 'warning'">{{ g.kind }}</ui-badge>
                    } @else {
                      <div class="row nowrap">
                        <ui-switch [ngModel]="g.kind === 'general'" (ngModelChange)="setPolicy(g, $event)" [disabled]="busy().has(key(g))"></ui-switch>
                        <span class="muted small">{{ g.kind === 'general' ? 'general' : 'off' }}</span>
                      </div>
                    }
                  </td>
                  <td>
                    @if (g.kind === 'project' && !g.tracked) {
                      <span class="muted small">bound repo</span>
                    } @else {
                      <ui-switch [ngModel]="!!g.tracked" (ngModelChange)="setTrack(g, $event)" [disabled]="busy().has(key(g))"></ui-switch>
                    }
                  </td>
                  <td class="mono">{{ g.folder || g.project_path || '' }}</td>
                  <td>
                    <ui-badge [tone]="g.listen ? 'success' : 'neutral'">{{ g.listen ? 'listen' : 'no listen' }}</ui-badge>
                    <ui-badge [tone]="g.follow ? 'success' : 'neutral'">{{ g.follow ? 'follow' : 'no follow' }}</ui-badge>
                  </td>
                  <td class="muted small">{{ when(g.last_call) }}</td>
                  <td><div class="row-actions nowrap">
                    @if ((g.kind === 'project' || g.kind === 'tasks') && g.project_id) {
                      <ui-button variant="secondary" size="sm" (click)="openProjectById(g.project_id)">{{ g.kind === 'tasks' ? 'Tasks' : 'Project' }}</ui-button>
                    }
                    <ui-button variant="ghost" size="sm" (click)="openMembers(g)">Members</ui-button>
                    <ui-button variant="ghost" size="sm" (click)="openMessages(g)">Messages</ui-button>
                    <ui-button variant="ghost" size="sm" (click)="openAdd(g)">Add people</ui-button>
                  </div></td>
                </tr>
              } @empty { <tr><td colspan="8" class="empty">No groups found.</td></tr> }
            </tbody>
          </table></div>
          <ui-text variant="caption" class="muted">Turning a group on makes it general: the agent answers when someone there mentions it or replies to it, with web search only. Track tasks gives the group a folder, follows its tasks and posts a standup at 09:00; once you put a git repo in that folder it becomes a project group. Groups bound with zc project init are managed from the CLI.</ui-text>
        }
      </ui-card>
    }

    @if (view() === 'projects') {
      <ui-card padding="md">
        <div class="toolbar">
          <ui-text variant="caption" class="muted grow">To bind a repo, run this inside it: <code>zc project init --group "Group name" [--wa] [--follow on]</code></ui-text>
          <ui-button variant="secondary" (click)="loadProjects()">Refresh</ui-button>
        </div>
        @if (projectsLoading()) { <ui-spinner></ui-spinner> } @else {
          <div class="tbl-scroll"><table class="tbl">
            <thead><tr><th>Folder</th><th>Group</th><th>Platform</th><th>Follow tasks</th><th style="width:1%"></th></tr></thead>
            <tbody>
              @for (p of projects(); track p.id) {
                <tr [class.sel]="detail()?.project?.id === p.id">
                  <td class="mono">{{ p.path }} @if (p.tracked) { <ui-badge tone="warning">tracked</ui-badge> }</td>
                  <td>{{ p.group_name || p.native_id }}</td>
                  <td><ui-chip>{{ p.transport }}</ui-chip></td>
                  <td><ui-badge [tone]="p.follow_tasks ? 'success' : 'neutral'">{{ p.follow_tasks ? 'on' : 'off' }}</ui-badge></td>
                  <td><ui-button variant="ghost" size="sm" (click)="openProject(p.id)">{{ detail()?.project?.id === p.id ? 'Refresh' : 'Open' }}</ui-button></td>
                </tr>
              } @empty { <tr><td colspan="5" class="empty">No projects yet.</td></tr> }
            </tbody>
          </table></div>
        }
      </ui-card>

      @if (detailLoading()) {
        <ui-card padding="md" class="gap-top"><ui-spinner></ui-spinner></ui-card>
      } @else if (detail(); as d) {
        <ui-card padding="md" class="gap-top">
          <div class="head">
            <ui-text variant="h4">{{ d.project.group_name || d.project.path }}</ui-text>
            <span class="spacer"></span>
            <ui-button variant="ghost" size="sm" (click)="detail.set(null)">Close</ui-button>
          </div>
          <ui-text variant="caption" class="muted mono">{{ d.project.path }} ({{ d.project.transport }})</ui-text>

          <div class="toolbar actions-bar">
            <div class="row nowrap">
              <ui-switch [ngModel]="d.project.follow_tasks" (ngModelChange)="setFollow(d, $event)"></ui-switch>
              <span>Follow tasks</span>
            </div>
            <ui-button variant="secondary" size="sm" [disabled]="standupBusy()" (click)="standup(d)">{{ standupBusy() ? 'Running standup...' : 'Run standup now' }}</ui-button>
            <ui-button variant="ghost" size="sm" (click)="status(d)">Status</ui-button>
            <span class="spacer"></span>
            <ui-button variant="destructive" size="sm" (click)="askUnbind()">{{ d.project.tracked ? 'Stop tracking' : 'Unbind' }}</ui-button>
          </div>

          <ui-text variant="caption" class="muted section">Members</ui-text>
          <div class="tbl-scroll"><table class="tbl">
            <thead><tr><th>Name</th><th>Aliases</th><th>Active</th><th>Add alias</th></tr></thead>
            <tbody>
              @for (m of d.members; track m.id) {
                <tr>
                  <td>{{ m.name }} <div class="muted small mono">{{ m.platform_id }}</div></td>
                  <td>
                    @for (a of m.aliases || []; track a) {
                      <ui-chip [removable]="true" (remove)="removeAlias(d, m, a)">{{ a }}</ui-chip>
                    } @empty { <span class="muted small">none</span> }
                  </td>
                  <td><ui-badge [tone]="m.active ? 'success' : 'neutral'">{{ m.active ? 'active' : 'left' }}</ui-badge></td>
                  <td>
                    <div class="row nowrap">
                      <ui-input [(ngModel)]="aliasDraft[m.name]" placeholder="alias" (keydown.enter)="addAlias(d, m)"></ui-input>
                      <ui-button variant="secondary" size="sm" (click)="addAlias(d, m)">Add</ui-button>
                    </div>
                  </td>
                </tr>
              } @empty { <tr><td colspan="4" class="empty">No members recorded yet.</td></tr> }
            </tbody>
          </table></div>

          <div class="row section">
            <ui-text variant="caption" class="muted">Tasks</ui-text>
            <span class="spacer"></span>
            <ui-select [options]="taskFilters" [ngModel]="taskFilter()" (ngModelChange)="taskFilter.set($event)"></ui-select>
          </div>
          @if (taskFilter() !== 'open' && !shownTasks().length) {
            <ui-text variant="caption" class="muted">No tasks with this status yet.</ui-text>
          }
          <div class="tbl-scroll"><table class="tbl">
            <thead><tr><th style="width:1%">ID</th><th>Title</th><th>Assignee</th><th style="width:1%"></th></tr></thead>
            <tbody>
              @for (t of shownTasks(); track t.id) {
                <tr>
                  <td class="muted">#{{ t.id }}</td>
                  <td>{{ t.title }}</td>
                  <td>{{ t.assignee || 'unassigned' }}</td>
                  <td><div class="row-actions nowrap">
                    @if (t.status === 'open') {
                      <ui-button variant="secondary" size="sm" (click)="taskAction(d, t, 'done')">Done</ui-button>
                      <ui-button variant="ghost" size="sm" (click)="taskAction(d, t, 'drop')">Drop</ui-button>
                      <ui-button variant="ghost" size="sm" (click)="openAssign(t)">Assign</ui-button>
                    } @else { <ui-badge tone="neutral">{{ t.status }}</ui-badge> }
                  </div></td>
                </tr>
              } @empty { <tr><td colspan="4" class="empty">No {{ taskFilter() }} tasks.</td></tr> }
            </tbody>
          </table></div>

          <ui-text variant="caption" class="muted section">Past summaries</ui-text>
          @for (s of d.summaries; track s.date) {
            <div class="summary">
              <ui-text variant="caption" class="muted">{{ s.date }}</ui-text>
              <div class="text">{{ s.text }}</div>
            </div>
          } @empty { <div class="muted">No summaries yet.</div> }
        </ui-card>
      }
    }

    <!-- New group -->
    <ui-modal [(open)]="createOpen" title="New group">
      <div class="stack">
        <ui-form-field label="Platform"><ui-select [options]="platforms" [(ngModel)]="createPlatform"></ui-select></ui-form-field>
        <ui-form-field label="Group name"><ui-input [(ngModel)]="createName" placeholder="name"></ui-input></ui-form-field>
        <ui-form-field label="Members">
          <div class="row">
            <ui-combobox class="grow" [options]="contactOptions()" [(ngModel)]="pickId" placeholder="Search contacts"></ui-combobox>
            <ui-button variant="secondary" size="sm" [disabled]="!pickId" (click)="pick()">Add</ui-button>
          </div>
        </ui-form-field>
        <div class="row">
          @for (c of picked(); track c.id) { <ui-chip [removable]="true" (remove)="unpick(c)">{{ c.name }}</ui-chip> }
        </div>
        <ui-text variant="caption" class="muted">You are added to the group automatically.</ui-text>
      </div>
      <div modal-footer class="row-actions">
        <ui-button variant="ghost" (click)="createOpen.set(false)">Cancel</ui-button>
        <ui-button variant="primary" [disabled]="saving() || !createName.trim() || !picked().length" (click)="create()">{{ saving() ? 'Creating...' : 'Create' }}</ui-button>
      </div>
    </ui-modal>

    <!-- Add people to a group -->
    <ui-modal [(open)]="addOpen" [title]="'Add people to ' + (target()?.name || '')">
      <div class="stack">
        <div class="row">
          <ui-combobox class="grow" [options]="contactOptions()" [(ngModel)]="pickId" placeholder="Search contacts"></ui-combobox>
          <ui-button variant="secondary" size="sm" [disabled]="!pickId" (click)="pick()">Add</ui-button>
        </div>
        <div class="row">
          @for (c of picked(); track c.id) { <ui-chip [removable]="true" (remove)="unpick(c)">{{ c.name }}</ui-chip> }
        </div>
      </div>
      <div modal-footer class="row-actions">
        <ui-button variant="ghost" (click)="addOpen.set(false)">Cancel</ui-button>
        <ui-button variant="primary" [disabled]="saving() || !picked().length" (click)="addMembers()">{{ saving() ? 'Adding...' : 'Add to group' }}</ui-button>
      </div>
    </ui-modal>

    <!-- Members -->
    <ui-modal [(open)]="membersOpen" [title]="'Members of ' + (target()?.name || '')">
      @if (sideLoading()) { <ui-spinner></ui-spinner> } @else {
        <div class="tbl-scroll"><table class="tbl">
          <thead><tr><th>Name</th><th>ID</th></tr></thead>
          <tbody>
            @for (m of members(); track m.id) {
              <tr>
                <td>{{ m.name }} @if (m.is_self) { <ui-badge tone="primary">you</ui-badge> } @if (m.username) { <div class="muted small">{{ '@' + m.username }}</div> }</td>
                <td class="mono muted">{{ m.id }}</td>
              </tr>
            } @empty { <tr><td colspan="2" class="empty">No members.</td></tr> }
          </tbody>
        </table></div>
      }
    </ui-modal>

    <!-- Messages -->
    <ui-modal [(open)]="messagesOpen" [title]="'Latest in ' + (target()?.name || '')" size="lg">
      @if (sideLoading()) { <ui-spinner></ui-spinner> } @else {
        <div class="msgs">
          @for (m of messages(); track m.id) {
            <div class="msg" [class.out]="m.outgoing">
              <div class="muted small">{{ m.outgoing ? 'You' : m.sender_name }} · {{ when(m.date) }}</div>
              <div class="text">{{ m.text || '[' + m.kind + ']' }}</div>
            </div>
          } @empty { <div class="muted">No messages.</div> }
        </div>
      }
    </ui-modal>

    <!-- Assign task -->
    <ui-modal [(open)]="assignOpen" [title]="'Assign #' + (assignTask()?.id || '')" size="sm">
      <ui-form-field label="Member"><ui-select [options]="memberOptions()" [(ngModel)]="assignMember"></ui-select></ui-form-field>
      <div modal-footer class="row-actions">
        <ui-button variant="ghost" (click)="assignOpen.set(false)">Cancel</ui-button>
        <ui-button variant="primary" [disabled]="!assignMember" (click)="assign()">Assign</ui-button>
      </div>
    </ui-modal>

    <!-- Unbind -->
    <ui-modal [(open)]="unbindOpen" title="Unbind project" size="sm">
      <div class="stack">
        @if (detail()?.project?.tracked) {
          <ui-text variant="body">Stop tracking tasks in {{ detail()?.project?.group_name }}? It goes back to general if it was general before, otherwise off. The folder {{ detail()?.project?.path }} is kept.</ui-text>
        } @else {
          <ui-text variant="body">Unbind {{ detail()?.project?.path }} from {{ detail()?.project?.group_name }}? The agent stops answering there and turns listening off.</ui-text>
        }
        <div class="row nowrap">
          <ui-switch [(ngModel)]="purge"></ui-switch>
          <span>Also delete the chat history and .zcoms file</span>
        </div>
      </div>
      <div modal-footer class="row-actions">
        <ui-button variant="ghost" (click)="unbindOpen.set(false)">Cancel</ui-button>
        <ui-button variant="destructive" [disabled]="saving()" (click)="unbind()">Unbind</ui-button>
      </div>
    </ui-modal>

    <!-- Stop tracking tasks (from the groups list) -->
    <ui-modal [(open)]="untrackOpen" title="Stop tracking tasks" size="sm" (openChange)="$event || load()">
      <div class="stack">
        <ui-text variant="body">Stop tracking tasks in {{ untrackTarget()?.name }}? The standup stops and the agent stops storing its messages. If it was a general group before, it goes back to general; otherwise it is turned off.</ui-text>
        <ui-text variant="caption" class="muted mono">{{ untrackTarget()?.folder }}</ui-text>
        <div class="row nowrap">
          <ui-switch [(ngModel)]="untrackPurge"></ui-switch>
          <span>Also delete the chat history and .zcoms file (anything else you put in the folder is kept)</span>
        </div>
      </div>
      <div modal-footer class="row-actions">
        <ui-button variant="ghost" (click)="untrackOpen.set(false)">Cancel</ui-button>
        <ui-button variant="destructive" [disabled]="saving()" (click)="untrack()">Stop tracking</ui-button>
      </div>
    </ui-modal>

    <!-- Agent reply (status) -->
    <ui-modal [(open)]="replyOpen" [title]="replyTitle()">
      <pre class="raw">{{ replyText() }}</pre>
    </ui-modal>
  `,
  styles: [`
    .subnav { display: flex; gap: var(--ui-space-2); margin-bottom: var(--ui-space-4); flex-wrap: wrap; align-items: center; }
    .grow { flex: 1; min-width: 180px; }
    .gap { display: block; margin-bottom: var(--ui-space-3); }
    .gap-top { display: block; margin-top: var(--ui-space-4); }
    .nowrap { flex-wrap: nowrap; }
    .head { display: flex; align-items: center; gap: 10px; }
    .actions-bar { margin-top: var(--ui-space-3); }
    .section { display: flex; margin: 18px 0 6px; }
    .small { font-size: var(--ui-font-size-sm); }
    .mono { font-family: var(--ui-font-mono, monospace); font-size: var(--ui-font-size-sm); word-break: break-all; }
    code { font-family: var(--ui-font-mono, monospace); word-break: break-all; }
    tr.sel td { background: var(--ui-color-surface-raised); }
    .summary { padding: 8px 0; border-top: 1px solid var(--ui-color-border); }
    .summary:first-of-type { border-top: 0; }
    .text { white-space: pre-wrap; word-break: break-word; margin-top: 2px; }
    .msgs { display: flex; flex-direction: column; gap: 10px; max-height: 65vh; overflow-y: auto; }
    .msg { padding: 8px 10px; border: 1px solid var(--ui-color-border); border-radius: var(--ui-radius); max-width: 90%; }
    .msg.out { align-self: flex-end; background: var(--ui-color-surface-raised); }
  `],
})
export class GroupsPage {
  private api = inject(Api);
  private toast = inject(UiToastService);
  private router = inject(Router);

  view = signal<View>('groups');
  platforms = PLATFORMS;
  platformFilters: Option[] = [{ label: 'All platforms', value: '' }, ...PLATFORMS];
  kindFilters: Option[] = [
    { label: 'Any kind', value: '' }, { label: 'Off', value: 'off' },
    { label: 'General', value: 'general' }, { label: 'Tasks', value: 'tasks' }, { label: 'Project', value: 'project' },
  ];
  taskFilters: Option[] = [{ label: 'Open', value: 'open' }, { label: 'Done', value: 'done' }, { label: 'Dropped', value: 'dropped' }];

  // Groups list.
  groups = signal<GroupRow[]>([]);
  errors = signal<Record<string, string>>({});
  loading = signal(true);
  busy = signal<Set<string>>(new Set());
  private platformSig = signal('');
  private kindSig = signal('');
  private searchSig = signal('');
  get platformFilter() { return this.platformSig(); }
  set platformFilter(v: string) { this.platformSig.set(v); }
  get kindFilter() { return this.kindSig(); }
  set kindFilter(v: string) { this.kindSig.set(v); }
  get search() { return this.searchSig(); }
  set search(v: string) { this.searchSig.set(v); }
  filtered = computed(() => {
    const p = this.platformSig(), k = this.kindSig(), q = this.searchSig().trim().toLowerCase();
    return this.groups().filter(g =>
      (!p || g.transport === p) && (!k || g.kind === k) &&
      (!q || (g.name || '').toLowerCase().includes(q) || g.native_id.includes(q) || (g.folder || g.project_path || '').toLowerCase().includes(q)));
  });
  transportErrors = computed(() => Object.entries(this.errors()).map(([transport, error]) => ({ transport, error })));

  // Contacts and the member picker shared by create and add.
  contacts = signal<Contact[]>([]);
  picked = signal<Contact[]>([]);
  pickId = '';
  contactOptions = computed(() => {
    const taken = new Set(this.picked().map(c => c.id));
    return this.contacts().filter(c => !taken.has(c.id))
      .map(c => ({ label: c.name + (c.aliases?.length ? ` (${c.aliases.join(', ')})` : ''), value: String(c.id) }));
  });
  saving = signal(false);

  createOpen = signal(false);
  createPlatform = 'telegram';
  createName = '';

  target = signal<GroupRow | null>(null);
  addOpen = signal(false);
  membersOpen = signal(false);
  messagesOpen = signal(false);
  sideLoading = signal(false);
  members = signal<GroupMember[]>([]);
  messages = signal<GroupMessage[]>([]);

  // Projects.
  projects = signal<Project[]>([]);
  projectsLoading = signal(false);
  private projectsLoaded = false;
  detail = signal<Detail | null>(null);
  detailLoading = signal(false);
  taskFilter = signal('open');
  shownTasks = computed(() => [...(this.detail()?.open_tasks || []), ...(this.detail()?.closed_tasks || [])].filter(t => (t.status || 'open') === this.taskFilter()));
  aliasDraft: Record<string, string> = {};
  standupBusy = signal(false);
  assignOpen = signal(false);
  assignTask = signal<Task | null>(null);
  assignMember = '';
  memberOptions = computed(() => (this.detail()?.members || []).filter(m => m.active).map(m => ({ label: m.name, value: m.name })));
  unbindOpen = signal(false);
  purge = false;
  untrackOpen = signal(false);
  untrackTarget = signal<GroupRow | null>(null);
  untrackPurge = false;
  replyOpen = signal(false);
  replyTitle = signal('');
  replyText = signal('');

  constructor() { this.load(); }

  key(g: GroupRow) { return g.transport + ':' + g.native_id; }
  when(ts?: number) { return ts ? new Date(ts * 1000).toLocaleString() : 'never'; }

  async load() {
    this.loading.set(true);
    try {
      const v: GroupsView = await this.api.get('/api/groups');
      this.groups.set(v?.groups || []);
      this.errors.set(v?.errors || {});
    } catch (e: any) { this.toast.danger(e.message, 'Load failed'); }
    finally { this.loading.set(false); }
  }

  private async loadContacts() {
    if (this.contacts().length) return;
    try { this.contacts.set((await this.api.get('/api/contacts')) || []); }
    catch (e: any) { this.toast.danger(e.message, 'Could not load contacts'); }
  }

  async setPolicy(g: GroupRow, on: boolean) {
    const k = this.key(g);
    this.busy.update(s => new Set(s).add(k));
    try {
      const res: any = await this.api.post('/api/groups/policy', { transport: g.transport, native_id: g.native_id, on });
      this.toast.success(res?.reply || (on ? 'On' : 'Off'));
      await this.load();
    } catch (e: any) { this.toast.danger(e.message, 'Change failed'); await this.load(); }
    finally { this.busy.update(s => { const n = new Set(s); n.delete(k); return n; }); }
  }

  async setTrack(g: GroupRow, on: boolean) {
    if (!on) {
      this.untrackTarget.set(g);
      this.untrackPurge = false;
      this.untrackOpen.set(true);
      return;
    }
    await this.track(g, true, false);
  }

  async untrack() {
    const g = this.untrackTarget();
    if (!g) return;
    this.saving.set(true);
    try {
      if (await this.track(g, false, this.untrackPurge)) this.untrackOpen.set(false);
    } finally { this.saving.set(false); }
  }

  private async track(g: GroupRow, on: boolean, purge: boolean): Promise<boolean> {
    const k = this.key(g);
    this.busy.update(s => new Set(s).add(k));
    try {
      const res: any = await this.api.post('/api/groups/track', { transport: g.transport, native_id: g.native_id, on, purge });
      this.toast.success(res?.reply || (on ? 'Tracking tasks' : 'Stopped tracking'));
      this.projectsLoaded = false;
      return true;
    } catch (e: any) { this.toast.danger(e.message, 'Change failed'); return false; }
    finally {
      this.busy.update(s => { const n = new Set(s); n.delete(k); return n; });
      await this.load();
    }
  }

  pick() {
    const c = this.contacts().find(x => String(x.id) === this.pickId);
    if (c) this.picked.update(list => [...list, c]);
    this.pickId = '';
  }
  unpick(c: Contact) { this.picked.update(list => list.filter(x => x.id !== c.id)); }

  async openCreate() {
    this.picked.set([]); this.pickId = ''; this.createName = '';
    this.createOpen.set(true);
    await this.loadContacts();
  }

  async create() {
    this.saving.set(true);
    try {
      const res: any = await this.api.post('/api/groups/create', {
        transport: this.createPlatform, name: this.createName, contact_ids: this.picked().map(c => c.id),
      });
      this.toast.success('Created ' + (res?.group?.name || this.createName));
      if (res?.warning) this.toast.warning(res.warning, 'Created, with a problem');
      this.createOpen.set(false);
      await this.load();
    } catch (e: any) { this.toast.danger(e.message, 'Create failed'); }
    finally { this.saving.set(false); }
  }

  async openAdd(g: GroupRow) {
    this.target.set(g); this.picked.set([]); this.pickId = '';
    this.addOpen.set(true);
    await this.loadContacts();
  }

  async addMembers() {
    const g = this.target();
    if (!g) return;
    this.saving.set(true);
    try {
      await this.api.post('/api/groups/members', { transport: g.transport, native_id: g.native_id, contact_ids: this.picked().map(c => c.id) });
      this.toast.success('Added to ' + (g.name || g.native_id));
      this.addOpen.set(false);
    } catch (e: any) { this.toast.danger(e.message, 'Add failed'); }
    finally { this.saving.set(false); }
  }

  private q(g: GroupRow) { return '?transport=' + encodeURIComponent(g.transport) + '&id=' + encodeURIComponent(g.native_id); }

  async openMembers(g: GroupRow) {
    this.target.set(g); this.members.set([]); this.membersOpen.set(true); this.sideLoading.set(true);
    try { this.members.set((await this.api.get('/api/groups/members' + this.q(g))) || []); }
    catch (e: any) { this.toast.danger(e.message, 'Could not list members'); }
    finally { this.sideLoading.set(false); }
  }

  async openMessages(g: GroupRow) {
    this.target.set(g); this.messages.set([]); this.messagesOpen.set(true); this.sideLoading.set(true);
    try { this.messages.set((await this.api.get('/api/groups/messages' + this.q(g))) || []); }
    catch (e: any) { this.toast.danger(e.message, 'Could not read messages'); }
    finally { this.sideLoading.set(false); }
  }

  personas() { this.router.navigate(['personas'], { queryParams: { keys: PERSONA_KEYS } }); }

  // --- Projects ---

  showProjects() {
    this.view.set('projects');
    if (!this.projectsLoaded) this.loadProjects();
  }

  async loadProjects() {
    this.projectsLoading.set(true);
    try { this.projects.set((await this.api.get('/api/projects')) || []); this.projectsLoaded = true; }
    catch (e: any) { this.toast.danger(e.message, 'Load failed'); }
    finally { this.projectsLoading.set(false); }
  }

  async openProjectById(id: number) {
    this.showProjects();
    await this.openProject(id);
  }

  async openProject(id: number) {
    this.detailLoading.set(true);
    try { this.detail.set(await this.api.get('/api/projects/' + id)); }
    catch (e: any) { this.toast.danger(e.message, 'Load failed'); }
    finally { this.detailLoading.set(false); }
  }

  private async refreshDetail(d: Detail) {
    try { this.detail.set(await this.api.get('/api/projects/' + d.project.id)); }
    catch (e: any) { this.toast.danger(e.message, 'Reload failed'); }
  }

  private async run(path: string, body: unknown, title: string): Promise<boolean> {
    try {
      const res: any = await this.api.post(path, body);
      this.toast.success(res?.reply || 'Done', title);
      return true;
    } catch (e: any) { this.toast.danger(e.message, title + ' failed'); return false; }
  }

  async addAlias(d: Detail, m: Member) {
    const alias = (this.aliasDraft[m.name] || '').trim();
    if (!alias) return;
    if (await this.run(`/api/projects/${d.project.id}/alias`, { op: 'add', member: m.name, alias }, 'Alias')) {
      this.aliasDraft[m.name] = '';
      await this.refreshDetail(d);
    }
  }

  async removeAlias(d: Detail, m: Member, alias: string) {
    if (await this.run(`/api/projects/${d.project.id}/alias`, { op: 'rm', member: m.name, alias }, 'Alias')) await this.refreshDetail(d);
  }

  async taskAction(d: Detail, t: Task, action: 'done' | 'drop') {
    if (await this.run(`/api/projects/${d.project.id}/tasks/${t.id}/${action}`, {}, 'Task #' + t.id)) await this.refreshDetail(d);
  }

  openAssign(t: Task) {
    this.assignTask.set(t);
    this.assignMember = t.assignee || '';
    this.assignOpen.set(true);
  }

  async assign() {
    const d = this.detail(), t = this.assignTask();
    if (!d || !t || !this.assignMember) return;
    if (await this.run(`/api/projects/${d.project.id}/tasks/${t.id}/assign`, { member: this.assignMember }, 'Task #' + t.id)) {
      this.assignOpen.set(false);
      await this.refreshDetail(d);
    }
  }

  async setFollow(d: Detail, on: boolean) {
    await this.run(`/api/projects/${d.project.id}/follow`, { on }, 'Follow tasks');
    await Promise.all([this.refreshDetail(d), this.loadProjects()]);
  }

  async standup(d: Detail) {
    this.standupBusy.set(true);
    try { if (await this.run(`/api/projects/${d.project.id}/standup`, {}, 'Standup')) await this.refreshDetail(d); }
    finally { this.standupBusy.set(false); }
  }

  async status(d: Detail) {
    try {
      const res: any = await this.api.get(`/api/projects/${d.project.id}/status`);
      this.replyTitle.set('Status of ' + (d.project.group_name || d.project.path));
      this.replyText.set(res?.reply || '');
      this.replyOpen.set(true);
    } catch (e: any) { this.toast.danger(e.message, 'Status failed'); }
  }

  askUnbind() { this.purge = false; this.unbindOpen.set(true); }

  async unbind() {
    const d = this.detail();
    if (!d) return;
    this.saving.set(true);
    try {
      if (await this.run(`/api/projects/${d.project.id}/remove`, { purge: this.purge }, 'Unbind')) {
        this.unbindOpen.set(false);
        this.detail.set(null);
        await Promise.all([this.loadProjects(), this.load()]);
      }
    } finally { this.saving.set(false); }
  }
}
