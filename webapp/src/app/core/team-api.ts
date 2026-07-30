import { Injectable, inject } from '@angular/core';
import { Api } from './api';

// Typed seam onto the server's /api/team/* surface. Every call is proxied to the
// zcoms-team module over team.sock; nothing here touches team.db.

export interface Delegator {
  id: string;
  name: string;
  github_owner?: string;
  github_project_number?: number;
  local_only: boolean;
  has_github: boolean;
  created_by?: string;
  created_at?: string;
}

export interface Standup {
  id: string;
  name: string;
  delegator: string;
  telegram_group: string;
  schedule_time: string;
  timezone: string;
  enabled: boolean;
  next_run?: string;
  created_by?: string;
}

export interface Staff {
  id: string;
  delegator: string;
  telegram_username: string;
  telegram_user_id?: number;
  github_username?: string;
  role: string;
  max_active_tasks: number;
  active_tasks: number;
}

export interface Task {
  id: string;
  title: string;
  priority: string;
  status: string;
  assigned_to?: string;
  github_item_id?: string;
  created_by?: string;
  created_at?: string;
}

export interface Run {
  id: string;
  run_date: string;
  status: string;
  started_at?: string;
  completed_at?: string;
  group_report?: string;
  error_message?: string;
}

export interface AuditEntry {
  actor: string;
  action: string;
  entity_type: string;
  entity_id: string;
  created_at: string;
}

export interface Overview {
  delegators: Delegator[];
  standups: Standup[];
}

@Injectable({ providedIn: 'root' })
export class TeamApi {
  private api = inject(Api);

  private q(name: string) { return encodeURIComponent(name); }

  status(): Promise<{ running: boolean; overview?: Overview; error?: string }> {
    return this.api.get('/api/team/status');
  }
  overview(): Promise<Overview> { return this.api.get('/api/team/overview'); }
  audit(limit = 25): Promise<AuditEntry[]> { return this.api.get(`/api/team/audit?limit=${limit}`); }

  // --- delegators ---
  delegators(): Promise<Delegator[]> { return this.api.get('/api/team/delegators'); }
  createDelegator(name: string, owner: string, project: number) {
    return this.api.post('/api/team/delegators', {
      name, github_owner: owner, github_project_number: project,
    });
  }
  updateDelegator(name: string, owner: string, project: number) {
    return this.api.put(`/api/team/delegators/${this.q(name)}`, {
      github_owner: owner, github_project_number: project,
    });
  }
  deleteDelegator(name: string) { return this.api.del(`/api/team/delegators/${this.q(name)}`); }

  // --- standups ---
  standups(delegator?: string): Promise<Standup[]> {
    return this.api.get('/api/team/standups' + (delegator ? `?delegator=${this.q(delegator)}` : ''));
  }
  createStandup(body: {
    name: string; delegator: string; telegram_group: string; schedule_time: string; timezone: string;
  }) {
    return this.api.post('/api/team/standups', body);
  }
  editStandup(name: string, field: string, value: string) {
    return this.api.put(`/api/team/standups/${this.q(name)}`, { field, value });
  }
  toggleStandup(name: string, on: boolean) {
    return this.api.post(`/api/team/standups/${this.q(name)}/${on ? 'enable' : 'disable'}`);
  }
  runs(name: string, limit = 10): Promise<Run[]> {
    return this.api.get(`/api/team/standups/${this.q(name)}/runs?limit=${limit}`);
  }

  // --- staff ---
  staff(delegator: string): Promise<Staff[]> {
    return this.api.get(`/api/team/staff?delegator=${this.q(delegator)}`);
  }
  addStaff(body: {
    delegator: string; telegram_username: string; github_username: string; role: string; max_active_tasks: number;
  }) {
    return this.api.post('/api/team/staff', body);
  }
  setStaffRole(delegator: string, telegram: string, role: string) {
    return this.api.put(`/api/team/staff/${this.q(telegram)}`, { delegator, role });
  }
  setStaffLimit(delegator: string, telegram: string, max_active_tasks: number) {
    return this.api.put(`/api/team/staff/${this.q(telegram)}`, { delegator, max_active_tasks });
  }
  removeStaff(delegator: string, telegram: string) {
    return this.api.del(`/api/team/staff/${this.q(telegram)}?delegator=${this.q(delegator)}`);
  }

  // --- tasks ---
  tasks(delegator: string): Promise<Task[]> {
    return this.api.get(`/api/team/tasks?delegator=${this.q(delegator)}`);
  }
  addTask(delegator: string, priority: string, title: string) {
    return this.api.post('/api/team/tasks', { delegator, priority, title });
  }
  setTaskStatus(delegator: string, id: string, status: string) {
    return this.api.post(`/api/team/tasks/${this.q(id)}/status`, { delegator, status });
  }
  assignTask(delegator: string, id: string, telegram_username: string) {
    return this.api.post(`/api/team/tasks/${this.q(id)}/assign`, { delegator, telegram_username });
  }
  unassignTask(delegator: string, id: string) {
    return this.api.post(`/api/team/tasks/${this.q(id)}/unassign`, { delegator });
  }
}
