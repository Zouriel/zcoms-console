import { CdkTrapFocus } from '@angular/cdk/a11y';
import { DOCUMENT } from '@angular/common';
import * as i0 from '@angular/core';
import { inject, model, input, effect, Component, computed, signal, Injectable, output } from '@angular/core';
import { UI_CONFIG } from 'ui';
import { UiButton } from 'ui/button';

let modalSeq = 0;
/**
 * `ui-modal` — centered dialog with backdrop. Traps focus (CDK a11y), locks
 * body scroll while open, closes on Escape / backdrop click, and animates with
 * the shared scale + backdrop-fade animations.
 */
class UiModal {
    config = inject(UI_CONFIG);
    doc = inject(DOCUMENT);
    open = model(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "open" }] : /* istanbul ignore next */ []));
    title = input(/* @ts-ignore */
    ...(ngDevMode ? [undefined, { debugName: "title" }] : /* istanbul ignore next */ []));
    size = input('md', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "size" }] : /* istanbul ignore next */ []));
    closeOnBackdrop = input(true, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "closeOnBackdrop" }] : /* istanbul ignore next */ []));
    closeOnEscape = input(true, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "closeOnEscape" }] : /* istanbul ignore next */ []));
    glass = input(this.config.glass, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "glass" }] : /* istanbul ignore next */ []));
    radius = input(this.config.radius, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "radius" }] : /* istanbul ignore next */ []));
    labelId = `ui-modal-${modalSeq++}`;
    constructor() {
        effect(() => {
            const body = this.doc.body;
            if (!body)
                return;
            body.style.overflow = this.open() ? 'hidden' : '';
        });
    }
    onBackdrop() {
        if (this.closeOnBackdrop())
            this.open.set(false);
    }
    onEscape() {
        if (this.closeOnEscape())
            this.open.set(false);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiModal, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "22.0.4", type: UiModal, isStandalone: true, selector: "ui-modal", inputs: { open: { classPropertyName: "open", publicName: "open", isSignal: true, isRequired: false, transformFunction: null }, title: { classPropertyName: "title", publicName: "title", isSignal: true, isRequired: false, transformFunction: null }, size: { classPropertyName: "size", publicName: "size", isSignal: true, isRequired: false, transformFunction: null }, closeOnBackdrop: { classPropertyName: "closeOnBackdrop", publicName: "closeOnBackdrop", isSignal: true, isRequired: false, transformFunction: null }, closeOnEscape: { classPropertyName: "closeOnEscape", publicName: "closeOnEscape", isSignal: true, isRequired: false, transformFunction: null }, glass: { classPropertyName: "glass", publicName: "glass", isSignal: true, isRequired: false, transformFunction: null }, radius: { classPropertyName: "radius", publicName: "radius", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { open: "openChange" }, ngImport: i0, template: `
    @if (open()) {
      <div class="backdrop" animate.enter="ui-backdrop-enter" animate.leave="ui-backdrop-leave" (click)="onBackdrop()"></div>
      <div
        class="panel-wrap"
        (keydown.escape)="onEscape()">
        <div
          class="panel"
          cdkTrapFocus
          [cdkTrapFocusAutoCapture]="true"
          [class.glass]="glass()"
          [class.no-radius]="!radius()"
          [attr.data-size]="size()"
          role="dialog"
          aria-modal="true"
          [attr.aria-labelledby]="title() ? labelId : null"
          animate.enter="ui-scale-enter"
          animate.leave="ui-scale-leave"
          (click)="$event.stopPropagation()">
          @if (title()) {
            <header class="hd">
              <span [id]="labelId" class="title">{{ title() }}</span>
              <button class="x" type="button" aria-label="Close" (click)="open.set(false)">×</button>
            </header>
          }
          <div class="bd"><ng-content /></div>
          <footer class="ft"><ng-content select="[modal-footer]" /></footer>
        </div>
      </div>
    }
  `, isInline: true, styles: [".backdrop{position:fixed;inset:0;z-index:var(--ui-z-overlay);background:#0000008c}.panel-wrap{position:fixed;inset:0;z-index:var(--ui-z-overlay);display:flex;align-items:center;justify-content:center;padding:var(--ui-space-4);pointer-events:none}.panel{pointer-events:auto;width:100%;max-width:480px;max-height:85vh;overflow:auto;display:flex;flex-direction:column;background:var(--ui-color-surface);color:var(--ui-color-text);border:1px solid var(--ui-color-border);border-radius:var(--ui-radius);box-shadow:var(--ui-shadow-3);font-family:var(--ui-font-default)}.panel[data-size=sm]{max-width:360px}.panel[data-size=lg]{max-width:720px}.panel.no-radius{border-radius:0}.panel.glass{background:var(--ui-glass-bg);-webkit-backdrop-filter:blur(var(--ui-glass-blur));backdrop-filter:blur(var(--ui-glass-blur));border-color:var(--ui-glass-border)}.hd{display:flex;align-items:center;justify-content:space-between;gap:var(--ui-space-3);padding:var(--ui-space-3) var(--ui-space-4);border-bottom:1px solid var(--ui-color-border)}.title{font-weight:600;font-size:var(--ui-font-size-lg)}.bd{padding:var(--ui-space-4);display:flex;flex-direction:column;gap:var(--ui-space-3)}.ft{padding:var(--ui-space-3) var(--ui-space-4);border-top:1px solid var(--ui-color-border);display:flex;gap:var(--ui-space-2);justify-content:flex-end}.ft:empty{display:none}.x{border:none;background:transparent;color:var(--ui-color-text-muted);font-size:22px;line-height:1;cursor:pointer}.x:hover{color:var(--ui-color-text)}.x:focus-visible{outline:none;box-shadow:var(--ui-focus-ring);border-radius:6px}\n"], dependencies: [{ kind: "directive", type: CdkTrapFocus, selector: "[cdkTrapFocus]", inputs: ["cdkTrapFocus", "cdkTrapFocusAutoCapture"], exportAs: ["cdkTrapFocus"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiModal, decorators: [{
            type: Component,
            args: [{ selector: 'ui-modal', imports: [CdkTrapFocus], template: `
    @if (open()) {
      <div class="backdrop" animate.enter="ui-backdrop-enter" animate.leave="ui-backdrop-leave" (click)="onBackdrop()"></div>
      <div
        class="panel-wrap"
        (keydown.escape)="onEscape()">
        <div
          class="panel"
          cdkTrapFocus
          [cdkTrapFocusAutoCapture]="true"
          [class.glass]="glass()"
          [class.no-radius]="!radius()"
          [attr.data-size]="size()"
          role="dialog"
          aria-modal="true"
          [attr.aria-labelledby]="title() ? labelId : null"
          animate.enter="ui-scale-enter"
          animate.leave="ui-scale-leave"
          (click)="$event.stopPropagation()">
          @if (title()) {
            <header class="hd">
              <span [id]="labelId" class="title">{{ title() }}</span>
              <button class="x" type="button" aria-label="Close" (click)="open.set(false)">×</button>
            </header>
          }
          <div class="bd"><ng-content /></div>
          <footer class="ft"><ng-content select="[modal-footer]" /></footer>
        </div>
      </div>
    }
  `, styles: [".backdrop{position:fixed;inset:0;z-index:var(--ui-z-overlay);background:#0000008c}.panel-wrap{position:fixed;inset:0;z-index:var(--ui-z-overlay);display:flex;align-items:center;justify-content:center;padding:var(--ui-space-4);pointer-events:none}.panel{pointer-events:auto;width:100%;max-width:480px;max-height:85vh;overflow:auto;display:flex;flex-direction:column;background:var(--ui-color-surface);color:var(--ui-color-text);border:1px solid var(--ui-color-border);border-radius:var(--ui-radius);box-shadow:var(--ui-shadow-3);font-family:var(--ui-font-default)}.panel[data-size=sm]{max-width:360px}.panel[data-size=lg]{max-width:720px}.panel.no-radius{border-radius:0}.panel.glass{background:var(--ui-glass-bg);-webkit-backdrop-filter:blur(var(--ui-glass-blur));backdrop-filter:blur(var(--ui-glass-blur));border-color:var(--ui-glass-border)}.hd{display:flex;align-items:center;justify-content:space-between;gap:var(--ui-space-3);padding:var(--ui-space-3) var(--ui-space-4);border-bottom:1px solid var(--ui-color-border)}.title{font-weight:600;font-size:var(--ui-font-size-lg)}.bd{padding:var(--ui-space-4);display:flex;flex-direction:column;gap:var(--ui-space-3)}.ft{padding:var(--ui-space-3) var(--ui-space-4);border-top:1px solid var(--ui-color-border);display:flex;gap:var(--ui-space-2);justify-content:flex-end}.ft:empty{display:none}.x{border:none;background:transparent;color:var(--ui-color-text-muted);font-size:22px;line-height:1;cursor:pointer}.x:hover{color:var(--ui-color-text)}.x:focus-visible{outline:none;box-shadow:var(--ui-focus-ring);border-radius:6px}\n"] }]
        }], ctorParameters: () => [], propDecorators: { open: [{ type: i0.Input, args: [{ isSignal: true, alias: "open", required: false }] }, { type: i0.Output, args: ["openChange"] }], title: [{ type: i0.Input, args: [{ isSignal: true, alias: "title", required: false }] }], size: [{ type: i0.Input, args: [{ isSignal: true, alias: "size", required: false }] }], closeOnBackdrop: [{ type: i0.Input, args: [{ isSignal: true, alias: "closeOnBackdrop", required: false }] }], closeOnEscape: [{ type: i0.Input, args: [{ isSignal: true, alias: "closeOnEscape", required: false }] }], glass: [{ type: i0.Input, args: [{ isSignal: true, alias: "glass", required: false }] }], radius: [{ type: i0.Input, args: [{ isSignal: true, alias: "radius", required: false }] }] } });

let drawerSeq = 0;
/**
 * `ui-drawer` — edge-anchored sheet. Slides in from `side`, traps focus, locks
 * scroll, and dismisses on Escape / backdrop click.
 */
class UiDrawer {
    config = inject(UI_CONFIG);
    doc = inject(DOCUMENT);
    open = model(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "open" }] : /* istanbul ignore next */ []));
    side = input('right', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "side" }] : /* istanbul ignore next */ []));
    title = input(/* @ts-ignore */
    ...(ngDevMode ? [undefined, { debugName: "title" }] : /* istanbul ignore next */ []));
    closeOnBackdrop = input(true, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "closeOnBackdrop" }] : /* istanbul ignore next */ []));
    closeOnEscape = input(true, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "closeOnEscape" }] : /* istanbul ignore next */ []));
    glass = input(this.config.glass, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "glass" }] : /* istanbul ignore next */ []));
    labelId = `ui-drawer-${drawerSeq++}`;
    slideFrom = computed(() => {
        switch (this.side()) {
            case 'left': return 'translateX(-100%)';
            case 'right': return 'translateX(100%)';
            case 'top': return 'translateY(-100%)';
            case 'bottom': return 'translateY(100%)';
        }
    }, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "slideFrom" }] : /* istanbul ignore next */ []));
    constructor() {
        effect(() => {
            const body = this.doc.body;
            if (body)
                body.style.overflow = this.open() ? 'hidden' : '';
        });
    }
    onBackdrop() { if (this.closeOnBackdrop())
        this.open.set(false); }
    onEscape() { if (this.closeOnEscape())
        this.open.set(false); }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiDrawer, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "22.0.4", type: UiDrawer, isStandalone: true, selector: "ui-drawer", inputs: { open: { classPropertyName: "open", publicName: "open", isSignal: true, isRequired: false, transformFunction: null }, side: { classPropertyName: "side", publicName: "side", isSignal: true, isRequired: false, transformFunction: null }, title: { classPropertyName: "title", publicName: "title", isSignal: true, isRequired: false, transformFunction: null }, closeOnBackdrop: { classPropertyName: "closeOnBackdrop", publicName: "closeOnBackdrop", isSignal: true, isRequired: false, transformFunction: null }, closeOnEscape: { classPropertyName: "closeOnEscape", publicName: "closeOnEscape", isSignal: true, isRequired: false, transformFunction: null }, glass: { classPropertyName: "glass", publicName: "glass", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { open: "openChange" }, ngImport: i0, template: `
    @if (open()) {
      <div class="backdrop" animate.enter="ui-backdrop-enter" animate.leave="ui-backdrop-leave" (click)="onBackdrop()"></div>
      <div
        class="panel"
        cdkTrapFocus
        [cdkTrapFocusAutoCapture]="true"
        [attr.data-side]="side()"
        [class.glass]="glass()"
        [style.--ui-slide-from]="slideFrom()"
        role="dialog"
        aria-modal="true"
        [attr.aria-labelledby]="title() ? labelId : null"
        (keydown.escape)="onEscape()"
        animate.enter="ui-sheet-enter"
        animate.leave="ui-sheet-leave">
        @if (title()) {
          <header class="hd">
            <span [id]="labelId" class="title">{{ title() }}</span>
            <button class="x" type="button" aria-label="Close" (click)="open.set(false)">×</button>
          </header>
        }
        <div class="bd"><ng-content /></div>
      </div>
    }
  `, isInline: true, styles: [".backdrop{position:fixed;inset:0;z-index:var(--ui-z-overlay);background:#0000008c}.panel{position:fixed;z-index:var(--ui-z-overlay);display:flex;flex-direction:column;background:var(--ui-color-surface);color:var(--ui-color-text);border:1px solid var(--ui-color-border);box-shadow:var(--ui-shadow-3);font-family:var(--ui-font-default)}.panel.glass{background:var(--ui-glass-bg);-webkit-backdrop-filter:blur(var(--ui-glass-blur));backdrop-filter:blur(var(--ui-glass-blur));border-color:var(--ui-glass-border)}.panel[data-side=left]{top:0;left:0;bottom:0;width:min(360px,90vw);border-radius:0 var(--ui-radius) var(--ui-radius) 0}.panel[data-side=right]{top:0;right:0;bottom:0;width:min(360px,90vw);border-radius:var(--ui-radius) 0 0 var(--ui-radius)}.panel[data-side=top]{top:0;left:0;right:0;height:min(320px,80vh);border-radius:0 0 var(--ui-radius) var(--ui-radius)}.panel[data-side=bottom]{bottom:0;left:0;right:0;height:min(320px,80vh);border-radius:var(--ui-radius) var(--ui-radius) 0 0}.hd{display:flex;align-items:center;justify-content:space-between;gap:var(--ui-space-3);padding:var(--ui-space-4);border-bottom:1px solid var(--ui-color-border)}.title{font-weight:600;font-size:var(--ui-font-size-lg)}.bd{padding:var(--ui-space-4);overflow:auto;flex:1}.x{border:none;background:transparent;color:var(--ui-color-text-muted);font-size:22px;line-height:1;cursor:pointer}.x:hover{color:var(--ui-color-text)}.x:focus-visible{outline:none;box-shadow:var(--ui-focus-ring);border-radius:6px}\n"], dependencies: [{ kind: "directive", type: CdkTrapFocus, selector: "[cdkTrapFocus]", inputs: ["cdkTrapFocus", "cdkTrapFocusAutoCapture"], exportAs: ["cdkTrapFocus"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiDrawer, decorators: [{
            type: Component,
            args: [{ selector: 'ui-drawer', imports: [CdkTrapFocus], template: `
    @if (open()) {
      <div class="backdrop" animate.enter="ui-backdrop-enter" animate.leave="ui-backdrop-leave" (click)="onBackdrop()"></div>
      <div
        class="panel"
        cdkTrapFocus
        [cdkTrapFocusAutoCapture]="true"
        [attr.data-side]="side()"
        [class.glass]="glass()"
        [style.--ui-slide-from]="slideFrom()"
        role="dialog"
        aria-modal="true"
        [attr.aria-labelledby]="title() ? labelId : null"
        (keydown.escape)="onEscape()"
        animate.enter="ui-sheet-enter"
        animate.leave="ui-sheet-leave">
        @if (title()) {
          <header class="hd">
            <span [id]="labelId" class="title">{{ title() }}</span>
            <button class="x" type="button" aria-label="Close" (click)="open.set(false)">×</button>
          </header>
        }
        <div class="bd"><ng-content /></div>
      </div>
    }
  `, styles: [".backdrop{position:fixed;inset:0;z-index:var(--ui-z-overlay);background:#0000008c}.panel{position:fixed;z-index:var(--ui-z-overlay);display:flex;flex-direction:column;background:var(--ui-color-surface);color:var(--ui-color-text);border:1px solid var(--ui-color-border);box-shadow:var(--ui-shadow-3);font-family:var(--ui-font-default)}.panel.glass{background:var(--ui-glass-bg);-webkit-backdrop-filter:blur(var(--ui-glass-blur));backdrop-filter:blur(var(--ui-glass-blur));border-color:var(--ui-glass-border)}.panel[data-side=left]{top:0;left:0;bottom:0;width:min(360px,90vw);border-radius:0 var(--ui-radius) var(--ui-radius) 0}.panel[data-side=right]{top:0;right:0;bottom:0;width:min(360px,90vw);border-radius:var(--ui-radius) 0 0 var(--ui-radius)}.panel[data-side=top]{top:0;left:0;right:0;height:min(320px,80vh);border-radius:0 0 var(--ui-radius) var(--ui-radius)}.panel[data-side=bottom]{bottom:0;left:0;right:0;height:min(320px,80vh);border-radius:var(--ui-radius) var(--ui-radius) 0 0}.hd{display:flex;align-items:center;justify-content:space-between;gap:var(--ui-space-3);padding:var(--ui-space-4);border-bottom:1px solid var(--ui-color-border)}.title{font-weight:600;font-size:var(--ui-font-size-lg)}.bd{padding:var(--ui-space-4);overflow:auto;flex:1}.x{border:none;background:transparent;color:var(--ui-color-text-muted);font-size:22px;line-height:1;cursor:pointer}.x:hover{color:var(--ui-color-text)}.x:focus-visible{outline:none;box-shadow:var(--ui-focus-ring);border-radius:6px}\n"] }]
        }], ctorParameters: () => [], propDecorators: { open: [{ type: i0.Input, args: [{ isSignal: true, alias: "open", required: false }] }, { type: i0.Output, args: ["openChange"] }], side: [{ type: i0.Input, args: [{ isSignal: true, alias: "side", required: false }] }], title: [{ type: i0.Input, args: [{ isSignal: true, alias: "title", required: false }] }], closeOnBackdrop: [{ type: i0.Input, args: [{ isSignal: true, alias: "closeOnBackdrop", required: false }] }], closeOnEscape: [{ type: i0.Input, args: [{ isSignal: true, alias: "closeOnEscape", required: false }] }], glass: [{ type: i0.Input, args: [{ isSignal: true, alias: "glass", required: false }] }] } });

let toastSeq = 0;
/**
 * `UiToastService` — enqueue transient notifications. Render once with
 * `<ui-toast-host />` near the app root.
 */
class UiToastService {
    toasts = signal([], /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "toasts" }] : /* istanbul ignore next */ []));
    show(opts) {
        const id = ++toastSeq;
        const toast = {
            id,
            message: opts.message,
            title: opts.title,
            tone: opts.tone ?? 'info',
            duration: opts.duration ?? 4000,
        };
        this.toasts.update((list) => [...list, toast]);
        if (toast.duration > 0) {
            setTimeout(() => this.dismiss(id), toast.duration);
        }
        return id;
    }
    info(message, title) { return this.show({ message, title, tone: 'info' }); }
    success(message, title) { return this.show({ message, title, tone: 'success' }); }
    warning(message, title) { return this.show({ message, title, tone: 'warning' }); }
    danger(message, title) { return this.show({ message, title, tone: 'danger' }); }
    dismiss(id) {
        this.toasts.update((list) => list.filter((t) => t.id !== id));
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiToastService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiToastService, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiToastService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });
/** `ui-toast-host` — fixed-corner renderer for queued toasts. */
class UiToastHost {
    toasts = inject(UiToastService);
    position = input('bottom-right', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "position" }] : /* istanbul ignore next */ []));
    glyph = {
        info: 'ℹ', success: '✓', warning: '⚠', danger: '✕',
    };
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiToastHost, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "22.0.4", type: UiToastHost, isStandalone: true, selector: "ui-toast-host", inputs: { position: { classPropertyName: "position", publicName: "position", isSignal: true, isRequired: false, transformFunction: null } }, ngImport: i0, template: `
    <div class="host" [attr.data-position]="position()" aria-live="polite" aria-atomic="false">
      @for (t of toasts.toasts(); track t.id) {
        <div
          class="toast"
          [attr.data-tone]="t.tone"
          [attr.role]="t.tone === 'danger' || t.tone === 'warning' ? 'alert' : 'status'"
          animate.enter="ui-slide-left-enter"
          animate.leave="ui-fade-leave">
          <span class="icon" aria-hidden="true">{{ glyph[t.tone] }}</span>
          <div class="content">
            @if (t.title) { <strong class="title">{{ t.title }}</strong> }
            <span class="msg">{{ t.message }}</span>
          </div>
          <button class="x" type="button" aria-label="Dismiss" (click)="toasts.dismiss(t.id)">×</button>
        </div>
      }
    </div>
  `, isInline: true, styles: [".host{position:fixed;z-index:var(--ui-z-toast);display:flex;flex-direction:column;gap:var(--ui-space-2);padding:var(--ui-space-4);pointer-events:none;max-width:min(380px,90vw)}.host[data-position=top-right]{top:0;right:0}.host[data-position=top-left]{top:0;left:0}.host[data-position=bottom-right]{bottom:0;right:0}.host[data-position=bottom-left]{bottom:0;left:0}.toast{pointer-events:auto;display:flex;align-items:flex-start;gap:var(--ui-space-2);padding:var(--ui-space-2) var(--ui-space-3);background:var(--ui-color-surface-raised);color:var(--ui-color-text);border:1px solid var(--ui-color-border);border-left-width:3px;border-radius:var(--ui-radius);box-shadow:var(--ui-shadow-2);font-family:var(--ui-font-default);font-size:var(--ui-font-size-md)}.toast[data-tone=info]{border-left-color:var(--ui-color-primary)}.toast[data-tone=success]{border-left-color:var(--ui-color-success)}.toast[data-tone=warning]{border-left-color:var(--ui-color-warning)}.toast[data-tone=danger]{border-left-color:var(--ui-color-danger)}.content{flex:1;display:flex;flex-direction:column;gap:2px;min-width:0}.title{font-weight:600}.msg{color:var(--ui-color-text-muted)}.x{border:none;background:transparent;color:var(--ui-color-text-muted);cursor:pointer;font-size:18px;line-height:1}.x:hover{color:var(--ui-color-text)}.x:focus-visible{outline:none;box-shadow:var(--ui-focus-ring);border-radius:4px}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiToastHost, decorators: [{
            type: Component,
            args: [{ selector: 'ui-toast-host', template: `
    <div class="host" [attr.data-position]="position()" aria-live="polite" aria-atomic="false">
      @for (t of toasts.toasts(); track t.id) {
        <div
          class="toast"
          [attr.data-tone]="t.tone"
          [attr.role]="t.tone === 'danger' || t.tone === 'warning' ? 'alert' : 'status'"
          animate.enter="ui-slide-left-enter"
          animate.leave="ui-fade-leave">
          <span class="icon" aria-hidden="true">{{ glyph[t.tone] }}</span>
          <div class="content">
            @if (t.title) { <strong class="title">{{ t.title }}</strong> }
            <span class="msg">{{ t.message }}</span>
          </div>
          <button class="x" type="button" aria-label="Dismiss" (click)="toasts.dismiss(t.id)">×</button>
        </div>
      }
    </div>
  `, styles: [".host{position:fixed;z-index:var(--ui-z-toast);display:flex;flex-direction:column;gap:var(--ui-space-2);padding:var(--ui-space-4);pointer-events:none;max-width:min(380px,90vw)}.host[data-position=top-right]{top:0;right:0}.host[data-position=top-left]{top:0;left:0}.host[data-position=bottom-right]{bottom:0;right:0}.host[data-position=bottom-left]{bottom:0;left:0}.toast{pointer-events:auto;display:flex;align-items:flex-start;gap:var(--ui-space-2);padding:var(--ui-space-2) var(--ui-space-3);background:var(--ui-color-surface-raised);color:var(--ui-color-text);border:1px solid var(--ui-color-border);border-left-width:3px;border-radius:var(--ui-radius);box-shadow:var(--ui-shadow-2);font-family:var(--ui-font-default);font-size:var(--ui-font-size-md)}.toast[data-tone=info]{border-left-color:var(--ui-color-primary)}.toast[data-tone=success]{border-left-color:var(--ui-color-success)}.toast[data-tone=warning]{border-left-color:var(--ui-color-warning)}.toast[data-tone=danger]{border-left-color:var(--ui-color-danger)}.content{flex:1;display:flex;flex-direction:column;gap:2px;min-width:0}.title{font-weight:600}.msg{color:var(--ui-color-text-muted)}.x{border:none;background:transparent;color:var(--ui-color-text-muted);cursor:pointer;font-size:18px;line-height:1}.x:hover{color:var(--ui-color-text)}.x:focus-visible{outline:none;box-shadow:var(--ui-focus-ring);border-radius:4px}\n"] }]
        }], propDecorators: { position: [{ type: i0.Input, args: [{ isSignal: true, alias: "position", required: false }] }] } });

/**
 * `ui-confirm-dialog` — a focused confirm/cancel prompt built on `ui-modal`.
 * Bind `[(open)]` and listen to `(confirm)` / `(cancel)`.
 */
class UiConfirmDialog {
    open = model(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "open" }] : /* istanbul ignore next */ []));
    title = input('Are you sure?', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "title" }] : /* istanbul ignore next */ []));
    message = input('', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "message" }] : /* istanbul ignore next */ []));
    confirmLabel = input('Confirm', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "confirmLabel" }] : /* istanbul ignore next */ []));
    cancelLabel = input('Cancel', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "cancelLabel" }] : /* istanbul ignore next */ []));
    destructive = input(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "destructive" }] : /* istanbul ignore next */ []));
    confirm = output();
    cancel = output();
    confirmClick() {
        this.confirm.emit();
        this.open.set(false);
    }
    cancelClick() {
        this.cancel.emit();
        this.open.set(false);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiConfirmDialog, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.1.0", version: "22.0.4", type: UiConfirmDialog, isStandalone: true, selector: "ui-confirm-dialog", inputs: { open: { classPropertyName: "open", publicName: "open", isSignal: true, isRequired: false, transformFunction: null }, title: { classPropertyName: "title", publicName: "title", isSignal: true, isRequired: false, transformFunction: null }, message: { classPropertyName: "message", publicName: "message", isSignal: true, isRequired: false, transformFunction: null }, confirmLabel: { classPropertyName: "confirmLabel", publicName: "confirmLabel", isSignal: true, isRequired: false, transformFunction: null }, cancelLabel: { classPropertyName: "cancelLabel", publicName: "cancelLabel", isSignal: true, isRequired: false, transformFunction: null }, destructive: { classPropertyName: "destructive", publicName: "destructive", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { open: "openChange", confirm: "confirm", cancel: "cancel" }, ngImport: i0, template: `
    <ui-modal [(open)]="open" [title]="title()" size="sm">
      <p class="msg">{{ message() }}</p>
      <div modal-footer class="actions">
        <ui-button variant="outline" size="sm" (click)="cancelClick()">{{ cancelLabel() }}</ui-button>
        <ui-button [variant]="destructive() ? 'destructive' : 'primary'" size="sm" (click)="confirmClick()">
          {{ confirmLabel() }}
        </ui-button>
      </div>
    </ui-modal>
  `, isInline: true, styles: [".msg{margin:0;color:var(--ui-color-text-muted);font-family:var(--ui-font-default)}.actions{display:flex;width:100%;justify-content:space-between;gap:var(--ui-space-4)}\n"], dependencies: [{ kind: "component", type: UiModal, selector: "ui-modal", inputs: ["open", "title", "size", "closeOnBackdrop", "closeOnEscape", "glass", "radius"], outputs: ["openChange"] }, { kind: "component", type: UiButton, selector: "ui-button", inputs: ["variant", "size", "type", "disabled", "loading", "block", "glass", "radius"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiConfirmDialog, decorators: [{
            type: Component,
            args: [{ selector: 'ui-confirm-dialog', imports: [UiModal, UiButton], template: `
    <ui-modal [(open)]="open" [title]="title()" size="sm">
      <p class="msg">{{ message() }}</p>
      <div modal-footer class="actions">
        <ui-button variant="outline" size="sm" (click)="cancelClick()">{{ cancelLabel() }}</ui-button>
        <ui-button [variant]="destructive() ? 'destructive' : 'primary'" size="sm" (click)="confirmClick()">
          {{ confirmLabel() }}
        </ui-button>
      </div>
    </ui-modal>
  `, styles: [".msg{margin:0;color:var(--ui-color-text-muted);font-family:var(--ui-font-default)}.actions{display:flex;width:100%;justify-content:space-between;gap:var(--ui-space-4)}\n"] }]
        }], propDecorators: { open: [{ type: i0.Input, args: [{ isSignal: true, alias: "open", required: false }] }, { type: i0.Output, args: ["openChange"] }], title: [{ type: i0.Input, args: [{ isSignal: true, alias: "title", required: false }] }], message: [{ type: i0.Input, args: [{ isSignal: true, alias: "message", required: false }] }], confirmLabel: [{ type: i0.Input, args: [{ isSignal: true, alias: "confirmLabel", required: false }] }], cancelLabel: [{ type: i0.Input, args: [{ isSignal: true, alias: "cancelLabel", required: false }] }], destructive: [{ type: i0.Input, args: [{ isSignal: true, alias: "destructive", required: false }] }], confirm: [{ type: i0.Output, args: ["confirm"] }], cancel: [{ type: i0.Output, args: ["cancel"] }] } });

/**
 * Generated bundle index. Do not edit.
 */

export { UiConfirmDialog, UiDrawer, UiModal, UiToastHost, UiToastService };
//# sourceMappingURL=ui-dialog.mjs.map
