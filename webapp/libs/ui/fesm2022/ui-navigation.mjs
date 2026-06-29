import * as i0 from '@angular/core';
import { inject, input, Component, model, computed, output, NgZone, signal } from '@angular/core';
import { UI_CONFIG } from 'ui';
import { DOCUMENT } from '@angular/common';
import { CdkOverlayOrigin, CdkConnectedOverlay } from '@angular/cdk/overlay';

/**
 * `ui-navbar` — top navigation surface (glass-capable). Slots:
 * `[navbar-brand]`, default (center/links), `[navbar-actions]`.
 */
class UiNavbar {
    config = inject(UI_CONFIG);
    sticky = input(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "sticky" }] : /* istanbul ignore next */ []));
    glass = input(this.config.glass, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "glass" }] : /* istanbul ignore next */ []));
    radius = input(this.config.radius, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "radius" }] : /* istanbul ignore next */ []));
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiNavbar, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.1.0", version: "22.0.4", type: UiNavbar, isStandalone: true, selector: "ui-navbar", inputs: { sticky: { classPropertyName: "sticky", publicName: "sticky", isSignal: true, isRequired: false, transformFunction: null }, glass: { classPropertyName: "glass", publicName: "glass", isSignal: true, isRequired: false, transformFunction: null }, radius: { classPropertyName: "radius", publicName: "radius", isSignal: true, isRequired: false, transformFunction: null } }, ngImport: i0, template: `
    <nav class="ui-navbar" [class.glass]="glass()" [class.no-radius]="!radius()" [class.sticky]="sticky()">
      <div class="brand"><ng-content select="[navbar-brand]" /></div>
      <div class="links"><ng-content /></div>
      <div class="actions"><ng-content select="[navbar-actions]" /></div>
    </nav>
  `, isInline: true, styles: [":host{display:block}.ui-navbar{display:flex;align-items:center;gap:var(--ui-space-4);height:52px;padding:0 var(--ui-space-4);background:var(--ui-color-surface);border:1px solid var(--ui-color-border);border-radius:var(--ui-radius);font-family:var(--ui-font-default)}.ui-navbar.no-radius{border-radius:0}.ui-navbar.glass{background:var(--ui-glass-bg);-webkit-backdrop-filter:blur(var(--ui-glass-blur));backdrop-filter:blur(var(--ui-glass-blur));border-color:var(--ui-glass-border)}.ui-navbar.sticky{position:sticky;top:0;z-index:var(--ui-z-docked)}.brand{font-weight:700;color:var(--ui-color-text);display:flex;align-items:center;gap:var(--ui-space-2)}.links{display:flex;align-items:center;gap:var(--ui-space-2);flex:1}.actions{display:flex;align-items:center;gap:var(--ui-space-2)}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiNavbar, decorators: [{
            type: Component,
            args: [{ selector: 'ui-navbar', template: `
    <nav class="ui-navbar" [class.glass]="glass()" [class.no-radius]="!radius()" [class.sticky]="sticky()">
      <div class="brand"><ng-content select="[navbar-brand]" /></div>
      <div class="links"><ng-content /></div>
      <div class="actions"><ng-content select="[navbar-actions]" /></div>
    </nav>
  `, styles: [":host{display:block}.ui-navbar{display:flex;align-items:center;gap:var(--ui-space-4);height:52px;padding:0 var(--ui-space-4);background:var(--ui-color-surface);border:1px solid var(--ui-color-border);border-radius:var(--ui-radius);font-family:var(--ui-font-default)}.ui-navbar.no-radius{border-radius:0}.ui-navbar.glass{background:var(--ui-glass-bg);-webkit-backdrop-filter:blur(var(--ui-glass-blur));backdrop-filter:blur(var(--ui-glass-blur));border-color:var(--ui-glass-border)}.ui-navbar.sticky{position:sticky;top:0;z-index:var(--ui-z-docked)}.brand{font-weight:700;color:var(--ui-color-text);display:flex;align-items:center;gap:var(--ui-space-2)}.links{display:flex;align-items:center;gap:var(--ui-space-2);flex:1}.actions{display:flex;align-items:center;gap:var(--ui-space-2)}\n"] }]
        }], propDecorators: { sticky: [{ type: i0.Input, args: [{ isSignal: true, alias: "sticky", required: false }] }], glass: [{ type: i0.Input, args: [{ isSignal: true, alias: "glass", required: false }] }], radius: [{ type: i0.Input, args: [{ isSignal: true, alias: "radius", required: false }] }] } });

/** `ui-pagination` — page navigation with truncation and prev/next. */
class UiPagination {
    page = model(1, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "page" }] : /* istanbul ignore next */ []));
    total = input(1, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "total" }] : /* istanbul ignore next */ []));
    /** Sibling pages to show around current. */
    siblings = input(1, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "siblings" }] : /* istanbul ignore next */ []));
    label = input('Pagination', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "label" }] : /* istanbul ignore next */ []));
    items = computed(() => {
        const total = this.total();
        const current = this.page();
        const sib = this.siblings();
        const range = [];
        const left = Math.max(2, current - sib);
        const right = Math.min(total - 1, current + sib);
        range.push(1);
        if (left > 2)
            range.push(-1);
        for (let i = left; i <= right; i++)
            range.push(i);
        if (right < total - 1)
            range.push(-1);
        if (total > 1)
            range.push(total);
        return range;
    }, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "items" }] : /* istanbul ignore next */ []));
    go(p) {
        const clamped = Math.max(1, Math.min(this.total(), p));
        if (clamped !== this.page())
            this.page.set(clamped);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiPagination, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "22.0.4", type: UiPagination, isStandalone: true, selector: "ui-pagination", inputs: { page: { classPropertyName: "page", publicName: "page", isSignal: true, isRequired: false, transformFunction: null }, total: { classPropertyName: "total", publicName: "total", isSignal: true, isRequired: false, transformFunction: null }, siblings: { classPropertyName: "siblings", publicName: "siblings", isSignal: true, isRequired: false, transformFunction: null }, label: { classPropertyName: "label", publicName: "label", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { page: "pageChange" }, ngImport: i0, template: `
    <nav class="ui-pagination" [attr.aria-label]="label()">
      <button type="button" class="pg" [disabled]="page() <= 1" aria-label="Previous page" (click)="go(page() - 1)">‹</button>
      @for (item of items(); track $index) {
        @if (item === -1) {
          <span class="ellipsis" aria-hidden="true">…</span>
        } @else {
          <button
            type="button"
            class="pg"
            [class.active]="item === page()"
            [attr.aria-current]="item === page() ? 'page' : null"
            [attr.aria-label]="'Page ' + item"
            (click)="go(item)">
            {{ item }}
          </button>
        }
      }
      <button type="button" class="pg" [disabled]="page() >= total()" aria-label="Next page" (click)="go(page() + 1)">›</button>
    </nav>
  `, isInline: true, styles: [":host{display:block}.ui-pagination{display:inline-flex;align-items:center;gap:var(--ui-space-1);font-family:var(--ui-font-default)}.pg{min-width:var(--ui-size-sm);height:var(--ui-size-sm);padding:0 var(--ui-space-2);display:inline-flex;align-items:center;justify-content:center;background:transparent;color:var(--ui-color-text);border:1px solid var(--ui-color-border);border-radius:var(--ui-radius);font:inherit;font-size:var(--ui-font-size-sm);cursor:pointer;transition:background var(--ui-motion-fast) var(--ui-ease-standard)}.pg:hover:not(:disabled):not(.active){background:var(--ui-color-surface-raised)}.pg.active{background:var(--ui-color-primary);color:var(--ui-color-primary-contrast);border-color:transparent}.pg:disabled{opacity:.4;cursor:not-allowed}.pg:focus-visible{outline:none;box-shadow:var(--ui-focus-ring)}.ellipsis{padding:0 var(--ui-space-1);color:var(--ui-color-text-muted)}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiPagination, decorators: [{
            type: Component,
            args: [{ selector: 'ui-pagination', template: `
    <nav class="ui-pagination" [attr.aria-label]="label()">
      <button type="button" class="pg" [disabled]="page() <= 1" aria-label="Previous page" (click)="go(page() - 1)">‹</button>
      @for (item of items(); track $index) {
        @if (item === -1) {
          <span class="ellipsis" aria-hidden="true">…</span>
        } @else {
          <button
            type="button"
            class="pg"
            [class.active]="item === page()"
            [attr.aria-current]="item === page() ? 'page' : null"
            [attr.aria-label]="'Page ' + item"
            (click)="go(item)">
            {{ item }}
          </button>
        }
      }
      <button type="button" class="pg" [disabled]="page() >= total()" aria-label="Next page" (click)="go(page() + 1)">›</button>
    </nav>
  `, styles: [":host{display:block}.ui-pagination{display:inline-flex;align-items:center;gap:var(--ui-space-1);font-family:var(--ui-font-default)}.pg{min-width:var(--ui-size-sm);height:var(--ui-size-sm);padding:0 var(--ui-space-2);display:inline-flex;align-items:center;justify-content:center;background:transparent;color:var(--ui-color-text);border:1px solid var(--ui-color-border);border-radius:var(--ui-radius);font:inherit;font-size:var(--ui-font-size-sm);cursor:pointer;transition:background var(--ui-motion-fast) var(--ui-ease-standard)}.pg:hover:not(:disabled):not(.active){background:var(--ui-color-surface-raised)}.pg.active{background:var(--ui-color-primary);color:var(--ui-color-primary-contrast);border-color:transparent}.pg:disabled{opacity:.4;cursor:not-allowed}.pg:focus-visible{outline:none;box-shadow:var(--ui-focus-ring)}.ellipsis{padding:0 var(--ui-space-1);color:var(--ui-color-text-muted)}\n"] }]
        }], propDecorators: { page: [{ type: i0.Input, args: [{ isSignal: true, alias: "page", required: false }] }, { type: i0.Output, args: ["pageChange"] }], total: [{ type: i0.Input, args: [{ isSignal: true, alias: "total", required: false }] }], siblings: [{ type: i0.Input, args: [{ isSignal: true, alias: "siblings", required: false }] }], label: [{ type: i0.Input, args: [{ isSignal: true, alias: "label", required: false }] }] } });

/** `ui-breadcrumbs` — hierarchical trail. Emits `(navigate)` for items without href. */
class UiBreadcrumbs {
    items = input([], /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "items" }] : /* istanbul ignore next */ []));
    separator = input('/', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "separator" }] : /* istanbul ignore next */ []));
    navigate = output();
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiBreadcrumbs, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "22.0.4", type: UiBreadcrumbs, isStandalone: true, selector: "ui-breadcrumbs", inputs: { items: { classPropertyName: "items", publicName: "items", isSignal: true, isRequired: false, transformFunction: null }, separator: { classPropertyName: "separator", publicName: "separator", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { navigate: "navigate" }, ngImport: i0, template: `
    <nav class="ui-breadcrumbs" aria-label="Breadcrumb">
      <ol>
        @for (item of items(); track $index; let last = $last) {
          <li>
            @if (last) {
              <span class="crumb current" aria-current="page">{{ item.label }}</span>
            } @else if (item.href) {
              <a class="crumb" [href]="item.href">{{ item.label }}</a>
            } @else {
              <button type="button" class="crumb link" (click)="navigate.emit(item)">{{ item.label }}</button>
            }
            @if (!last) { <span class="sep" aria-hidden="true">{{ separator() }}</span> }
          </li>
        }
      </ol>
    </nav>
  `, isInline: true, styles: [":host{display:block}ol{display:flex;flex-wrap:wrap;align-items:center;gap:var(--ui-space-1);margin:0;padding:0;list-style:none}li{display:inline-flex;align-items:center;gap:var(--ui-space-1)}.crumb{font-family:var(--ui-font-default);font-size:var(--ui-font-size-sm);color:var(--ui-color-text-muted);text-decoration:none;background:none;border:none;padding:0;cursor:pointer}a.crumb:hover,.crumb.link:hover{color:var(--ui-color-text);text-decoration:underline}.crumb.current{color:var(--ui-color-text);font-weight:500;cursor:default}.crumb:focus-visible{outline:none;box-shadow:var(--ui-focus-ring);border-radius:3px}.sep{color:var(--ui-color-text-muted);font-size:var(--ui-font-size-sm)}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiBreadcrumbs, decorators: [{
            type: Component,
            args: [{ selector: 'ui-breadcrumbs', template: `
    <nav class="ui-breadcrumbs" aria-label="Breadcrumb">
      <ol>
        @for (item of items(); track $index; let last = $last) {
          <li>
            @if (last) {
              <span class="crumb current" aria-current="page">{{ item.label }}</span>
            } @else if (item.href) {
              <a class="crumb" [href]="item.href">{{ item.label }}</a>
            } @else {
              <button type="button" class="crumb link" (click)="navigate.emit(item)">{{ item.label }}</button>
            }
            @if (!last) { <span class="sep" aria-hidden="true">{{ separator() }}</span> }
          </li>
        }
      </ol>
    </nav>
  `, styles: [":host{display:block}ol{display:flex;flex-wrap:wrap;align-items:center;gap:var(--ui-space-1);margin:0;padding:0;list-style:none}li{display:inline-flex;align-items:center;gap:var(--ui-space-1)}.crumb{font-family:var(--ui-font-default);font-size:var(--ui-font-size-sm);color:var(--ui-color-text-muted);text-decoration:none;background:none;border:none;padding:0;cursor:pointer}a.crumb:hover,.crumb.link:hover{color:var(--ui-color-text);text-decoration:underline}.crumb.current{color:var(--ui-color-text);font-weight:500;cursor:default}.crumb:focus-visible{outline:none;box-shadow:var(--ui-focus-ring);border-radius:3px}.sep{color:var(--ui-color-text-muted);font-size:var(--ui-font-size-sm)}\n"] }]
        }], propDecorators: { items: [{ type: i0.Input, args: [{ isSignal: true, alias: "items", required: false }] }], separator: [{ type: i0.Input, args: [{ isSignal: true, alias: "separator", required: false }] }], navigate: [{ type: i0.Output, args: ["navigate"] }] } });

/** `ui-stepper` — horizontal progress through ordered steps. */
class UiStepper {
    steps = input([], /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "steps" }] : /* istanbul ignore next */ []));
    active = input(0, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "active" }] : /* istanbul ignore next */ []));
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiStepper, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "22.0.4", type: UiStepper, isStandalone: true, selector: "ui-stepper", inputs: { steps: { classPropertyName: "steps", publicName: "steps", isSignal: true, isRequired: false, transformFunction: null }, active: { classPropertyName: "active", publicName: "active", isSignal: true, isRequired: false, transformFunction: null } }, ngImport: i0, template: `
    <ol class="ui-stepper">
      @for (step of steps(); track $index; let i = $index, last = $last) {
        <li class="step" [class.done]="i < active()" [class.active]="i === active()">
          <span class="marker" aria-hidden="true">
            @if (i < active()) { ✓ } @else { {{ i + 1 }} }
          </span>
          <span class="text">
            <span class="label">{{ step.label }}</span>
            @if (step.description) { <span class="desc">{{ step.description }}</span> }
          </span>
          @if (!last) { <span class="bar" aria-hidden="true"></span> }
        </li>
      }
    </ol>
  `, isInline: true, styles: [":host{display:block}.ui-stepper{display:flex;margin:0;padding:0;list-style:none;font-family:var(--ui-font-default)}.step{display:flex;align-items:center;gap:var(--ui-space-2);flex:1}.step:last-child{flex:0}.marker{display:inline-flex;align-items:center;justify-content:center;flex:none;width:24px;height:24px;border-radius:50%;border:1px solid var(--ui-color-border);background:var(--ui-color-surface);color:var(--ui-color-text-muted);font-size:var(--ui-font-size-sm);font-weight:600}.step.active .marker{border-color:var(--ui-color-primary);color:var(--ui-color-primary)}.step.done .marker{background:var(--ui-color-primary);border-color:transparent;color:var(--ui-color-primary-contrast)}.text{display:flex;flex-direction:column}.label{font-size:var(--ui-font-size-sm);color:var(--ui-color-text);font-weight:500}.step.active .label{color:var(--ui-color-text)}.desc{font-size:12px;color:var(--ui-color-text-muted)}.bar{flex:1;height:1px;min-width:var(--ui-space-4);background:var(--ui-color-border);margin:0 var(--ui-space-2)}.step.done .bar{background:var(--ui-color-primary)}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiStepper, decorators: [{
            type: Component,
            args: [{ selector: 'ui-stepper', template: `
    <ol class="ui-stepper">
      @for (step of steps(); track $index; let i = $index, last = $last) {
        <li class="step" [class.done]="i < active()" [class.active]="i === active()">
          <span class="marker" aria-hidden="true">
            @if (i < active()) { ✓ } @else { {{ i + 1 }} }
          </span>
          <span class="text">
            <span class="label">{{ step.label }}</span>
            @if (step.description) { <span class="desc">{{ step.description }}</span> }
          </span>
          @if (!last) { <span class="bar" aria-hidden="true"></span> }
        </li>
      }
    </ol>
  `, styles: [":host{display:block}.ui-stepper{display:flex;margin:0;padding:0;list-style:none;font-family:var(--ui-font-default)}.step{display:flex;align-items:center;gap:var(--ui-space-2);flex:1}.step:last-child{flex:0}.marker{display:inline-flex;align-items:center;justify-content:center;flex:none;width:24px;height:24px;border-radius:50%;border:1px solid var(--ui-color-border);background:var(--ui-color-surface);color:var(--ui-color-text-muted);font-size:var(--ui-font-size-sm);font-weight:600}.step.active .marker{border-color:var(--ui-color-primary);color:var(--ui-color-primary)}.step.done .marker{background:var(--ui-color-primary);border-color:transparent;color:var(--ui-color-primary-contrast)}.text{display:flex;flex-direction:column}.label{font-size:var(--ui-font-size-sm);color:var(--ui-color-text);font-weight:500}.step.active .label{color:var(--ui-color-text)}.desc{font-size:12px;color:var(--ui-color-text-muted)}.bar{flex:1;height:1px;min-width:var(--ui-space-4);background:var(--ui-color-border);margin:0 var(--ui-space-2)}.step.done .bar{background:var(--ui-color-primary)}\n"] }]
        }], propDecorators: { steps: [{ type: i0.Input, args: [{ isSignal: true, alias: "steps", required: false }] }], active: [{ type: i0.Input, args: [{ isSignal: true, alias: "active", required: false }] }] } });

/** `ui-bottom-nav` — mobile-style bottom navigation bar (glass-capable). */
class UiBottomNav {
    config = inject(UI_CONFIG);
    items = input([], /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "items" }] : /* istanbul ignore next */ []));
    active = model('', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "active" }] : /* istanbul ignore next */ []));
    glass = input(this.config.glass, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "glass" }] : /* istanbul ignore next */ []));
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiBottomNav, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "22.0.4", type: UiBottomNav, isStandalone: true, selector: "ui-bottom-nav", inputs: { items: { classPropertyName: "items", publicName: "items", isSignal: true, isRequired: false, transformFunction: null }, active: { classPropertyName: "active", publicName: "active", isSignal: true, isRequired: false, transformFunction: null }, glass: { classPropertyName: "glass", publicName: "glass", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { active: "activeChange" }, ngImport: i0, template: `
    <nav class="bn" [class.glass]="glass()" role="tablist">
      @for (item of items(); track item.value) {
        <button type="button" class="item" role="tab" [class.active]="item.value === active()"
                [attr.aria-selected]="item.value === active()" (click)="active.set(item.value)">
          <span class="icon" aria-hidden="true">
            {{ item.icon }}
            @if (item.badge) { <span class="badge">{{ item.badge }}</span> }
          </span>
          <span class="label">{{ item.label }}</span>
        </button>
      }
    </nav>
  `, isInline: true, styles: [":host{display:block}.bn{display:flex;align-items:stretch;height:56px;background:var(--ui-color-surface);border:1px solid var(--ui-color-border);border-radius:var(--ui-radius);overflow:hidden;font-family:var(--ui-font-default)}.bn.glass{background:var(--ui-glass-bg);-webkit-backdrop-filter:blur(var(--ui-glass-blur));backdrop-filter:blur(var(--ui-glass-blur));border-color:var(--ui-glass-border)}.item{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;background:none;border:none;cursor:pointer;color:var(--ui-color-text-muted);font:inherit}.item.active{color:var(--ui-color-primary)}.item:focus-visible{outline:none;box-shadow:var(--ui-focus-ring)}.icon{position:relative;font-size:18px}.badge{position:absolute;top:-4px;right:-8px;min-width:14px;height:14px;padding:0 3px;box-sizing:border-box;background:var(--ui-color-danger);color:#fff;border-radius:999px;font-size:9px;line-height:14px;text-align:center}.label{font-size:11px}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiBottomNav, decorators: [{
            type: Component,
            args: [{ selector: 'ui-bottom-nav', template: `
    <nav class="bn" [class.glass]="glass()" role="tablist">
      @for (item of items(); track item.value) {
        <button type="button" class="item" role="tab" [class.active]="item.value === active()"
                [attr.aria-selected]="item.value === active()" (click)="active.set(item.value)">
          <span class="icon" aria-hidden="true">
            {{ item.icon }}
            @if (item.badge) { <span class="badge">{{ item.badge }}</span> }
          </span>
          <span class="label">{{ item.label }}</span>
        </button>
      }
    </nav>
  `, styles: [":host{display:block}.bn{display:flex;align-items:stretch;height:56px;background:var(--ui-color-surface);border:1px solid var(--ui-color-border);border-radius:var(--ui-radius);overflow:hidden;font-family:var(--ui-font-default)}.bn.glass{background:var(--ui-glass-bg);-webkit-backdrop-filter:blur(var(--ui-glass-blur));backdrop-filter:blur(var(--ui-glass-blur));border-color:var(--ui-glass-border)}.item{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;background:none;border:none;cursor:pointer;color:var(--ui-color-text-muted);font:inherit}.item.active{color:var(--ui-color-primary)}.item:focus-visible{outline:none;box-shadow:var(--ui-focus-ring)}.icon{position:relative;font-size:18px}.badge{position:absolute;top:-4px;right:-8px;min-width:14px;height:14px;padding:0 3px;box-sizing:border-box;background:var(--ui-color-danger);color:#fff;border-radius:999px;font-size:9px;line-height:14px;text-align:center}.label{font-size:11px}\n"] }]
        }], propDecorators: { items: [{ type: i0.Input, args: [{ isSignal: true, alias: "items", required: false }] }], active: [{ type: i0.Input, args: [{ isSignal: true, alias: "active", required: false }] }, { type: i0.Output, args: ["activeChange"] }], glass: [{ type: i0.Input, args: [{ isSignal: true, alias: "glass", required: false }] }] } });

/** `ui-anchor-nav` — scrollspy navigation: highlights the section in view and scrolls to it on click. */
class UiAnchorNav {
    doc = inject(DOCUMENT);
    zone = inject(NgZone);
    items = input([], /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "items" }] : /* istanbul ignore next */ []));
    /** CSS scroll-margin offset applied when scrolling to a section. */
    offset = input(80, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "offset" }] : /* istanbul ignore next */ []));
    active = signal('', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "active" }] : /* istanbul ignore next */ []));
    observer;
    ngOnInit() {
        this.observer = new IntersectionObserver((entries) => {
            for (const entry of entries) {
                if (entry.isIntersecting)
                    this.zone.run(() => this.active.set(entry.target.id));
            }
        }, { rootMargin: `-${this.offset()}px 0px -65% 0px` });
        queueMicrotask(() => {
            for (const item of this.items()) {
                const el = this.doc.getElementById(item.id);
                if (el)
                    this.observer.observe(el);
            }
        });
    }
    ngOnDestroy() { this.observer?.disconnect(); }
    scrollTo(id) {
        this.doc.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        this.active.set(id);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiAnchorNav, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "22.0.4", type: UiAnchorNav, isStandalone: true, selector: "ui-anchor-nav", inputs: { items: { classPropertyName: "items", publicName: "items", isSignal: true, isRequired: false, transformFunction: null }, offset: { classPropertyName: "offset", publicName: "offset", isSignal: true, isRequired: false, transformFunction: null } }, ngImport: i0, template: `
    <nav class="an" aria-label="On this page">
      <ul>
        @for (item of items(); track item.id) {
          <li>
            <button type="button" class="link" [class.active]="item.id === active()" (click)="scrollTo(item.id)">{{ item.label }}</button>
          </li>
        }
      </ul>
    </nav>
  `, isInline: true, styles: [":host{display:block}ul{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:2px;border-left:1px solid var(--ui-color-border)}.link{display:block;width:100%;text-align:left;padding:var(--ui-space-1) var(--ui-space-3);background:none;border:none;border-left:2px solid transparent;margin-left:-1px;cursor:pointer;font-family:var(--ui-font-default);font-size:var(--ui-font-size-sm);color:var(--ui-color-text-muted)}.link:hover{color:var(--ui-color-text)}.link.active{color:var(--ui-color-primary);border-left-color:var(--ui-color-primary)}.link:focus-visible{outline:none;box-shadow:var(--ui-focus-ring)}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiAnchorNav, decorators: [{
            type: Component,
            args: [{ selector: 'ui-anchor-nav', template: `
    <nav class="an" aria-label="On this page">
      <ul>
        @for (item of items(); track item.id) {
          <li>
            <button type="button" class="link" [class.active]="item.id === active()" (click)="scrollTo(item.id)">{{ item.label }}</button>
          </li>
        }
      </ul>
    </nav>
  `, styles: [":host{display:block}ul{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:2px;border-left:1px solid var(--ui-color-border)}.link{display:block;width:100%;text-align:left;padding:var(--ui-space-1) var(--ui-space-3);background:none;border:none;border-left:2px solid transparent;margin-left:-1px;cursor:pointer;font-family:var(--ui-font-default);font-size:var(--ui-font-size-sm);color:var(--ui-color-text-muted)}.link:hover{color:var(--ui-color-text)}.link.active{color:var(--ui-color-primary);border-left-color:var(--ui-color-primary)}.link:focus-visible{outline:none;box-shadow:var(--ui-focus-ring)}\n"] }]
        }], propDecorators: { items: [{ type: i0.Input, args: [{ isSignal: true, alias: "items", required: false }] }], offset: [{ type: i0.Input, args: [{ isSignal: true, alias: "offset", required: false }] }] } });

/** `ui-menubar` — application-style horizontal menu bar with dropdown menus (one open at a time). */
class UiMenubar {
    menus = input([], /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "menus" }] : /* istanbul ignore next */ []));
    select = output();
    openIndex = signal(null, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "openIndex" }] : /* istanbul ignore next */ []));
    positions = [
        { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' },
    ];
    toggle(i) { this.openIndex.update((cur) => (cur === i ? null : i)); }
    hoverOpen(i) { if (this.openIndex() !== null)
        this.openIndex.set(i); }
    choose(item) {
        if (item.disabled)
            return;
        this.select.emit(item);
        this.openIndex.set(null);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiMenubar, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "22.0.4", type: UiMenubar, isStandalone: true, selector: "ui-menubar", inputs: { menus: { classPropertyName: "menus", publicName: "menus", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { select: "select" }, ngImport: i0, template: `
    <div class="mb" role="menubar">
      @for (menu of menus(); track menu.label; let i = $index) {
        <button type="button" class="top" role="menuitem" cdkOverlayOrigin #o="cdkOverlayOrigin"
                [class.open]="openIndex() === i" (click)="toggle(i)" (mouseenter)="hoverOpen(i)">
          {{ menu.label }}
        </button>
        <ng-template cdkConnectedOverlay [cdkConnectedOverlayOrigin]="o" [cdkConnectedOverlayOpen]="openIndex() === i"
                     [cdkConnectedOverlayPositions]="positions" (overlayOutsideClick)="openIndex.set(null)">
          <div class="panel" role="menu">
            @for (item of menu.items; track item.value) {
              <button type="button" role="menuitem" class="mi" [disabled]="item.disabled" (click)="choose(item)">{{ item.label }}</button>
            }
          </div>
        </ng-template>
      }
    </div>
  `, isInline: true, styles: [":host{display:block}.mb{display:flex;gap:2px;background:var(--ui-color-surface);border:1px solid var(--ui-color-border);border-radius:var(--ui-radius);padding:2px;font-family:var(--ui-font-default)}.top{padding:var(--ui-space-1) var(--ui-space-3);background:none;border:none;border-radius:5px;cursor:pointer;color:var(--ui-color-text);font:inherit;font-size:var(--ui-font-size-sm)}.top:hover,.top.open{background:var(--ui-color-surface-raised)}.top:focus-visible{outline:none;box-shadow:var(--ui-focus-ring)}.panel{display:flex;flex-direction:column;min-width:160px;margin-top:4px;padding:var(--ui-space-1);background:var(--ui-color-surface-raised);border:1px solid var(--ui-color-border);border-radius:var(--ui-radius);box-shadow:var(--ui-shadow-2)}.mi{padding:var(--ui-space-2) var(--ui-space-3);background:none;border:none;border-radius:6px;text-align:left;cursor:pointer;color:var(--ui-color-text);font:inherit;font-size:var(--ui-font-size-md)}.mi:hover:not(:disabled){background:color-mix(in srgb,var(--ui-color-primary) 18%,transparent)}.mi:disabled{opacity:.5;cursor:not-allowed}\n"], dependencies: [{ kind: "directive", type: CdkOverlayOrigin, selector: "[cdk-overlay-origin], [overlay-origin], [cdkOverlayOrigin]", exportAs: ["cdkOverlayOrigin"] }, { kind: "directive", type: CdkConnectedOverlay, selector: "[cdk-connected-overlay], [connected-overlay], [cdkConnectedOverlay]", inputs: ["cdkConnectedOverlayOrigin", "cdkConnectedOverlayPositions", "cdkConnectedOverlayPositionStrategy", "cdkConnectedOverlayOffsetX", "cdkConnectedOverlayOffsetY", "cdkConnectedOverlayWidth", "cdkConnectedOverlayHeight", "cdkConnectedOverlayMinWidth", "cdkConnectedOverlayMinHeight", "cdkConnectedOverlayBackdropClass", "cdkConnectedOverlayPanelClass", "cdkConnectedOverlayViewportMargin", "cdkConnectedOverlayScrollStrategy", "cdkConnectedOverlayOpen", "cdkConnectedOverlayDisableClose", "cdkConnectedOverlayTransformOriginOn", "cdkConnectedOverlayHasBackdrop", "cdkConnectedOverlayLockPosition", "cdkConnectedOverlayFlexibleDimensions", "cdkConnectedOverlayGrowAfterOpen", "cdkConnectedOverlayPush", "cdkConnectedOverlayDisposeOnNavigation", "cdkConnectedOverlayUsePopover", "cdkConnectedOverlayMatchWidth", "cdkConnectedOverlay"], outputs: ["backdropClick", "positionChange", "attach", "detach", "overlayKeydown", "overlayOutsideClick"], exportAs: ["cdkConnectedOverlay"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiMenubar, decorators: [{
            type: Component,
            args: [{ selector: 'ui-menubar', imports: [CdkOverlayOrigin, CdkConnectedOverlay], template: `
    <div class="mb" role="menubar">
      @for (menu of menus(); track menu.label; let i = $index) {
        <button type="button" class="top" role="menuitem" cdkOverlayOrigin #o="cdkOverlayOrigin"
                [class.open]="openIndex() === i" (click)="toggle(i)" (mouseenter)="hoverOpen(i)">
          {{ menu.label }}
        </button>
        <ng-template cdkConnectedOverlay [cdkConnectedOverlayOrigin]="o" [cdkConnectedOverlayOpen]="openIndex() === i"
                     [cdkConnectedOverlayPositions]="positions" (overlayOutsideClick)="openIndex.set(null)">
          <div class="panel" role="menu">
            @for (item of menu.items; track item.value) {
              <button type="button" role="menuitem" class="mi" [disabled]="item.disabled" (click)="choose(item)">{{ item.label }}</button>
            }
          </div>
        </ng-template>
      }
    </div>
  `, styles: [":host{display:block}.mb{display:flex;gap:2px;background:var(--ui-color-surface);border:1px solid var(--ui-color-border);border-radius:var(--ui-radius);padding:2px;font-family:var(--ui-font-default)}.top{padding:var(--ui-space-1) var(--ui-space-3);background:none;border:none;border-radius:5px;cursor:pointer;color:var(--ui-color-text);font:inherit;font-size:var(--ui-font-size-sm)}.top:hover,.top.open{background:var(--ui-color-surface-raised)}.top:focus-visible{outline:none;box-shadow:var(--ui-focus-ring)}.panel{display:flex;flex-direction:column;min-width:160px;margin-top:4px;padding:var(--ui-space-1);background:var(--ui-color-surface-raised);border:1px solid var(--ui-color-border);border-radius:var(--ui-radius);box-shadow:var(--ui-shadow-2)}.mi{padding:var(--ui-space-2) var(--ui-space-3);background:none;border:none;border-radius:6px;text-align:left;cursor:pointer;color:var(--ui-color-text);font:inherit;font-size:var(--ui-font-size-md)}.mi:hover:not(:disabled){background:color-mix(in srgb,var(--ui-color-primary) 18%,transparent)}.mi:disabled{opacity:.5;cursor:not-allowed}\n"] }]
        }], propDecorators: { menus: [{ type: i0.Input, args: [{ isSignal: true, alias: "menus", required: false }] }], select: [{ type: i0.Output, args: ["select"] }] } });

/**
 * `ui-side-nav` — vertical, grouped navigation rail (docs/app sidebar). Bind
 * `[(active)]` to the selected value and listen to `(navigate)`. Router-
 * agnostic: map the emitted item to a route yourself.
 */
class UiSideNav {
    groups = input([], /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "groups" }] : /* istanbul ignore next */ []));
    active = model('', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "active" }] : /* istanbul ignore next */ []));
    label = input('Sidebar', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "label" }] : /* istanbul ignore next */ []));
    navigate = output();
    choose(item) {
        if (item.disabled)
            return;
        this.active.set(item.value);
        this.navigate.emit(item);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiSideNav, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "22.0.4", type: UiSideNav, isStandalone: true, selector: "ui-side-nav", inputs: { groups: { classPropertyName: "groups", publicName: "groups", isSignal: true, isRequired: false, transformFunction: null }, active: { classPropertyName: "active", publicName: "active", isSignal: true, isRequired: false, transformFunction: null }, label: { classPropertyName: "label", publicName: "label", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { active: "activeChange", navigate: "navigate" }, ngImport: i0, template: `
    <nav class="ui-side-nav" [attr.aria-label]="label()">
      @for (group of groups(); track $index) {
        <div class="group">
          @if (group.label) { <div class="group-label">{{ group.label }}</div> }
          <ul role="list">
            @for (item of group.items; track item.value) {
              <li>
                <button
                  type="button"
                  class="item"
                  [class.active]="item.value === active()"
                  [attr.aria-current]="item.value === active() ? 'page' : null"
                  [disabled]="item.disabled"
                  (click)="choose(item)">
                  @if (item.icon) { <span class="icon" aria-hidden="true">{{ item.icon }}</span> }
                  <span class="label">{{ item.label }}</span>
                  @if (item.badge != null) { <span class="badge">{{ item.badge }}</span> }
                </button>
              </li>
            }
          </ul>
        </div>
      }
    </nav>
  `, isInline: true, styles: [":host{display:block}.ui-side-nav{display:flex;flex-direction:column;gap:var(--ui-space-4);font-family:var(--ui-font-default)}.group{display:flex;flex-direction:column;gap:var(--ui-space-1)}.group-label{font-family:var(--ui-font-mono);font-size:11px;text-transform:uppercase;letter-spacing:.16em;color:var(--ui-color-text-muted);padding:0 var(--ui-space-2);margin-bottom:2px}ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:1px}.item{position:relative;display:flex;align-items:center;gap:var(--ui-space-2);width:100%;padding:var(--ui-space-1) var(--ui-space-3);background:none;border:none;border-radius:7px;color:var(--ui-color-text-muted);font:inherit;font-size:var(--ui-font-size-sm);text-align:left;cursor:pointer;transition:background var(--ui-motion-fast) var(--ui-ease-standard),color var(--ui-motion-fast) var(--ui-ease-standard)}.item:hover:not(:disabled){background:var(--ui-color-surface-raised);color:var(--ui-color-text)}.item.active{background:color-mix(in srgb,var(--ui-color-primary) 16%,transparent);color:var(--ui-color-text);font-weight:600}.item.active:before{content:\"\";position:absolute;left:0;top:6px;bottom:6px;width:2px;border-radius:2px;background:var(--ui-color-primary)}.item:focus-visible{outline:none;box-shadow:var(--ui-focus-ring)}.item:disabled{opacity:.5;cursor:not-allowed}.icon{width:18px;text-align:center}.label{flex:1;min-width:0}.badge{font-size:10px;font-family:var(--ui-font-mono);padding:1px 6px;border-radius:999px;background:var(--ui-color-surface-raised);color:var(--ui-color-text-muted)}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiSideNav, decorators: [{
            type: Component,
            args: [{ selector: 'ui-side-nav', template: `
    <nav class="ui-side-nav" [attr.aria-label]="label()">
      @for (group of groups(); track $index) {
        <div class="group">
          @if (group.label) { <div class="group-label">{{ group.label }}</div> }
          <ul role="list">
            @for (item of group.items; track item.value) {
              <li>
                <button
                  type="button"
                  class="item"
                  [class.active]="item.value === active()"
                  [attr.aria-current]="item.value === active() ? 'page' : null"
                  [disabled]="item.disabled"
                  (click)="choose(item)">
                  @if (item.icon) { <span class="icon" aria-hidden="true">{{ item.icon }}</span> }
                  <span class="label">{{ item.label }}</span>
                  @if (item.badge != null) { <span class="badge">{{ item.badge }}</span> }
                </button>
              </li>
            }
          </ul>
        </div>
      }
    </nav>
  `, styles: [":host{display:block}.ui-side-nav{display:flex;flex-direction:column;gap:var(--ui-space-4);font-family:var(--ui-font-default)}.group{display:flex;flex-direction:column;gap:var(--ui-space-1)}.group-label{font-family:var(--ui-font-mono);font-size:11px;text-transform:uppercase;letter-spacing:.16em;color:var(--ui-color-text-muted);padding:0 var(--ui-space-2);margin-bottom:2px}ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:1px}.item{position:relative;display:flex;align-items:center;gap:var(--ui-space-2);width:100%;padding:var(--ui-space-1) var(--ui-space-3);background:none;border:none;border-radius:7px;color:var(--ui-color-text-muted);font:inherit;font-size:var(--ui-font-size-sm);text-align:left;cursor:pointer;transition:background var(--ui-motion-fast) var(--ui-ease-standard),color var(--ui-motion-fast) var(--ui-ease-standard)}.item:hover:not(:disabled){background:var(--ui-color-surface-raised);color:var(--ui-color-text)}.item.active{background:color-mix(in srgb,var(--ui-color-primary) 16%,transparent);color:var(--ui-color-text);font-weight:600}.item.active:before{content:\"\";position:absolute;left:0;top:6px;bottom:6px;width:2px;border-radius:2px;background:var(--ui-color-primary)}.item:focus-visible{outline:none;box-shadow:var(--ui-focus-ring)}.item:disabled{opacity:.5;cursor:not-allowed}.icon{width:18px;text-align:center}.label{flex:1;min-width:0}.badge{font-size:10px;font-family:var(--ui-font-mono);padding:1px 6px;border-radius:999px;background:var(--ui-color-surface-raised);color:var(--ui-color-text-muted)}\n"] }]
        }], propDecorators: { groups: [{ type: i0.Input, args: [{ isSignal: true, alias: "groups", required: false }] }], active: [{ type: i0.Input, args: [{ isSignal: true, alias: "active", required: false }] }, { type: i0.Output, args: ["activeChange"] }], label: [{ type: i0.Input, args: [{ isSignal: true, alias: "label", required: false }] }], navigate: [{ type: i0.Output, args: ["navigate"] }] } });

/**
 * Generated bundle index. Do not edit.
 */

export { UiAnchorNav, UiBottomNav, UiBreadcrumbs, UiMenubar, UiNavbar, UiPagination, UiSideNav, UiStepper };
//# sourceMappingURL=ui-navigation.mjs.map
