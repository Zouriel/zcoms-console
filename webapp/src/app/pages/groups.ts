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
interface GroupMember { id: string; name: string; username?: string; is_self?: boolean; is_owner?: boolean; role?: string; }
interface GroupMessage { id: string; sender_name: string; text: string; kind: string; date: number; outgoing?: boolean; }
interface Workspace { id: number; path: string; name: string; present: boolean; ignored: boolean; }

interface Project { id: number; path: string; transport: string; native_id: string; group_name?: string; follow_tasks: boolean; tracked?: boolean; }
interface Member { id: number; name: string; transport: string; platform_id: string; active: boolean; aliases?: string[]; }
interface Task { id: number; title: string; assignee?: string; status: string; created_at: string; }
interface Summary { date: string; text: string; }
interface Detail { project: Project; members: Member[]; open_tasks: Task[]; closed_tasks?: Task[]; summaries: Summary[]; }

type Option = { label: string; value: string };
type Section = 'settings' | 'members' | 'tasks' | 'messages';

const PLATFORMS: Option[] = [{ label: 'Telegram', value: 'telegram' }, { label: 'WhatsApp', value: 'whatsapp' }];
const PERSONA_KEYS = 'group,group_understand,project_standup';

@Component({
  selector: 'app-groups',
  imports: [FormsModule, ...UI],
  template: `
    <div class="page-head">
      <ui-text variant="caption" class="muted">every Telegram and WhatsApp group you are in; open one to change what the agent does there</ui-text>
      <span class="spacer"></span>
      <ui-button variant="ghost" size="sm" (click)="personas()">Group personas</ui-button>
    </div>

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
        <div class="tbl-scroll"><table class="tbl groups">
          <thead><tr><th>Group</th><th>Platform</th><th>Kind</th><th>Agent</th><th class="wide">Last call</th></tr></thead>
          <tbody>
            @for (g of filtered(); track key(g)) {
              <tr class="click" tabindex="0" (click)="open(g)" (keydown.enter)="open(g)">
                <td>
                  {{ g.name || g.native_id }}
                  @if (!g.in_registry) { <div class="muted small">not in the latest group list</div> }
                </td>
                <td><ui-chip>{{ g.transport }}</ui-chip></td>
                <td><ui-badge [tone]="kindTone(g.kind)">{{ g.kind }}</ui-badge></td>
                <td><ui-badge [tone]="g.kind === 'off' ? 'neutral' : 'success'">{{ g.kind === 'off' ? 'off' : 'on' }}</ui-badge></td>
                <td class="muted small wide">{{ when(g.last_call) }}</td>
              </tr>
            } @empty { <tr><td colspan="5" class="empty">No groups found.</td></tr> }
          </tbody>
        </table></div>
        <ui-text variant="caption" class="muted">Tap a group to see and change everything about it.</ui-text>
      }
    </ui-card>

    <!-- Group: every setting and action -->
    <ui-modal [open]="detailOpen()" (openChange)="closeDetail($event)" [title]="sel()?.name || sel()?.native_id || ''" size="lg">
      @if (sel(); as g) {
        <div class="meta row">
          <ui-chip>{{ g.transport }}</ui-chip>
          <ui-badge [tone]="kindTone(g.kind)">{{ g.kind }}</ui-badge>
          <ui-badge [tone]="g.listen ? 'success' : 'neutral'">{{ g.listen ? 'listen' : 'no listen' }}</ui-badge>
          <ui-badge [tone]="g.follow ? 'success' : 'neutral'">{{ g.follow ? 'follow' : 'no follow' }}</ui-badge>
          <span class="muted small">last call: {{ when(g.last_call) }}</span>
        </div>
        <div class="muted small mono">{{ g.native_id }}</div>
        @if (!g.in_registry) { <ui-alert tone="warning" class="gap-top">This group was not in the latest group list (its transport is down, or the account left it).</ui-alert> }

        <div class="subnav gap-top">
          <ui-button [variant]="section() === 'settings' ? 'primary' : 'ghost'" size="sm" (click)="section.set('settings')">Settings</ui-button>
          <ui-button [variant]="section() === 'members' ? 'primary' : 'ghost'" size="sm" (click)="showMembers()">Members</ui-button>
          @if (g.project_id) {
            <ui-button [variant]="section() === 'tasks' ? 'primary' : 'ghost'" size="sm" (click)="section.set('tasks')">Tasks</ui-button>
          }
          <ui-button [variant]="section() === 'messages' ? 'primary' : 'ghost'" size="sm" (click)="showMessages()">Messages</ui-button>
        </div>

        @switch (section()) {
          @case ('settings') {
            <div class="stack">
              <div class="setting">
                <div class="row nowrap">
                  @if (g.kind === 'project' || g.kind === 'tasks') {
                    <ui-switch [ngModel]="true" [disabled]="true"></ui-switch>
                  } @else {
                    <ui-switch [ngModel]="g.kind === 'general'" (ngModelChange)="setPolicy(g, $event)" [disabled]="busy()"></ui-switch>
                  }
                  <b>Agent on</b>
                </div>
                <ui-text variant="caption" class="muted">
                  @if (g.kind === 'project' || g.kind === 'tasks') { On while the group has a folder; unbind it below to change this. }
                  @else { On makes it general: the agent answers when someone mentions it or replies to it, with web search only. }
                </ui-text>
              </div>

              <div class="setting">
                @if (g.kind === 'project') {
                  <b>Track tasks</b>
                  <ui-text variant="caption" class="muted">This folder holds a repo, so the group stays a project group. Use Follow tasks below to turn the standup and task tracking on or off.</ui-text>
                } @else {
                  <div class="row nowrap">
                    <ui-switch [ngModel]="!!g.tracked" (ngModelChange)="setTrack(g, $event)" [disabled]="busy()"></ui-switch>
                    <b>Track tasks</b>
                  </div>
                  <ui-text variant="caption" class="muted">Gives the group a folder under groups_dir, follows its tasks and posts a standup at 09:00. Put a repo in that folder and it becomes a project group.</ui-text>
                }
                @if (untrackAsk()) {
                  <div class="confirm stack">
                    <ui-text variant="body">Stop tracking tasks? The standup stops and the agent stops storing messages. A group that was general goes back to general; otherwise it is turned off.</ui-text>
                    <div class="row nowrap">
                      <ui-switch [(ngModel)]="untrackPurge"></ui-switch>
                      <span>Also delete the chat history and .zcoms file (anything else in the folder is kept)</span>
                    </div>
                    <div class="row-actions">
                      <ui-button variant="ghost" size="sm" (click)="untrackAsk.set(false)">Cancel</ui-button>
                      <ui-button variant="destructive" size="sm" [disabled]="busy()" (click)="untrack(g)">Stop tracking</ui-button>
                    </div>
                  </div>
                }
              </div>

              @if (detail(); as d) {
                <div class="setting">
                  <div class="row nowrap">
                    <ui-switch [ngModel]="d.project.follow_tasks" (ngModelChange)="setFollow(d, $event)" [disabled]="busy()"></ui-switch>
                    <b>Follow tasks</b>
                  </div>
                  <ui-text variant="caption" class="muted">Reads the day's messages for tasks and posts the standup at 09:00.</ui-text>
                  <div class="row-actions gap-top">
                    <ui-button variant="secondary" size="sm" [disabled]="standupBusy() || !d.project.follow_tasks" (click)="standup(d)">{{ standupBusy() ? 'Running standup...' : 'Run standup now' }}</ui-button>
                    <ui-button variant="ghost" size="sm" (click)="status(d)">Status</ui-button>
                  </div>
                  @if (statusText()) { <pre class="raw gap-top">{{ statusText() }}</pre> }
                </div>
              }

              <div class="setting">
                <b>Folder</b>
                <div class="mono">{{ g.folder || 'none' }}</div>
                <ui-form-field [label]="g.folder ? 'Move to' : 'Folder path'" [hint]="g.folder ? 'moves .zcoms and .zcoms.d there and repoints the group; anything else stays' : 'binds the group there like zc project init (follow tasks stays off)'">
                  <ui-input class="f" [(ngModel)]="dirPath" placeholder="/home/you/projects/name or ~/name"></ui-input>
                </ui-form-field>
                @if (picks().length) {
                  <div class="row picks">
                    <span class="muted small">Workspaces:</span>
                    @for (w of picks(); track w.id) { <ui-button variant="ghost" size="sm" (click)="dirPath = w.path" [title]="w.path">{{ w.name || w.path }}</ui-button> }
                  </div>
                }
                <div class="row nowrap">
                  <ui-switch [(ngModel)]="dirCreate"></ui-switch>
                  <span>Create the folder if it does not exist</span>
                </div>
                <div class="row-actions">
                  <ui-button variant="primary" size="sm" [disabled]="busy() || !dirPath.trim() || dirPath.trim() === g.folder" (click)="setDir(g)">{{ busy() ? 'Working...' : (g.folder ? 'Change folder' : 'Add folder') }}</ui-button>
                </div>
                <ui-text variant="caption" class="muted">The folder must not hold a .zcoms or .zcoms.d already, must not overlap another group's folder, and cannot be inside ~/.config/zcoms. With a git repo inside it the group becomes a project group.</ui-text>
              </div>

              <div class="row-actions">
                <ui-button variant="ghost" size="sm" (click)="personas()">Group personas</ui-button>
                @if (g.project_id && !g.tracked) {
                  <span class="spacer"></span>
                  <ui-button variant="destructive" size="sm" (click)="unbindAsk.set(true)">Unbind folder</ui-button>
                }
              </div>
              @if (unbindAsk()) {
                <div class="confirm stack">
                  <ui-text variant="body">Unbind {{ g.folder }} from {{ g.name }}? A group that was general before goes back to general; otherwise the agent stops answering there.</ui-text>
                  <div class="row nowrap">
                    <ui-switch [(ngModel)]="purge"></ui-switch>
                    <span>Also delete the chat history and .zcoms file</span>
                  </div>
                  <div class="row-actions">
                    <ui-button variant="ghost" size="sm" (click)="unbindAsk.set(false)">Cancel</ui-button>
                    <ui-button variant="destructive" size="sm" [disabled]="busy()" (click)="unbind(g)">Unbind</ui-button>
                  </div>
                </div>
              }
            </div>
          }

          @case ('members') {
            @if (sideLoading()) { <ui-spinner></ui-spinner> } @else {
              <div class="tbl-scroll"><table class="tbl">
                <thead><tr><th>Name</th><th>Role</th>@if (detail()) { <th>Aliases</th> }</tr></thead>
                <tbody>
                  @for (m of members(); track m.id) {
                    <tr>
                      <td>
                        {{ m.name }} @if (m.is_self) { <ui-badge tone="primary">agent</ui-badge> } @if (m.is_owner) { <ui-badge tone="success">owner</ui-badge> }
                        <div class="muted small mono">{{ m.username ? '@' + m.username : m.id }}</div>
                      </td>
                      <td>
                        @if (m.is_self) { <span class="muted small">n/a</span> }
                        @else if (m.is_owner) { <span class="muted small">write (always)</span> }
                        @else if (m.role) { <ui-select [options]="roleOptions" [ngModel]="m.role" (ngModelChange)="setRole(m, $event)" [disabled]="roleBusy().has(m.id)"></ui-select> }
                        @else { <span class="muted small">unknown (agent offline)</span> }
                      </td>
                      @if (detail(); as d) {
                        <td>
                          @if (projectMember(m.id); as pm) {
                            <div class="row">
                              @for (a of pm.aliases || []; track a) { <ui-chip [removable]="true" (remove)="removeAlias(d, pm, a)">{{ a }}</ui-chip> }
                            </div>
                            <div class="row nowrap">
                              <ui-input [(ngModel)]="aliasDraft[pm.name]" placeholder="alias" (keydown.enter)="addAlias(d, pm)"></ui-input>
                              <ui-button variant="secondary" size="sm" (click)="addAlias(d, pm)">Add</ui-button>
                            </div>
                          } @else if (!m.is_self) { <span class="muted small">not recorded yet</span> }
                        </td>
                      }
                    </tr>
                  } @empty { <tr><td colspan="3" class="empty">No members.</td></tr> }
                </tbody>
              </table></div>
              <ui-text variant="caption" class="muted">Everyone can ask the agent to read and look things up. Write lets a member have it edit files, only in groups whose folder holds a repo and only when the workspace max_role is edit or full. You are always write.</ui-text>

              <div class="setting gap-top">
                <b>Add people</b>
                <div class="row">
                  <ui-combobox class="grow" [options]="contactOptions()" [(ngModel)]="pickId" placeholder="Search contacts"></ui-combobox>
                  <ui-button variant="secondary" size="sm" [disabled]="!pickId" (click)="pick()">Pick</ui-button>
                </div>
                <div class="row">
                  @for (c of picked(); track c.id) { <ui-chip [removable]="true" (remove)="unpick(c)">{{ c.name }}</ui-chip> }
                </div>
                <div class="row-actions">
                  <ui-button variant="primary" size="sm" [disabled]="saving() || !picked().length" (click)="addMembers(g)">{{ saving() ? 'Adding...' : 'Add to group' }}</ui-button>
                </div>
              </div>
            }
          }

          @case ('tasks') {
            @if (detailLoading()) { <ui-spinner></ui-spinner> } @else if (detail(); as d) {
              <div class="row">
                <ui-text variant="caption" class="muted">Tasks</ui-text>
                <span class="spacer"></span>
                <ui-select [options]="taskFilters" [ngModel]="taskFilter()" (ngModelChange)="taskFilter.set($event)"></ui-select>
              </div>
              <div class="tbl-scroll"><table class="tbl">
                <thead><tr><th style="width:1%">ID</th><th>Title</th><th>Assignee</th><th style="width:1%"></th></tr></thead>
                <tbody>
                  @for (t of shownTasks(); track t.id) {
                    <tr>
                      <td class="muted">#{{ t.id }}</td>
                      <td>{{ t.title }}</td>
                      <td>
                        @if (t.status === 'open') {
                          <ui-select [options]="memberOptions()" [ngModel]="t.assignee || ''" (ngModelChange)="assign(d, t, $event)" placeholder="unassigned"></ui-select>
                        } @else { {{ t.assignee || 'unassigned' }} }
                      </td>
                      <td><div class="row-actions nowrap">
                        @if (t.status === 'open') {
                          <ui-button variant="secondary" size="sm" (click)="taskAction(d, t, 'done')">Done</ui-button>
                          <ui-button variant="ghost" size="sm" (click)="taskAction(d, t, 'drop')">Drop</ui-button>
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
            }
          }

          @case ('messages') {
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
          }
        }
      }
      <div modal-footer class="row-actions">
        <ui-button variant="ghost" (click)="closeDetail(false)">Close</ui-button>
      </div>
    </ui-modal>

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
  `,
  styles: [`
    .subnav { display: flex; gap: var(--ui-space-2); margin-bottom: var(--ui-space-3); flex-wrap: wrap; align-items: center; }
    .grow { flex: 1; min-width: 160px; }
    .gap { display: block; margin-bottom: var(--ui-space-3); }
    .gap-top { display: block; margin-top: var(--ui-space-3); }
    .nowrap { flex-wrap: nowrap; }
    .meta { margin-bottom: 4px; }
    .section { display: block; margin: 18px 0 6px; }
    .small { font-size: var(--ui-font-size-sm); }
    .mono { font-family: var(--ui-font-mono, monospace); font-size: var(--ui-font-size-sm); word-break: break-all; }
    .setting { display: flex; flex-direction: column; gap: 6px; padding: 10px 0; border-top: 1px solid var(--ui-color-border); }
    .setting:first-child { border-top: 0; padding-top: 0; }
    .confirm { padding: 10px; border: 1px solid var(--ui-color-border); border-radius: var(--ui-radius); }
    .picks { gap: 4px; }
    ui-input.f { display: block; width: 100%; }
    tr.click { cursor: pointer; }
    tr.click:focus-visible td { background: var(--ui-color-surface-raised); outline: none; }
    .summary { padding: 8px 0; border-top: 1px solid var(--ui-color-border); }
    .summary:first-of-type { border-top: 0; }
    .text { white-space: pre-wrap; word-break: break-word; margin-top: 2px; }
    .msgs { display: flex; flex-direction: column; gap: 10px; }
    .msg { padding: 8px 10px; border: 1px solid var(--ui-color-border); border-radius: var(--ui-radius); max-width: 90%; }
    .msg.out { align-self: flex-end; background: var(--ui-color-surface-raised); }
    @media (max-width: 620px) {
      .wide { display: none; }
      .nowrap { flex-wrap: wrap; }
    }
  `],
})
export class GroupsPage {
  private api = inject(Api);
  private toast = inject(UiToastService);
  private router = inject(Router);

  platforms = PLATFORMS;
  platformFilters: Option[] = [{ label: 'All platforms', value: '' }, ...PLATFORMS];
  kindFilters: Option[] = [
    { label: 'Any kind', value: '' }, { label: 'Off', value: 'off' },
    { label: 'General', value: 'general' }, { label: 'Tasks', value: 'tasks' }, { label: 'Project', value: 'project' },
  ];
  taskFilters: Option[] = [{ label: 'Open', value: 'open' }, { label: 'Done', value: 'done' }, { label: 'Dropped', value: 'dropped' }];
  roleOptions: Option[] = [{ label: 'Read', value: 'read' }, { label: 'Write', value: 'write' }];

  // Groups list.
  groups = signal<GroupRow[]>([]);
  errors = signal<Record<string, string>>({});
  loading = signal(true);
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
      (!q || (g.name || '').toLowerCase().includes(q) || g.native_id.includes(q) || (g.folder || '').toLowerCase().includes(q)));
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

  // The open group.
  sel = signal<GroupRow | null>(null);
  detailOpen = signal(false);
  section = signal<Section>('settings');
  busy = signal(false);
  members = signal<GroupMember[]>([]);
  private membersFor = '';
  roleBusy = signal<Set<string>>(new Set());
  messages = signal<GroupMessage[]>([]);
  sideLoading = signal(false);
  untrackAsk = signal(false);
  untrackPurge = false;
  unbindAsk = signal(false);
  purge = false;
  statusText = signal('');

  // Folder.
  dirPath = '';
  dirCreate = false;
  workspaces = signal<Workspace[]>([]);
  picks = computed(() => {
    const own = this.sel()?.folder || '';
    return this.workspaces().filter(w => w.present && !w.ignored && w.path !== own).slice(0, 8);
  });

  // The group's project (tasks and project groups).
  detail = signal<Detail | null>(null);
  detailLoading = signal(false);
  taskFilter = signal('open');
  shownTasks = computed(() => [...(this.detail()?.open_tasks || []), ...(this.detail()?.closed_tasks || [])].filter(t => (t.status || 'open') === this.taskFilter()));
  aliasDraft: Record<string, string> = {};
  standupBusy = signal(false);
  memberOptions = computed(() => [{ label: 'unassigned', value: '' }, ...(this.detail()?.members || []).filter(m => m.active).map(m => ({ label: m.name, value: m.name }))]);

  constructor() { this.load(); }

  key(g: GroupRow) { return g.transport + ':' + g.native_id; }
  when(ts?: number) { return ts ? new Date(ts * 1000).toLocaleString() : 'never'; }
  kindTone(kind: string) {
    switch (kind) {
      case 'project': return 'primary';
      case 'tasks': return 'warning';
      case 'general': return 'success';
      default: return 'neutral';
    }
  }

  async load() {
    this.loading.set(true);
    try {
      const v: GroupsView = await this.api.get('/api/groups');
      this.groups.set(v?.groups || []);
      this.errors.set(v?.errors || {});
      // Keep the open group's row current.
      const s = this.sel();
      if (s) {
        const next = this.groups().find(g => this.key(g) === this.key(s));
        if (next) this.sel.set(next);
      }
    } catch (e: any) { this.toast.danger(e.message, 'Load failed'); }
    finally { this.loading.set(false); }
  }

  private async loadContacts() {
    if (this.contacts().length) return;
    try { this.contacts.set((await this.api.get('/api/contacts')) || []); }
    catch (e: any) { this.toast.danger(e.message, 'Could not load contacts'); }
  }

  private async loadWorkspaces() {
    if (this.workspaces().length) return;
    try { this.workspaces.set((await this.api.get('/api/workspaces')) || []); }
    catch { /* quick picks are optional */ }
  }

  // --- The group modal ---

  open(g: GroupRow) {
    this.sel.set(g);
    this.section.set('settings');
    this.members.set([]); this.membersFor = '';
    this.messages.set([]);
    this.detail.set(null);
    this.untrackAsk.set(false); this.unbindAsk.set(false);
    this.statusText.set('');
    this.picked.set([]); this.pickId = '';
    this.dirPath = g.folder || ''; this.dirCreate = false;
    this.taskFilter.set('open');
    this.detailOpen.set(true);
    this.loadWorkspaces();
    this.loadDetail();
  }

  closeDetail(open: boolean) {
    if (open) return;
    this.detailOpen.set(false);
    this.sel.set(null);
  }

  private async loadDetail() {
    const id = this.sel()?.project_id;
    if (!id) { this.detail.set(null); return; }
    this.detailLoading.set(true);
    try { this.detail.set(await this.api.get('/api/projects/' + id)); }
    catch (e: any) { this.toast.danger(e.message, 'Could not load tasks'); }
    finally { this.detailLoading.set(false); }
  }

  // refresh reloads the list (and with it the open row) and the project.
  private async refresh() {
    await this.load();
    const g = this.sel();
    if (g && !g.project_id && this.section() === 'tasks') this.section.set('settings');
    await this.loadDetail();
  }

  private q(g: GroupRow) { return '?transport=' + encodeURIComponent(g.transport) + '&id=' + encodeURIComponent(g.native_id); }

  async showMembers() {
    this.section.set('members');
    const g = this.sel();
    if (!g) return;
    this.loadContacts();
    if (this.membersFor === this.key(g)) return;
    this.sideLoading.set(true);
    try { this.members.set((await this.api.get('/api/groups/members' + this.q(g))) || []); this.membersFor = this.key(g); }
    catch (e: any) { this.toast.danger(e.message, 'Could not list members'); }
    finally { this.sideLoading.set(false); }
  }

  async showMessages() {
    this.section.set('messages');
    const g = this.sel();
    if (!g) return;
    this.sideLoading.set(true);
    try { this.messages.set((await this.api.get('/api/groups/messages' + this.q(g))) || []); }
    catch (e: any) { this.toast.danger(e.message, 'Could not read messages'); }
    finally { this.sideLoading.set(false); }
  }

  projectMember(platformID: string): Member | undefined {
    return this.detail()?.members.find(m => m.platform_id === platformID);
  }

  private async run(path: string, body: unknown, title: string): Promise<boolean> {
    this.busy.set(true);
    try {
      const res: any = await this.api.post(path, body);
      this.toast.success(res?.reply || 'Done', title);
      return true;
    } catch (e: any) { this.toast.danger(e.message, title + ' failed'); return false; }
    finally { this.busy.set(false); }
  }

  async setPolicy(g: GroupRow, on: boolean) {
    await this.run('/api/groups/policy', { transport: g.transport, native_id: g.native_id, on }, on ? 'Agent on' : 'Agent off');
    await this.refresh();
  }

  async setTrack(g: GroupRow, on: boolean) {
    if (!on) { this.untrackPurge = false; this.untrackAsk.set(true); return; }
    await this.run('/api/groups/track', { transport: g.transport, native_id: g.native_id, on: true, purge: false }, 'Track tasks');
    await this.refresh();
    this.dirPath = this.sel()?.folder || '';
  }

  async untrack(g: GroupRow) {
    if (await this.run('/api/groups/track', { transport: g.transport, native_id: g.native_id, on: false, purge: this.untrackPurge }, 'Stop tracking')) {
      this.untrackAsk.set(false);
    }
    await this.refresh();
  }

  async setDir(g: GroupRow) {
    const path = this.dirPath.trim();
    if (!path) return;
    const title = g.folder ? 'Change folder' : 'Add folder';
    if (await this.run('/api/groups/dir', { transport: g.transport, native_id: g.native_id, path, create: this.dirCreate }, title)) {
      this.dirCreate = false;
      this.workspaces.set([]);
      this.loadWorkspaces();
    }
    await this.refresh();
    this.dirPath = this.sel()?.folder || path;
  }

  async unbind(g: GroupRow) {
    if (!g.project_id) return;
    if (await this.run(`/api/projects/${g.project_id}/remove`, { purge: this.purge }, 'Unbind')) {
      this.unbindAsk.set(false);
    }
    await this.refresh();
    this.dirPath = this.sel()?.folder || '';
  }

  async setRole(m: GroupMember, role: string) {
    const g = this.sel();
    if (!g || role === m.role) return;
    this.roleBusy.update(s => new Set(s).add(m.id));
    try {
      const res: any = await this.api.post('/api/groups/role', { transport: g.transport, native_id: g.native_id, member_id: m.id, role });
      this.toast.success(res?.reply || 'Saved');
      this.members.update(list => list.map(x => x.id === m.id ? { ...x, role } : x));
    } catch (e: any) {
      this.toast.danger(e.message, 'Role change failed');
      this.members.update(list => [...list]);
    } finally { this.roleBusy.update(s => { const n = new Set(s); n.delete(m.id); return n; }); }
  }

  pick() {
    const c = this.contacts().find(x => String(x.id) === this.pickId);
    if (c) this.picked.update(list => [...list, c]);
    this.pickId = '';
  }
  unpick(c: Contact) { this.picked.update(list => list.filter(x => x.id !== c.id)); }

  async addMembers(g: GroupRow) {
    this.saving.set(true);
    try {
      await this.api.post('/api/groups/members', { transport: g.transport, native_id: g.native_id, contact_ids: this.picked().map(c => c.id) });
      this.toast.success('Added to ' + (g.name || g.native_id));
      this.picked.set([]);
      this.membersFor = '';
      await this.showMembers();
    } catch (e: any) { this.toast.danger(e.message, 'Add failed'); }
    finally { this.saving.set(false); }
  }

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

  personas() {
    this.closeDetail(false);
    this.router.navigate(['personas'], { queryParams: { keys: PERSONA_KEYS } });
  }

  // --- Tasks, aliases, follow, standup ---

  async addAlias(d: Detail, m: Member) {
    const alias = (this.aliasDraft[m.name] || '').trim();
    if (!alias) return;
    if (await this.run(`/api/projects/${d.project.id}/alias`, { op: 'add', member: m.name, alias }, 'Alias')) {
      this.aliasDraft[m.name] = '';
      await this.loadDetail();
    }
  }

  async removeAlias(d: Detail, m: Member, alias: string) {
    if (await this.run(`/api/projects/${d.project.id}/alias`, { op: 'rm', member: m.name, alias }, 'Alias')) await this.loadDetail();
  }

  async taskAction(d: Detail, t: Task, action: 'done' | 'drop') {
    if (await this.run(`/api/projects/${d.project.id}/tasks/${t.id}/${action}`, {}, 'Task #' + t.id)) await this.loadDetail();
  }

  async assign(d: Detail, t: Task, member: string) {
    if (!member || member === t.assignee) return;
    await this.run(`/api/projects/${d.project.id}/tasks/${t.id}/assign`, { member }, 'Task #' + t.id);
    await this.loadDetail();
  }

  async setFollow(d: Detail, on: boolean) {
    await this.run(`/api/projects/${d.project.id}/follow`, { on }, 'Follow tasks');
    await this.refresh();
  }

  async standup(d: Detail) {
    this.standupBusy.set(true);
    try { if (await this.run(`/api/projects/${d.project.id}/standup`, {}, 'Standup')) await this.loadDetail(); }
    finally { this.standupBusy.set(false); }
  }

  async status(d: Detail) {
    try {
      const res: any = await this.api.get(`/api/projects/${d.project.id}/status`);
      this.statusText.set(res?.reply || '');
    } catch (e: any) { this.toast.danger(e.message, 'Status failed'); }
  }
}
