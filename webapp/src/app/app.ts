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
        <ui-sidebar-layout [breakpoint]="860" [(open)]="navOpen">
          <div sidebar>
            <div class="brand">
              <ui-text variant="h4">zcoms</ui-text>
              <ui-text variant="caption" class="muted">console</ui-text>
            </div>
            <ui-side-nav [groups]="navGroups" [active]="active()" (navigate)="go($event)"></ui-side-nav>
          </div>
          <ng-container header>
            <ui-text variant="h3">{{ activeLabel() }}</ui-text>
            <span class="spacer"></span>
            @if (!agentAvailable()) { <ui-badge tone="warning">agent offline</ui-badge> }
            <ui-button variant="ghost" size="sm" (click)="logout()">Log out</ui-button>
          </ng-container>
          <router-outlet></router-outlet>
        </ui-sidebar-layout>
      } @else {
        <app-login (done)="refresh()"></app-login>
      }
    }
    <ui-toast-host></ui-toast-host>
  `,
  styles: [`
    /* The shell (desktop sidebar ↔ mobile drawer + hamburger) is the library's
       ui-sidebar-layout now; only the brand block is app-specific. */
    .brand {
      padding: 0 var(--ui-space-2) var(--ui-space-4);
      display: flex; flex-direction: column; gap: 2px;
    }
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
  navOpen = signal(false);
  private lastUnauthorized = 0;

  navGroups = [
    {
      items: [
        { label: 'Contacts', value: 'contacts' },
        { label: 'Workspaces', value: 'workspaces' },
        { label: 'Sessions', value: 'sessions' },
        { label: 'Personas', value: 'personas' },
        { label: 'Allowlist', value: 'allowlist' },
        { label: 'Connectors', value: 'connectors' },
        { label: 'Triage', value: 'triage' },
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
    // Drop back to the login gate only when a *new* 401 occurs — keyed on the
    // unauthorized counter incrementing, NOT on `ready`, so confirming auth on
    // boot can't accidentally flip us back to the login screen.
    effect(() => {
      const n = this.api.unauthorized();
      if (n > this.lastUnauthorized) {
        this.lastUnauthorized = n;
        this.authed.set(false);
      }
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

  go(item: { value: string }) { this.router.navigate([item.value]); this.navOpen.set(false); }

  async logout() {
    try { await this.api.post('/api/logout'); } catch { /* ignore */ }
    this.authed.set(false);
  }
}
