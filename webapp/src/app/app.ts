import { Component, computed, effect, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Api } from './core/api';
import { UI } from './core/ui';
import { LoginComponent } from './auth/login';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoginComponent, ...UI],
  template: `
    @if (ready()) {
      @if (authed()) {
        <div class="shell">
          <aside class="side">
            <div class="brand">
              <ui-text variant="h4">zcoms</ui-text>
              <ui-text variant="caption" class="muted">console</ui-text>
            </div>
            <ui-side-nav [groups]="navGroups" [active]="active()" (navigate)="go($event)"></ui-side-nav>
          </aside>
          <div class="main">
            <header class="topbar">
              <ui-text variant="h3">{{ activeLabel() }}</ui-text>
              <span class="spacer"></span>
              @if (!agentAvailable()) { <ui-badge tone="warning">agent offline</ui-badge> }
              <ui-button variant="ghost" size="sm" (click)="logout()">Log out</ui-button>
            </header>
            <main class="content"><router-outlet></router-outlet></main>
          </div>
        </div>
      } @else {
        <app-login (done)="refresh()"></app-login>
      }
    }
    <ui-toast-host></ui-toast-host>
  `,
  styles: [`
    .shell { display: grid; grid-template-columns: 248px 1fr; min-height: 100vh; }
    .side {
      background: var(--ui-color-surface);
      border-right: 1px solid var(--ui-color-border);
      padding: var(--ui-space-4) var(--ui-space-3);
      display: flex; flex-direction: column; gap: var(--ui-space-4);
    }
    .brand { padding: 0 var(--ui-space-2); display: flex; flex-direction: column; gap: 2px; }
    .main { display: flex; flex-direction: column; min-width: 0; }
    .topbar {
      display: flex; align-items: center; gap: var(--ui-space-3);
      padding: var(--ui-space-4) var(--ui-space-6);
      border-bottom: 1px solid var(--ui-color-border);
      background: var(--ui-color-bg);
      position: sticky; top: 0; z-index: 5;
    }
    .content { padding: var(--ui-space-6); min-width: 0; }
  `],
})
export class App {
  private api = inject(Api);
  private router = inject(Router);

  ready = signal(false);
  authed = signal(false);
  needsSetup = signal(false);
  agentAvailable = signal(true);
  active = signal('contacts');

  navGroups = [
    {
      items: [
        { label: 'Contacts', value: 'contacts' },
        { label: 'Workspaces', value: 'workspaces' },
        { label: 'Sessions', value: 'sessions' },
        { label: 'Personas', value: 'personas' },
        { label: 'Allowlist', value: 'allowlist' },
        { label: 'Commerce', value: 'commerce' },
        { label: 'Settings', value: 'settings' },
      ],
    },
  ];
  activeLabel = computed(
    () => this.navGroups[0].items.find((i) => i.value === this.active())?.label ?? '',
  );

  constructor() {
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((e) => {
        const url = (e as NavigationEnd).urlAfterRedirects || '/';
        this.active.set(url.split('/')[1] || 'contacts');
      });
    // Any 401 from the Api drops us back to the login gate.
    effect(() => {
      this.api.unauthorized();
      if (this.ready()) this.authed.set(false);
    });
    this.refresh();
  }

  async refresh() {
    try {
      const st = await this.api.get('/api/auth/status');
      this.authed.set(!!st.authenticated);
      this.needsSetup.set(!!st.needs_setup);
      this.agentAvailable.set(!!st.agent_available);
    } catch {
      /* leave defaults; gate stays on login */
    }
    this.ready.set(true);
  }

  go(item: { value: string }) { this.router.navigate([item.value]); }

  async logout() {
    try { await this.api.post('/api/logout'); } catch { /* ignore */ }
    this.authed.set(false);
  }
}
