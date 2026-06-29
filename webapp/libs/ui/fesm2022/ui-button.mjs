import * as i0 from '@angular/core';
import { inject, input, Component, model, output, signal } from '@angular/core';
import { UI_CONFIG } from 'ui';
import { CdkOverlayOrigin, CdkConnectedOverlay } from '@angular/cdk/overlay';

/**
 * `ui-button` — the action primitive. Wires `glass`/`radius` to the global
 * UiConfig defaults (overridable per instance) and uses only design tokens.
 */
class UiButton {
    config = inject(UI_CONFIG);
    variant = input('primary', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "variant" }] : /* istanbul ignore next */ []));
    size = input('md', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "size" }] : /* istanbul ignore next */ []));
    type = input('button', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "type" }] : /* istanbul ignore next */ []));
    disabled = input(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "disabled" }] : /* istanbul ignore next */ []));
    loading = input(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "loading" }] : /* istanbul ignore next */ []));
    block = input(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "block" }] : /* istanbul ignore next */ []));
    /** Opt-in glass treatment. Buttons are solid by default (not driven by the
     *  global glass config, which targets surface components only). */
    glass = input(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "glass" }] : /* istanbul ignore next */ []));
    radius = input(this.config.radius, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "radius" }] : /* istanbul ignore next */ []));
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiButton, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "22.0.4", type: UiButton, isStandalone: true, selector: "ui-button", inputs: { variant: { classPropertyName: "variant", publicName: "variant", isSignal: true, isRequired: false, transformFunction: null }, size: { classPropertyName: "size", publicName: "size", isSignal: true, isRequired: false, transformFunction: null }, type: { classPropertyName: "type", publicName: "type", isSignal: true, isRequired: false, transformFunction: null }, disabled: { classPropertyName: "disabled", publicName: "disabled", isSignal: true, isRequired: false, transformFunction: null }, loading: { classPropertyName: "loading", publicName: "loading", isSignal: true, isRequired: false, transformFunction: null }, block: { classPropertyName: "block", publicName: "block", isSignal: true, isRequired: false, transformFunction: null }, glass: { classPropertyName: "glass", publicName: "glass", isSignal: true, isRequired: false, transformFunction: null }, radius: { classPropertyName: "radius", publicName: "radius", isSignal: true, isRequired: false, transformFunction: null } }, host: { properties: { "class.block-host": "block()" } }, ngImport: i0, template: `
    <button
      class="ui-btn"
      [class.glass]="glass()"
      [class.no-radius]="!radius()"
      [class.block]="block()"
      [attr.type]="type()"
      [attr.data-variant]="variant()"
      [attr.data-size]="size()"
      [disabled]="disabled() || loading()"
      [attr.aria-busy]="loading() || null">
      @if (loading()) { <span class="spin" aria-hidden="true"></span> }
      <ng-content />
    </button>
  `, isInline: true, styles: [":host{display:inline-flex}:host(.block-host),.ui-btn.block{width:100%}.ui-btn{display:inline-flex;align-items:center;justify-content:center;gap:var(--ui-space-2);height:var(--ui-size-md);padding:0 var(--ui-space-4);border:1px solid var(--ui-color-border);border-radius:var(--ui-radius);background:var(--ui-color-surface);color:var(--ui-color-text);font-family:var(--ui-font-default);font-size:14px;font-weight:500;letter-spacing:-.01em;cursor:pointer;white-space:nowrap;transition:background var(--ui-motion-base) var(--ui-ease-standard),border-color var(--ui-motion-base) var(--ui-ease-standard),transform var(--ui-motion-fast) var(--ui-ease-standard),opacity var(--ui-motion-base) var(--ui-ease-standard)}.ui-btn:hover:not(:disabled){background:var(--ui-color-surface-raised)}.ui-btn:active:not(:disabled){transform:scale(.98)}.ui-btn:focus-visible{outline:none;box-shadow:var(--ui-focus-ring)}.ui-btn:disabled{opacity:.5;cursor:not-allowed}.ui-btn.no-radius{border-radius:0}.ui-btn.glass{background:var(--ui-glass-bg);-webkit-backdrop-filter:blur(var(--ui-glass-blur));backdrop-filter:blur(var(--ui-glass-blur));border-color:var(--ui-glass-border)}.ui-btn[data-size=sm]{height:var(--ui-size-sm);font-size:13px;padding:0 var(--ui-space-3)}.ui-btn[data-size=lg]{height:var(--ui-size-lg);font-size:15px;padding:0 var(--ui-space-6)}.ui-btn[data-variant=primary]{background:var(--ui-color-primary);color:var(--ui-color-primary-contrast);border-color:transparent}.ui-btn[data-variant=primary]:hover:not(:disabled){background:var(--ui-color-primary-hover)}.ui-btn[data-variant=secondary]{background:var(--ui-color-secondary);color:#fff;border-color:transparent}.ui-btn[data-variant=secondary]:hover:not(:disabled){background:color-mix(in srgb,var(--ui-color-secondary) 85%,#fff)}.ui-btn[data-variant=outline]{background:transparent}.ui-btn[data-variant=destructive]{background:var(--ui-color-danger);color:#fff;border-color:transparent}.ui-btn[data-variant=destructive]:hover:not(:disabled){background:color-mix(in srgb,var(--ui-color-danger) 88%,#fff)}.ui-btn[data-variant=ghost]{background:transparent;border-color:transparent}.ui-btn[data-variant=link]{background:transparent;border-color:transparent;color:var(--ui-color-primary);text-decoration:underline;padding:0;height:auto}.ui-btn[data-variant=link]:hover:not(:disabled){background:transparent;color:var(--ui-color-primary-hover)}.spin{width:1em;height:1em;border-radius:50%;border:2px solid currentColor;border-right-color:transparent;animation:ui-btn-spin var(--ui-motion-slow) linear infinite}@keyframes ui-btn-spin{to{transform:rotate(360deg)}}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiButton, decorators: [{
            type: Component,
            args: [{ selector: 'ui-button', template: `
    <button
      class="ui-btn"
      [class.glass]="glass()"
      [class.no-radius]="!radius()"
      [class.block]="block()"
      [attr.type]="type()"
      [attr.data-variant]="variant()"
      [attr.data-size]="size()"
      [disabled]="disabled() || loading()"
      [attr.aria-busy]="loading() || null">
      @if (loading()) { <span class="spin" aria-hidden="true"></span> }
      <ng-content />
    </button>
  `, host: { '[class.block-host]': 'block()' }, styles: [":host{display:inline-flex}:host(.block-host),.ui-btn.block{width:100%}.ui-btn{display:inline-flex;align-items:center;justify-content:center;gap:var(--ui-space-2);height:var(--ui-size-md);padding:0 var(--ui-space-4);border:1px solid var(--ui-color-border);border-radius:var(--ui-radius);background:var(--ui-color-surface);color:var(--ui-color-text);font-family:var(--ui-font-default);font-size:14px;font-weight:500;letter-spacing:-.01em;cursor:pointer;white-space:nowrap;transition:background var(--ui-motion-base) var(--ui-ease-standard),border-color var(--ui-motion-base) var(--ui-ease-standard),transform var(--ui-motion-fast) var(--ui-ease-standard),opacity var(--ui-motion-base) var(--ui-ease-standard)}.ui-btn:hover:not(:disabled){background:var(--ui-color-surface-raised)}.ui-btn:active:not(:disabled){transform:scale(.98)}.ui-btn:focus-visible{outline:none;box-shadow:var(--ui-focus-ring)}.ui-btn:disabled{opacity:.5;cursor:not-allowed}.ui-btn.no-radius{border-radius:0}.ui-btn.glass{background:var(--ui-glass-bg);-webkit-backdrop-filter:blur(var(--ui-glass-blur));backdrop-filter:blur(var(--ui-glass-blur));border-color:var(--ui-glass-border)}.ui-btn[data-size=sm]{height:var(--ui-size-sm);font-size:13px;padding:0 var(--ui-space-3)}.ui-btn[data-size=lg]{height:var(--ui-size-lg);font-size:15px;padding:0 var(--ui-space-6)}.ui-btn[data-variant=primary]{background:var(--ui-color-primary);color:var(--ui-color-primary-contrast);border-color:transparent}.ui-btn[data-variant=primary]:hover:not(:disabled){background:var(--ui-color-primary-hover)}.ui-btn[data-variant=secondary]{background:var(--ui-color-secondary);color:#fff;border-color:transparent}.ui-btn[data-variant=secondary]:hover:not(:disabled){background:color-mix(in srgb,var(--ui-color-secondary) 85%,#fff)}.ui-btn[data-variant=outline]{background:transparent}.ui-btn[data-variant=destructive]{background:var(--ui-color-danger);color:#fff;border-color:transparent}.ui-btn[data-variant=destructive]:hover:not(:disabled){background:color-mix(in srgb,var(--ui-color-danger) 88%,#fff)}.ui-btn[data-variant=ghost]{background:transparent;border-color:transparent}.ui-btn[data-variant=link]{background:transparent;border-color:transparent;color:var(--ui-color-primary);text-decoration:underline;padding:0;height:auto}.ui-btn[data-variant=link]:hover:not(:disabled){background:transparent;color:var(--ui-color-primary-hover)}.spin{width:1em;height:1em;border-radius:50%;border:2px solid currentColor;border-right-color:transparent;animation:ui-btn-spin var(--ui-motion-slow) linear infinite}@keyframes ui-btn-spin{to{transform:rotate(360deg)}}\n"] }]
        }], propDecorators: { variant: [{ type: i0.Input, args: [{ isSignal: true, alias: "variant", required: false }] }], size: [{ type: i0.Input, args: [{ isSignal: true, alias: "size", required: false }] }], type: [{ type: i0.Input, args: [{ isSignal: true, alias: "type", required: false }] }], disabled: [{ type: i0.Input, args: [{ isSignal: true, alias: "disabled", required: false }] }], loading: [{ type: i0.Input, args: [{ isSignal: true, alias: "loading", required: false }] }], block: [{ type: i0.Input, args: [{ isSignal: true, alias: "block", required: false }] }], glass: [{ type: i0.Input, args: [{ isSignal: true, alias: "glass", required: false }] }], radius: [{ type: i0.Input, args: [{ isSignal: true, alias: "radius", required: false }] }] } });

/**
 * `ui-icon-button` — square, icon-only action. `label` is REQUIRED and applied
 * as `aria-label` so the control is named for assistive tech (WCAG).
 */
class UiIconButton {
    config = inject(UI_CONFIG);
    /** Accessible name for the icon-only control (required for a11y). */
    label = input.required(/* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "label" }] : /* istanbul ignore next */ []));
    variant = input('ghost', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "variant" }] : /* istanbul ignore next */ []));
    size = input('md', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "size" }] : /* istanbul ignore next */ []));
    type = input('button', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "type" }] : /* istanbul ignore next */ []));
    disabled = input(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "disabled" }] : /* istanbul ignore next */ []));
    round = input(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "round" }] : /* istanbul ignore next */ []));
    /** Opt-in glass treatment; solid by default (see UiButton). */
    glass = input(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "glass" }] : /* istanbul ignore next */ []));
    radius = input(this.config.radius, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "radius" }] : /* istanbul ignore next */ []));
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiIconButton, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.1.0", version: "22.0.4", type: UiIconButton, isStandalone: true, selector: "ui-icon-button", inputs: { label: { classPropertyName: "label", publicName: "label", isSignal: true, isRequired: true, transformFunction: null }, variant: { classPropertyName: "variant", publicName: "variant", isSignal: true, isRequired: false, transformFunction: null }, size: { classPropertyName: "size", publicName: "size", isSignal: true, isRequired: false, transformFunction: null }, type: { classPropertyName: "type", publicName: "type", isSignal: true, isRequired: false, transformFunction: null }, disabled: { classPropertyName: "disabled", publicName: "disabled", isSignal: true, isRequired: false, transformFunction: null }, round: { classPropertyName: "round", publicName: "round", isSignal: true, isRequired: false, transformFunction: null }, glass: { classPropertyName: "glass", publicName: "glass", isSignal: true, isRequired: false, transformFunction: null }, radius: { classPropertyName: "radius", publicName: "radius", isSignal: true, isRequired: false, transformFunction: null } }, ngImport: i0, template: `
    <button
      class="ui-icon-btn"
      [class.glass]="glass()"
      [class.no-radius]="!radius()"
      [class.round]="round()"
      [attr.type]="type()"
      [attr.data-variant]="variant()"
      [attr.data-size]="size()"
      [attr.aria-label]="label()"
      [disabled]="disabled()">
      <ng-content />
    </button>
  `, isInline: true, styles: [":host{display:inline-flex}.ui-icon-btn{display:inline-flex;align-items:center;justify-content:center;width:var(--ui-size-md);height:var(--ui-size-md);border:1px solid var(--ui-color-border);border-radius:var(--ui-radius);background:var(--ui-color-surface);color:var(--ui-color-text);cursor:pointer;transition:background var(--ui-motion-base) var(--ui-ease-standard),transform var(--ui-motion-fast) var(--ui-ease-standard)}.ui-icon-btn:hover:not(:disabled){filter:brightness(1.1)}.ui-icon-btn:active:not(:disabled){transform:scale(.94)}.ui-icon-btn:focus-visible{outline:none;box-shadow:var(--ui-focus-ring)}.ui-icon-btn:disabled{opacity:.5;cursor:not-allowed}.ui-icon-btn.no-radius{border-radius:0}.ui-icon-btn.round{border-radius:999px}.ui-icon-btn.glass{background:var(--ui-glass-bg);-webkit-backdrop-filter:blur(var(--ui-glass-blur));backdrop-filter:blur(var(--ui-glass-blur));border-color:var(--ui-glass-border)}.ui-icon-btn[data-size=sm]{width:var(--ui-size-sm);height:var(--ui-size-sm)}.ui-icon-btn[data-size=lg]{width:var(--ui-size-lg);height:var(--ui-size-lg)}.ui-icon-btn[data-variant=primary]{background:var(--ui-color-primary);color:var(--ui-color-primary-contrast);border-color:transparent}.ui-icon-btn[data-variant=destructive]{background:var(--ui-color-danger);color:#fff;border-color:transparent}.ui-icon-btn[data-variant=ghost]{background:transparent;border-color:transparent}::ng-content svg,::slotted(svg){width:1.15em;height:1.15em}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiIconButton, decorators: [{
            type: Component,
            args: [{ selector: 'ui-icon-button', template: `
    <button
      class="ui-icon-btn"
      [class.glass]="glass()"
      [class.no-radius]="!radius()"
      [class.round]="round()"
      [attr.type]="type()"
      [attr.data-variant]="variant()"
      [attr.data-size]="size()"
      [attr.aria-label]="label()"
      [disabled]="disabled()">
      <ng-content />
    </button>
  `, styles: [":host{display:inline-flex}.ui-icon-btn{display:inline-flex;align-items:center;justify-content:center;width:var(--ui-size-md);height:var(--ui-size-md);border:1px solid var(--ui-color-border);border-radius:var(--ui-radius);background:var(--ui-color-surface);color:var(--ui-color-text);cursor:pointer;transition:background var(--ui-motion-base) var(--ui-ease-standard),transform var(--ui-motion-fast) var(--ui-ease-standard)}.ui-icon-btn:hover:not(:disabled){filter:brightness(1.1)}.ui-icon-btn:active:not(:disabled){transform:scale(.94)}.ui-icon-btn:focus-visible{outline:none;box-shadow:var(--ui-focus-ring)}.ui-icon-btn:disabled{opacity:.5;cursor:not-allowed}.ui-icon-btn.no-radius{border-radius:0}.ui-icon-btn.round{border-radius:999px}.ui-icon-btn.glass{background:var(--ui-glass-bg);-webkit-backdrop-filter:blur(var(--ui-glass-blur));backdrop-filter:blur(var(--ui-glass-blur));border-color:var(--ui-glass-border)}.ui-icon-btn[data-size=sm]{width:var(--ui-size-sm);height:var(--ui-size-sm)}.ui-icon-btn[data-size=lg]{width:var(--ui-size-lg);height:var(--ui-size-lg)}.ui-icon-btn[data-variant=primary]{background:var(--ui-color-primary);color:var(--ui-color-primary-contrast);border-color:transparent}.ui-icon-btn[data-variant=destructive]{background:var(--ui-color-danger);color:#fff;border-color:transparent}.ui-icon-btn[data-variant=ghost]{background:transparent;border-color:transparent}::ng-content svg,::slotted(svg){width:1.15em;height:1.15em}\n"] }]
        }], propDecorators: { label: [{ type: i0.Input, args: [{ isSignal: true, alias: "label", required: true }] }], variant: [{ type: i0.Input, args: [{ isSignal: true, alias: "variant", required: false }] }], size: [{ type: i0.Input, args: [{ isSignal: true, alias: "size", required: false }] }], type: [{ type: i0.Input, args: [{ isSignal: true, alias: "type", required: false }] }], disabled: [{ type: i0.Input, args: [{ isSignal: true, alias: "disabled", required: false }] }], round: [{ type: i0.Input, args: [{ isSignal: true, alias: "round", required: false }] }], glass: [{ type: i0.Input, args: [{ isSignal: true, alias: "glass", required: false }] }], radius: [{ type: i0.Input, args: [{ isSignal: true, alias: "radius", required: false }] }] } });

/** `ui-button-group` — visually joins a row of `ui-button`s into a segmented control. */
class UiButtonGroup {
    label = input(/* @ts-ignore */
    ...(ngDevMode ? [undefined, { debugName: "label" }] : /* istanbul ignore next */ []));
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiButtonGroup, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.1.0", version: "22.0.4", type: UiButtonGroup, isStandalone: true, selector: "ui-button-group", inputs: { label: { classPropertyName: "label", publicName: "label", isSignal: true, isRequired: false, transformFunction: null } }, ngImport: i0, template: `<div class="ui-btn-group" role="group" [attr.aria-label]="label()"><ng-content /></div>`, isInline: true, styles: [":host{display:inline-flex}.ui-btn-group{display:inline-flex}.ui-btn-group ::ng-deep ui-button:not(:first-child) .ui-btn{border-top-left-radius:0;border-bottom-left-radius:0;margin-left:-1px}.ui-btn-group ::ng-deep ui-button:not(:last-child) .ui-btn{border-top-right-radius:0;border-bottom-right-radius:0}.ui-btn-group ::ng-deep ui-button .ui-btn:hover{z-index:1}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiButtonGroup, decorators: [{
            type: Component,
            args: [{ selector: 'ui-button-group', template: `<div class="ui-btn-group" role="group" [attr.aria-label]="label()"><ng-content /></div>`, styles: [":host{display:inline-flex}.ui-btn-group{display:inline-flex}.ui-btn-group ::ng-deep ui-button:not(:first-child) .ui-btn{border-top-left-radius:0;border-bottom-left-radius:0;margin-left:-1px}.ui-btn-group ::ng-deep ui-button:not(:last-child) .ui-btn{border-top-right-radius:0;border-bottom-right-radius:0}.ui-btn-group ::ng-deep ui-button .ui-btn:hover{z-index:1}\n"] }]
        }], propDecorators: { label: [{ type: i0.Input, args: [{ isSignal: true, alias: "label", required: false }] }] } });

/** `ui-toggle-button` — two-state button (`aria-pressed`). Bind `[(pressed)]`. */
class UiToggleButton {
    config = inject(UI_CONFIG);
    pressed = model(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "pressed" }] : /* istanbul ignore next */ []));
    size = input('md', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "size" }] : /* istanbul ignore next */ []));
    disabled = input(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "disabled" }] : /* istanbul ignore next */ []));
    radius = input(this.config.radius, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "radius" }] : /* istanbul ignore next */ []));
    toggle() {
        if (!this.disabled())
            this.pressed.update((v) => !v);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiToggleButton, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.1.0", version: "22.0.4", type: UiToggleButton, isStandalone: true, selector: "ui-toggle-button", inputs: { pressed: { classPropertyName: "pressed", publicName: "pressed", isSignal: true, isRequired: false, transformFunction: null }, size: { classPropertyName: "size", publicName: "size", isSignal: true, isRequired: false, transformFunction: null }, disabled: { classPropertyName: "disabled", publicName: "disabled", isSignal: true, isRequired: false, transformFunction: null }, radius: { classPropertyName: "radius", publicName: "radius", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { pressed: "pressedChange" }, ngImport: i0, template: `
    <button
      class="ui-toggle"
      [class.pressed]="pressed()"
      [class.no-radius]="!radius()"
      [attr.data-size]="size()"
      [attr.aria-pressed]="pressed()"
      [disabled]="disabled()"
      (click)="toggle()">
      <ng-content />
    </button>
  `, isInline: true, styles: [":host{display:inline-flex}.ui-toggle{display:inline-flex;align-items:center;justify-content:center;gap:var(--ui-space-2);height:var(--ui-size-md);padding:0 var(--ui-space-4);background:var(--ui-color-surface);color:var(--ui-color-text);border:1px solid var(--ui-color-border);border-radius:var(--ui-radius);font-family:var(--ui-font-default);font-size:14px;cursor:pointer;transition:background var(--ui-motion-base) var(--ui-ease-standard),border-color var(--ui-motion-base) var(--ui-ease-standard)}.ui-toggle:hover:not(:disabled){background:var(--ui-color-surface-raised)}.ui-toggle.pressed{background:color-mix(in srgb,var(--ui-color-primary) 22%,transparent);border-color:var(--ui-color-primary);color:var(--ui-color-text)}.ui-toggle.no-radius{border-radius:0}.ui-toggle[data-size=sm]{height:var(--ui-size-sm);font-size:13px;padding:0 var(--ui-space-3)}.ui-toggle[data-size=lg]{height:var(--ui-size-lg);font-size:15px;padding:0 var(--ui-space-6)}.ui-toggle:disabled{opacity:.5;cursor:not-allowed}.ui-toggle:focus-visible{outline:none;box-shadow:var(--ui-focus-ring)}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiToggleButton, decorators: [{
            type: Component,
            args: [{ selector: 'ui-toggle-button', template: `
    <button
      class="ui-toggle"
      [class.pressed]="pressed()"
      [class.no-radius]="!radius()"
      [attr.data-size]="size()"
      [attr.aria-pressed]="pressed()"
      [disabled]="disabled()"
      (click)="toggle()">
      <ng-content />
    </button>
  `, styles: [":host{display:inline-flex}.ui-toggle{display:inline-flex;align-items:center;justify-content:center;gap:var(--ui-space-2);height:var(--ui-size-md);padding:0 var(--ui-space-4);background:var(--ui-color-surface);color:var(--ui-color-text);border:1px solid var(--ui-color-border);border-radius:var(--ui-radius);font-family:var(--ui-font-default);font-size:14px;cursor:pointer;transition:background var(--ui-motion-base) var(--ui-ease-standard),border-color var(--ui-motion-base) var(--ui-ease-standard)}.ui-toggle:hover:not(:disabled){background:var(--ui-color-surface-raised)}.ui-toggle.pressed{background:color-mix(in srgb,var(--ui-color-primary) 22%,transparent);border-color:var(--ui-color-primary);color:var(--ui-color-text)}.ui-toggle.no-radius{border-radius:0}.ui-toggle[data-size=sm]{height:var(--ui-size-sm);font-size:13px;padding:0 var(--ui-space-3)}.ui-toggle[data-size=lg]{height:var(--ui-size-lg);font-size:15px;padding:0 var(--ui-space-6)}.ui-toggle:disabled{opacity:.5;cursor:not-allowed}.ui-toggle:focus-visible{outline:none;box-shadow:var(--ui-focus-ring)}\n"] }]
        }], propDecorators: { pressed: [{ type: i0.Input, args: [{ isSignal: true, alias: "pressed", required: false }] }, { type: i0.Output, args: ["pressedChange"] }], size: [{ type: i0.Input, args: [{ isSignal: true, alias: "size", required: false }] }], disabled: [{ type: i0.Input, args: [{ isSignal: true, alias: "disabled", required: false }] }], radius: [{ type: i0.Input, args: [{ isSignal: true, alias: "radius", required: false }] }] } });

/** `ui-fab` — floating action button, fixed to a screen corner. `label` is required (a11y). */
class UiFab {
    label = input.required(/* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "label" }] : /* istanbul ignore next */ []));
    position = input('bottom-right', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "position" }] : /* istanbul ignore next */ []));
    size = input('md', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "size" }] : /* istanbul ignore next */ []));
    disabled = input(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "disabled" }] : /* istanbul ignore next */ []));
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiFab, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.1.0", version: "22.0.4", type: UiFab, isStandalone: true, selector: "ui-fab", inputs: { label: { classPropertyName: "label", publicName: "label", isSignal: true, isRequired: true, transformFunction: null }, position: { classPropertyName: "position", publicName: "position", isSignal: true, isRequired: false, transformFunction: null }, size: { classPropertyName: "size", publicName: "size", isSignal: true, isRequired: false, transformFunction: null }, disabled: { classPropertyName: "disabled", publicName: "disabled", isSignal: true, isRequired: false, transformFunction: null } }, ngImport: i0, template: `
    <button class="ui-fab" [attr.data-position]="position()" [attr.data-size]="size()"
            [attr.aria-label]="label()" [disabled]="disabled()">
      <ng-content />
    </button>
  `, isInline: true, styles: [".ui-fab{position:fixed;z-index:var(--ui-z-docked);display:inline-flex;align-items:center;justify-content:center;width:52px;height:52px;border-radius:50%;background:var(--ui-color-primary);color:var(--ui-color-primary-contrast);border:none;box-shadow:var(--ui-shadow-2);cursor:pointer;font-size:22px;transition:transform var(--ui-motion-fast) var(--ui-ease-spring),background var(--ui-motion-base) var(--ui-ease-standard)}.ui-fab:hover:not(:disabled){background:var(--ui-color-primary-hover);transform:scale(1.05)}.ui-fab:active:not(:disabled){transform:scale(.96)}.ui-fab:focus-visible{outline:none;box-shadow:var(--ui-focus-ring),var(--ui-shadow-2)}.ui-fab:disabled{opacity:.5;cursor:not-allowed}.ui-fab[data-size=sm]{width:40px;height:40px;font-size:18px}.ui-fab[data-position=bottom-right]{right:var(--ui-space-6);bottom:var(--ui-space-6)}.ui-fab[data-position=bottom-left]{left:var(--ui-space-6);bottom:var(--ui-space-6)}.ui-fab[data-position=top-right]{right:var(--ui-space-6);top:var(--ui-space-6)}.ui-fab[data-position=top-left]{left:var(--ui-space-6);top:var(--ui-space-6)}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiFab, decorators: [{
            type: Component,
            args: [{ selector: 'ui-fab', template: `
    <button class="ui-fab" [attr.data-position]="position()" [attr.data-size]="size()"
            [attr.aria-label]="label()" [disabled]="disabled()">
      <ng-content />
    </button>
  `, styles: [".ui-fab{position:fixed;z-index:var(--ui-z-docked);display:inline-flex;align-items:center;justify-content:center;width:52px;height:52px;border-radius:50%;background:var(--ui-color-primary);color:var(--ui-color-primary-contrast);border:none;box-shadow:var(--ui-shadow-2);cursor:pointer;font-size:22px;transition:transform var(--ui-motion-fast) var(--ui-ease-spring),background var(--ui-motion-base) var(--ui-ease-standard)}.ui-fab:hover:not(:disabled){background:var(--ui-color-primary-hover);transform:scale(1.05)}.ui-fab:active:not(:disabled){transform:scale(.96)}.ui-fab:focus-visible{outline:none;box-shadow:var(--ui-focus-ring),var(--ui-shadow-2)}.ui-fab:disabled{opacity:.5;cursor:not-allowed}.ui-fab[data-size=sm]{width:40px;height:40px;font-size:18px}.ui-fab[data-position=bottom-right]{right:var(--ui-space-6);bottom:var(--ui-space-6)}.ui-fab[data-position=bottom-left]{left:var(--ui-space-6);bottom:var(--ui-space-6)}.ui-fab[data-position=top-right]{right:var(--ui-space-6);top:var(--ui-space-6)}.ui-fab[data-position=top-left]{left:var(--ui-space-6);top:var(--ui-space-6)}\n"] }]
        }], propDecorators: { label: [{ type: i0.Input, args: [{ isSignal: true, alias: "label", required: true }] }], position: [{ type: i0.Input, args: [{ isSignal: true, alias: "position", required: false }] }], size: [{ type: i0.Input, args: [{ isSignal: true, alias: "size", required: false }] }], disabled: [{ type: i0.Input, args: [{ isSignal: true, alias: "disabled", required: false }] }] } });

/**
 * `ui-split-button` — a primary action plus a caret that emits `(menu)` for an
 * attached dropdown. Project the main label as content.
 */
class UiSplitButton {
    config = inject(UI_CONFIG);
    variant = input('primary', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "variant" }] : /* istanbul ignore next */ []));
    size = input('md', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "size" }] : /* istanbul ignore next */ []));
    disabled = input(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "disabled" }] : /* istanbul ignore next */ []));
    radius = input(this.config.radius, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "radius" }] : /* istanbul ignore next */ []));
    action = output();
    menu = output();
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiSplitButton, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.1.0", version: "22.0.4", type: UiSplitButton, isStandalone: true, selector: "ui-split-button", inputs: { variant: { classPropertyName: "variant", publicName: "variant", isSignal: true, isRequired: false, transformFunction: null }, size: { classPropertyName: "size", publicName: "size", isSignal: true, isRequired: false, transformFunction: null }, disabled: { classPropertyName: "disabled", publicName: "disabled", isSignal: true, isRequired: false, transformFunction: null }, radius: { classPropertyName: "radius", publicName: "radius", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { action: "action", menu: "menu" }, ngImport: i0, template: `
    <div class="split" [class.no-radius]="!radius()">
      <button class="main" [attr.data-variant]="variant()" [attr.data-size]="size()"
              [disabled]="disabled()" (click)="action.emit()">
        <ng-content />
      </button>
      <button class="caret" [attr.data-variant]="variant()" [attr.data-size]="size()"
              aria-label="More actions" aria-haspopup="menu"
              [disabled]="disabled()" (click)="menu.emit()">▾</button>
    </div>
  `, isInline: true, styles: [":host{display:inline-flex}.split{display:inline-flex}button{border:1px solid var(--ui-color-border);background:var(--ui-color-surface);color:var(--ui-color-text);height:var(--ui-size-md);font-family:var(--ui-font-default);font-size:14px;cursor:pointer;transition:background var(--ui-motion-base) var(--ui-ease-standard)}button:hover:not(:disabled){background:var(--ui-color-surface-raised)}button:focus-visible{outline:none;box-shadow:var(--ui-focus-ring);z-index:1}button:disabled{opacity:.5;cursor:not-allowed}.main{padding:0 var(--ui-space-4);border-radius:var(--ui-radius) 0 0 var(--ui-radius)}.caret{padding:0 var(--ui-space-2);border-left:none;border-radius:0 var(--ui-radius) var(--ui-radius) 0}.split.no-radius .main,.split.no-radius .caret{border-radius:0}button[data-variant=primary]{background:var(--ui-color-primary);color:var(--ui-color-primary-contrast);border-color:transparent}button[data-variant=primary]:hover:not(:disabled){background:var(--ui-color-primary-hover)}button[data-size=sm]{height:var(--ui-size-sm);font-size:13px}button[data-size=lg]{height:var(--ui-size-lg);font-size:15px}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiSplitButton, decorators: [{
            type: Component,
            args: [{ selector: 'ui-split-button', template: `
    <div class="split" [class.no-radius]="!radius()">
      <button class="main" [attr.data-variant]="variant()" [attr.data-size]="size()"
              [disabled]="disabled()" (click)="action.emit()">
        <ng-content />
      </button>
      <button class="caret" [attr.data-variant]="variant()" [attr.data-size]="size()"
              aria-label="More actions" aria-haspopup="menu"
              [disabled]="disabled()" (click)="menu.emit()">▾</button>
    </div>
  `, styles: [":host{display:inline-flex}.split{display:inline-flex}button{border:1px solid var(--ui-color-border);background:var(--ui-color-surface);color:var(--ui-color-text);height:var(--ui-size-md);font-family:var(--ui-font-default);font-size:14px;cursor:pointer;transition:background var(--ui-motion-base) var(--ui-ease-standard)}button:hover:not(:disabled){background:var(--ui-color-surface-raised)}button:focus-visible{outline:none;box-shadow:var(--ui-focus-ring);z-index:1}button:disabled{opacity:.5;cursor:not-allowed}.main{padding:0 var(--ui-space-4);border-radius:var(--ui-radius) 0 0 var(--ui-radius)}.caret{padding:0 var(--ui-space-2);border-left:none;border-radius:0 var(--ui-radius) var(--ui-radius) 0}.split.no-radius .main,.split.no-radius .caret{border-radius:0}button[data-variant=primary]{background:var(--ui-color-primary);color:var(--ui-color-primary-contrast);border-color:transparent}button[data-variant=primary]:hover:not(:disabled){background:var(--ui-color-primary-hover)}button[data-size=sm]{height:var(--ui-size-sm);font-size:13px}button[data-size=lg]{height:var(--ui-size-lg);font-size:15px}\n"] }]
        }], propDecorators: { variant: [{ type: i0.Input, args: [{ isSignal: true, alias: "variant", required: false }] }], size: [{ type: i0.Input, args: [{ isSignal: true, alias: "size", required: false }] }], disabled: [{ type: i0.Input, args: [{ isSignal: true, alias: "disabled", required: false }] }], radius: [{ type: i0.Input, args: [{ isSignal: true, alias: "radius", required: false }] }], action: [{ type: i0.Output, args: ["action"] }], menu: [{ type: i0.Output, args: ["menu"] }] } });

/** `ui-dropdown-button` — a button that opens a menu of actions (CDK Overlay). */
class UiDropdownButton {
    config = inject(UI_CONFIG);
    items = input([], /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "items" }] : /* istanbul ignore next */ []));
    variant = input('secondary', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "variant" }] : /* istanbul ignore next */ []));
    size = input('md', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "size" }] : /* istanbul ignore next */ []));
    disabled = input(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "disabled" }] : /* istanbul ignore next */ []));
    radius = input(this.config.radius, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "radius" }] : /* istanbul ignore next */ []));
    select = output();
    open = signal(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "open" }] : /* istanbul ignore next */ []));
    positions = [
        { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' },
        { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom' },
    ];
    choose(item) {
        if (item.disabled)
            return;
        this.select.emit(item);
        this.open.set(false);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiDropdownButton, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "22.0.4", type: UiDropdownButton, isStandalone: true, selector: "ui-dropdown-button", inputs: { items: { classPropertyName: "items", publicName: "items", isSignal: true, isRequired: false, transformFunction: null }, variant: { classPropertyName: "variant", publicName: "variant", isSignal: true, isRequired: false, transformFunction: null }, size: { classPropertyName: "size", publicName: "size", isSignal: true, isRequired: false, transformFunction: null }, disabled: { classPropertyName: "disabled", publicName: "disabled", isSignal: true, isRequired: false, transformFunction: null }, radius: { classPropertyName: "radius", publicName: "radius", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { select: "select" }, ngImport: i0, template: `
    <button class="ddb" cdkOverlayOrigin #o="cdkOverlayOrigin" [attr.data-variant]="variant()" [attr.data-size]="size()"
            [class.no-radius]="!radius()" [disabled]="disabled()" aria-haspopup="menu" [attr.aria-expanded]="open()" (click)="open.set(!open())">
      <ng-content /><span class="caret" aria-hidden="true">▾</span>
    </button>
    <ng-template cdkConnectedOverlay [cdkConnectedOverlayOrigin]="o" [cdkConnectedOverlayOpen]="open()"
                 [cdkConnectedOverlayPositions]="positions" (overlayOutsideClick)="open.set(false)">
      <div class="menu" role="menu">
        @for (item of items(); track item.value) {
          <button type="button" role="menuitem" class="mi" [class.danger]="item.danger" [disabled]="item.disabled" (click)="choose(item)">{{ item.label }}</button>
        }
      </div>
    </ng-template>
  `, isInline: true, styles: [":host{display:inline-flex}.ddb{display:inline-flex;align-items:center;gap:var(--ui-space-2);height:var(--ui-size-md);padding:0 var(--ui-space-4);background:var(--ui-color-surface);color:var(--ui-color-text);border:1px solid var(--ui-color-border);border-radius:var(--ui-radius);font-family:var(--ui-font-default);font-size:14px;cursor:pointer}.ddb:hover:not(:disabled){background:var(--ui-color-surface-raised)}.ddb:disabled{opacity:.5;cursor:not-allowed}.ddb:focus-visible{outline:none;box-shadow:var(--ui-focus-ring)}.ddb.no-radius{border-radius:0}.ddb[data-variant=primary]{background:var(--ui-color-primary);color:var(--ui-color-primary-contrast);border-color:transparent}.ddb[data-variant=primary]:hover:not(:disabled){background:var(--ui-color-primary-hover)}.ddb[data-size=sm]{height:var(--ui-size-sm);font-size:13px;padding:0 var(--ui-space-3)}.ddb[data-size=lg]{height:var(--ui-size-lg);font-size:15px}.caret{font-size:10px}.menu{display:flex;flex-direction:column;min-width:170px;margin-top:var(--ui-space-1);padding:var(--ui-space-1);background:var(--ui-color-surface-raised);border:1px solid var(--ui-color-border);border-radius:var(--ui-radius);box-shadow:var(--ui-shadow-2)}.mi{padding:var(--ui-space-2) var(--ui-space-3);background:none;border:none;border-radius:6px;text-align:left;cursor:pointer;color:var(--ui-color-text);font:inherit;font-family:var(--ui-font-default);font-size:var(--ui-font-size-md)}.mi:hover:not(:disabled){background:color-mix(in srgb,var(--ui-color-primary) 18%,transparent)}.mi.danger{color:var(--ui-color-danger)}.mi:disabled{opacity:.5;cursor:not-allowed}\n"], dependencies: [{ kind: "directive", type: CdkOverlayOrigin, selector: "[cdk-overlay-origin], [overlay-origin], [cdkOverlayOrigin]", exportAs: ["cdkOverlayOrigin"] }, { kind: "directive", type: CdkConnectedOverlay, selector: "[cdk-connected-overlay], [connected-overlay], [cdkConnectedOverlay]", inputs: ["cdkConnectedOverlayOrigin", "cdkConnectedOverlayPositions", "cdkConnectedOverlayPositionStrategy", "cdkConnectedOverlayOffsetX", "cdkConnectedOverlayOffsetY", "cdkConnectedOverlayWidth", "cdkConnectedOverlayHeight", "cdkConnectedOverlayMinWidth", "cdkConnectedOverlayMinHeight", "cdkConnectedOverlayBackdropClass", "cdkConnectedOverlayPanelClass", "cdkConnectedOverlayViewportMargin", "cdkConnectedOverlayScrollStrategy", "cdkConnectedOverlayOpen", "cdkConnectedOverlayDisableClose", "cdkConnectedOverlayTransformOriginOn", "cdkConnectedOverlayHasBackdrop", "cdkConnectedOverlayLockPosition", "cdkConnectedOverlayFlexibleDimensions", "cdkConnectedOverlayGrowAfterOpen", "cdkConnectedOverlayPush", "cdkConnectedOverlayDisposeOnNavigation", "cdkConnectedOverlayUsePopover", "cdkConnectedOverlayMatchWidth", "cdkConnectedOverlay"], outputs: ["backdropClick", "positionChange", "attach", "detach", "overlayKeydown", "overlayOutsideClick"], exportAs: ["cdkConnectedOverlay"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiDropdownButton, decorators: [{
            type: Component,
            args: [{ selector: 'ui-dropdown-button', imports: [CdkOverlayOrigin, CdkConnectedOverlay], template: `
    <button class="ddb" cdkOverlayOrigin #o="cdkOverlayOrigin" [attr.data-variant]="variant()" [attr.data-size]="size()"
            [class.no-radius]="!radius()" [disabled]="disabled()" aria-haspopup="menu" [attr.aria-expanded]="open()" (click)="open.set(!open())">
      <ng-content /><span class="caret" aria-hidden="true">▾</span>
    </button>
    <ng-template cdkConnectedOverlay [cdkConnectedOverlayOrigin]="o" [cdkConnectedOverlayOpen]="open()"
                 [cdkConnectedOverlayPositions]="positions" (overlayOutsideClick)="open.set(false)">
      <div class="menu" role="menu">
        @for (item of items(); track item.value) {
          <button type="button" role="menuitem" class="mi" [class.danger]="item.danger" [disabled]="item.disabled" (click)="choose(item)">{{ item.label }}</button>
        }
      </div>
    </ng-template>
  `, styles: [":host{display:inline-flex}.ddb{display:inline-flex;align-items:center;gap:var(--ui-space-2);height:var(--ui-size-md);padding:0 var(--ui-space-4);background:var(--ui-color-surface);color:var(--ui-color-text);border:1px solid var(--ui-color-border);border-radius:var(--ui-radius);font-family:var(--ui-font-default);font-size:14px;cursor:pointer}.ddb:hover:not(:disabled){background:var(--ui-color-surface-raised)}.ddb:disabled{opacity:.5;cursor:not-allowed}.ddb:focus-visible{outline:none;box-shadow:var(--ui-focus-ring)}.ddb.no-radius{border-radius:0}.ddb[data-variant=primary]{background:var(--ui-color-primary);color:var(--ui-color-primary-contrast);border-color:transparent}.ddb[data-variant=primary]:hover:not(:disabled){background:var(--ui-color-primary-hover)}.ddb[data-size=sm]{height:var(--ui-size-sm);font-size:13px;padding:0 var(--ui-space-3)}.ddb[data-size=lg]{height:var(--ui-size-lg);font-size:15px}.caret{font-size:10px}.menu{display:flex;flex-direction:column;min-width:170px;margin-top:var(--ui-space-1);padding:var(--ui-space-1);background:var(--ui-color-surface-raised);border:1px solid var(--ui-color-border);border-radius:var(--ui-radius);box-shadow:var(--ui-shadow-2)}.mi{padding:var(--ui-space-2) var(--ui-space-3);background:none;border:none;border-radius:6px;text-align:left;cursor:pointer;color:var(--ui-color-text);font:inherit;font-family:var(--ui-font-default);font-size:var(--ui-font-size-md)}.mi:hover:not(:disabled){background:color-mix(in srgb,var(--ui-color-primary) 18%,transparent)}.mi.danger{color:var(--ui-color-danger)}.mi:disabled{opacity:.5;cursor:not-allowed}\n"] }]
        }], propDecorators: { items: [{ type: i0.Input, args: [{ isSignal: true, alias: "items", required: false }] }], variant: [{ type: i0.Input, args: [{ isSignal: true, alias: "variant", required: false }] }], size: [{ type: i0.Input, args: [{ isSignal: true, alias: "size", required: false }] }], disabled: [{ type: i0.Input, args: [{ isSignal: true, alias: "disabled", required: false }] }], radius: [{ type: i0.Input, args: [{ isSignal: true, alias: "radius", required: false }] }], select: [{ type: i0.Output, args: ["select"] }] } });

/**
 * Generated bundle index. Do not edit.
 */

export { UiButton, UiButtonGroup, UiDropdownButton, UiFab, UiIconButton, UiSplitButton, UiToggleButton };
//# sourceMappingURL=ui-button.mjs.map
