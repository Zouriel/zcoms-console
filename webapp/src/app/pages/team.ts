import { Component, OnDestroy, effect, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { UiToastService } from 'ui/dialog';
import { TeamApi, Delegator } from '../core/team-api';
import { TeamLive } from '../core/team-live';
import { UI } from '../core/ui';

// Team shell. Owns the project tab strip and the live-update subscription; each
// project is its own routed page (/team/:project) with its own tasks, staff,
// standups and settings, so switching projects is a navigation rather than a
// filter on one big page.

@Component({
  selector: 'app-team',
  imports: [RouterOutlet, ...UI],
  template: `
    <div class="head">
      <div class="tabs" role="tablist">
        <button
          class="tab" role="tab"
          [class.on]="current() === ''"
          [attr.aria-selected]="current() === ''"
          (click)="go('')"
        >Projects</button>
        @for (d of delegators(); track d.id) {
          <button
            class="tab" role="tab"
            [class.on]="current() === d.name"
            [attr.aria-selected]="current() === d.name"
            (click)="go(d.name)"
          >
            {{ d.name }}
            @if (d.has_github) { <span class="dot" title="linked to a GitHub project"></span> }
          </button>
        }
      </div>
      <span class="spacer"></span>
      @if (!live.running()) {
        <ui-badge tone="danger">module stopped</ui-badge>
      } @else if (live.connected()) {
        <ui-badge tone="success">live</ui-badge>
      } @else {
        <ui-badge tone="warning">reconnecting</ui-badge>
      }
    </div>

    @if (!live.running()) {
      <ui-alert tone="warning">
        <ui-text variant="body">
          The team module isn't running. Start it with
          <code>systemctl --user start zcoms-team</code> — this page will pick it up on its own.
        </ui-text>
      </ui-alert>
    } @else {
      <router-outlet></router-outlet>
    }
  `,
  styles: [`
    .head { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; flex-wrap: wrap; }
    .spacer { flex: 1; }
    .tabs { display: flex; gap: 4px; flex-wrap: wrap; }
    .tab {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 6px 12px; border-radius: 8px 8px 0 0;
      border: 1px solid transparent; border-bottom: 2px solid transparent;
      background: none; color: inherit; cursor: pointer; font: inherit;
    }
    .tab:hover { background: var(--ui-color-surface-2, rgba(127,127,127,0.08)); }
    .tab.on {
      border-bottom-color: var(--ui-color-primary, #4a7);
      background: var(--ui-color-surface-2, rgba(127,127,127,0.08));
      font-weight: 600;
    }
    .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--ui-color-primary, #4a7); }
  `],
})
export class TeamPage implements OnDestroy {
  private api = inject(TeamApi);
  private router = inject(Router);
  private toast = inject(UiToastService);
  live = inject(TeamLive);

  delegators = signal<Delegator[]>([]);
  current = signal('');

  constructor() {
    this.live.acquire();
    this.syncCurrent(this.router.url);
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((e) => this.syncCurrent((e as NavigationEnd).urlAfterRedirects));

    // The tab strip is part of the shell, so it reloads on every live change:
    // a project created from Telegram or the CLI appears here without a refresh.
    effect(() => {
      this.live.version();
      void this.loadDelegators();
    });
  }

  ngOnDestroy() { this.live.release(); }

  private syncCurrent(url: string) {
    const seg = url.split('?')[0].split('/').filter(Boolean);
    this.current.set(seg[0] === 'team' && seg[1] ? decodeURIComponent(seg[1]) : '');
  }

  private async loadDelegators() {
    try { this.delegators.set((await this.api.delegators()) || []); }
    catch (e: any) {
      // A stopped module already shows its own banner; don't double-report.
      if (this.live.running()) this.toast.danger(e?.message || String(e), 'Projects failed');
    }
  }

  go(name: string) {
    this.router.navigate(name ? ['team', name] : ['team']);
  }
}
