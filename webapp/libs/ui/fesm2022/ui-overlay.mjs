import { DOCUMENT } from '@angular/common';
import * as i0 from '@angular/core';
import { inject, ElementRef, output, Directive, input, Component, signal, model, viewChild } from '@angular/core';
import { Overlay, CdkOverlayOrigin, CdkConnectedOverlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { UI_CONFIG } from 'ui';

/**
 * `uiClickOutside` — emits when a pointer/focus event occurs outside the host
 * element. Used by popovers, dropdowns, and menus to dismiss on outside click.
 */
class UiClickOutside {
    el = inject(ElementRef);
    doc = inject(DOCUMENT);
    uiClickOutside = output();
    onDocument(event) {
        const target = event.target;
        if (!target || !this.doc.contains(target))
            return;
        if (!this.el.nativeElement.contains(target)) {
            this.uiClickOutside.emit(event);
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiClickOutside, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "22.0.4", type: UiClickOutside, isStandalone: true, selector: "[uiClickOutside]", outputs: { uiClickOutside: "uiClickOutside" }, host: { listeners: { "document:pointerdown": "onDocument($event)" } }, ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiClickOutside, decorators: [{
            type: Directive,
            args: [{
                    selector: '[uiClickOutside]',
                    host: {
                        '(document:pointerdown)': 'onDocument($event)',
                    },
                }]
        }], propDecorators: { uiClickOutside: [{ type: i0.Output, args: ["uiClickOutside"] }] } });

/**
 * `ui-backdrop` — full-viewport scrim behind overlays. Emits `(backdropClick)`.
 * Render conditionally with `@if`; it animates via the shared backdrop fade.
 */
class UiBackdrop {
    blur = input(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "blur" }] : /* istanbul ignore next */ []));
    backdropClick = output();
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiBackdrop, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.1.0", version: "22.0.4", type: UiBackdrop, isStandalone: true, selector: "ui-backdrop", inputs: { blur: { classPropertyName: "blur", publicName: "blur", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { backdropClick: "backdropClick" }, ngImport: i0, template: `
    <div
      class="ui-backdrop"
      [class.blur]="blur()"
      (click)="backdropClick.emit()"
      animate.enter="ui-backdrop-enter"
      animate.leave="ui-backdrop-leave"></div>
  `, isInline: true, styles: [".ui-backdrop{position:fixed;inset:0;z-index:var(--ui-z-overlay);background:#0000008c}.ui-backdrop.blur{-webkit-backdrop-filter:blur(3px);backdrop-filter:blur(3px)}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiBackdrop, decorators: [{
            type: Component,
            args: [{ selector: 'ui-backdrop', template: `
    <div
      class="ui-backdrop"
      [class.blur]="blur()"
      (click)="backdropClick.emit()"
      animate.enter="ui-backdrop-enter"
      animate.leave="ui-backdrop-leave"></div>
  `, styles: [".ui-backdrop{position:fixed;inset:0;z-index:var(--ui-z-overlay);background:#0000008c}.ui-backdrop.blur{-webkit-backdrop-filter:blur(3px);backdrop-filter:blur(3px)}\n"] }]
        }], propDecorators: { blur: [{ type: i0.Input, args: [{ isSignal: true, alias: "blur", required: false }] }], backdropClick: [{ type: i0.Output, args: ["backdropClick"] }] } });

let tooltipSeq = 0;
/** Internal panel rendered inside the CDK overlay. */
class UiTooltipPanel {
    text = signal('', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "text" }] : /* istanbul ignore next */ []));
    id = `ui-tooltip-${tooltipSeq++}`;
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiTooltipPanel, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "22.0.4", type: UiTooltipPanel, isStandalone: true, selector: "ui-tooltip-panel", ngImport: i0, template: `<div class="ui-tooltip" role="tooltip" [id]="id">{{ text() }}</div>`, isInline: true, styles: [".ui-tooltip{max-width:240px;padding:var(--ui-space-2) var(--ui-space-3);background:var(--ui-color-surface-raised);color:var(--ui-color-text);border:1px solid var(--ui-color-border);border-radius:8px;font-family:var(--ui-font-default);font-size:var(--ui-font-size-sm);box-shadow:var(--ui-shadow-2);pointer-events:none;animation:ui-fade-in var(--ui-motion-fast) var(--ui-ease-standard)}@media(prefers-reduced-motion:reduce){.ui-tooltip{animation:none}}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiTooltipPanel, decorators: [{
            type: Component,
            args: [{ selector: 'ui-tooltip-panel', template: `<div class="ui-tooltip" role="tooltip" [id]="id">{{ text() }}</div>`, styles: [".ui-tooltip{max-width:240px;padding:var(--ui-space-2) var(--ui-space-3);background:var(--ui-color-surface-raised);color:var(--ui-color-text);border:1px solid var(--ui-color-border);border-radius:8px;font-family:var(--ui-font-default);font-size:var(--ui-font-size-sm);box-shadow:var(--ui-shadow-2);pointer-events:none;animation:ui-fade-in var(--ui-motion-fast) var(--ui-ease-standard)}@media(prefers-reduced-motion:reduce){.ui-tooltip{animation:none}}\n"] }]
        }] });
/**
 * `uiTooltip` — accessible hover/focus tooltip backed by the CDK Overlay.
 * Sets `aria-describedby` on the host so screen readers announce it.
 */
class UiTooltip {
    text = input.required({ ...(ngDevMode ? { debugName: "text" } : /* istanbul ignore next */ {}), alias: 'uiTooltip' });
    position = input('top', { ...(ngDevMode ? { debugName: "position" } : /* istanbul ignore next */ {}), alias: 'uiTooltipPosition' });
    overlay = inject(Overlay);
    el = inject(ElementRef);
    ref = null;
    panel = null;
    describedBy = signal(null, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "describedBy" }] : /* istanbul ignore next */ []));
    show() {
        if (this.ref || !this.text())
            return;
        const pos = this.positionFor(this.position());
        this.ref = this.overlay.create({
            positionStrategy: this.overlay.position()
                .flexibleConnectedTo(this.el)
                .withPositions([pos])
                .withPush(true),
            scrollStrategy: this.overlay.scrollStrategies.reposition(),
        });
        const componentRef = this.ref.attach(new ComponentPortal(UiTooltipPanel));
        this.panel = componentRef.instance;
        this.panel.text.set(this.text());
        this.describedBy.set(this.panel.id);
    }
    hide() {
        this.ref?.dispose();
        this.ref = null;
        this.panel = null;
        this.describedBy.set(null);
    }
    ngOnDestroy() {
        this.hide();
    }
    positionFor(p) {
        const gap = 8;
        switch (p) {
            case 'bottom': return { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top', offsetY: gap };
            case 'left': return { originX: 'start', originY: 'center', overlayX: 'end', overlayY: 'center', offsetX: -gap };
            case 'right': return { originX: 'end', originY: 'center', overlayX: 'start', overlayY: 'center', offsetX: gap };
            default: return { originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom', offsetY: -gap };
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiTooltip, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "17.1.0", version: "22.0.4", type: UiTooltip, isStandalone: true, selector: "[uiTooltip]", inputs: { text: { classPropertyName: "text", publicName: "uiTooltip", isSignal: true, isRequired: true, transformFunction: null }, position: { classPropertyName: "position", publicName: "uiTooltipPosition", isSignal: true, isRequired: false, transformFunction: null } }, host: { listeners: { "mouseenter": "show()", "mouseleave": "hide()", "focusin": "show()", "focusout": "hide()" }, properties: { "attr.aria-describedby": "describedBy()" } }, ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiTooltip, decorators: [{
            type: Directive,
            args: [{
                    selector: '[uiTooltip]',
                    host: {
                        '(mouseenter)': 'show()',
                        '(mouseleave)': 'hide()',
                        '(focusin)': 'show()',
                        '(focusout)': 'hide()',
                        '[attr.aria-describedby]': 'describedBy()',
                    },
                }]
        }], propDecorators: { text: [{ type: i0.Input, args: [{ isSignal: true, alias: "uiTooltip", required: true }] }], position: [{ type: i0.Input, args: [{ isSignal: true, alias: "uiTooltipPosition", required: false }] }] } });

/**
 * `ui-popover` — click-triggered floating panel anchored to its trigger via the
 * CDK Overlay. Project the trigger with `[popover-trigger]` and the panel body
 * as default content. Dismisses on outside click and Escape.
 */
class UiPopover {
    config = inject(UI_CONFIG);
    open = model(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "open" }] : /* istanbul ignore next */ []));
    placement = input('bottom-start', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "placement" }] : /* istanbul ignore next */ []));
    glass = input(this.config.glass, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "glass" }] : /* istanbul ignore next */ []));
    radius = input(this.config.radius, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "radius" }] : /* istanbul ignore next */ []));
    toggle() {
        this.open.update((v) => !v);
    }
    get positions() {
        const map = {
            'bottom': { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top' },
            'bottom-start': { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' },
            'bottom-end': { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top' },
            'top': { originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom' },
        };
        const primary = map[this.placement()];
        return [primary, map['top']];
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiPopover, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.1.0", version: "22.0.4", type: UiPopover, isStandalone: true, selector: "ui-popover", inputs: { open: { classPropertyName: "open", publicName: "open", isSignal: true, isRequired: false, transformFunction: null }, placement: { classPropertyName: "placement", publicName: "placement", isSignal: true, isRequired: false, transformFunction: null }, glass: { classPropertyName: "glass", publicName: "glass", isSignal: true, isRequired: false, transformFunction: null }, radius: { classPropertyName: "radius", publicName: "radius", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { open: "openChange" }, ngImport: i0, template: `
    <span
      class="trigger"
      cdkOverlayOrigin
      #origin="cdkOverlayOrigin"
      (click)="toggle()">
      <ng-content select="[popover-trigger]" />
    </span>

    <ng-template
      cdkConnectedOverlay
      [cdkConnectedOverlayOrigin]="origin"
      [cdkConnectedOverlayOpen]="open()"
      [cdkConnectedOverlayPositions]="positions"
      [cdkConnectedOverlayHasBackdrop]="false"
      (overlayOutsideClick)="open.set(false)"
      (detach)="open.set(false)">
      <div
        class="ui-popover"
        [class.glass]="glass()"
        [class.no-radius]="!radius()"
        role="dialog"
        (keydown.escape)="open.set(false)"
        animate.enter="ui-scale-enter"
        animate.leave="ui-scale-leave">
        <ng-content />
      </div>
    </ng-template>
  `, isInline: true, styles: [".trigger{display:inline-flex}.ui-popover{min-width:180px;max-width:320px;margin-top:var(--ui-space-2);padding:var(--ui-space-3);background:var(--ui-color-surface-raised);color:var(--ui-color-text);border:1px solid var(--ui-color-border);border-radius:var(--ui-radius);box-shadow:var(--ui-shadow-2);font-family:var(--ui-font-default)}.ui-popover.no-radius{border-radius:0}.ui-popover.glass{background:var(--ui-glass-bg);-webkit-backdrop-filter:blur(var(--ui-glass-blur));backdrop-filter:blur(var(--ui-glass-blur));border-color:var(--ui-glass-border)}\n"], dependencies: [{ kind: "directive", type: CdkOverlayOrigin, selector: "[cdk-overlay-origin], [overlay-origin], [cdkOverlayOrigin]", exportAs: ["cdkOverlayOrigin"] }, { kind: "directive", type: CdkConnectedOverlay, selector: "[cdk-connected-overlay], [connected-overlay], [cdkConnectedOverlay]", inputs: ["cdkConnectedOverlayOrigin", "cdkConnectedOverlayPositions", "cdkConnectedOverlayPositionStrategy", "cdkConnectedOverlayOffsetX", "cdkConnectedOverlayOffsetY", "cdkConnectedOverlayWidth", "cdkConnectedOverlayHeight", "cdkConnectedOverlayMinWidth", "cdkConnectedOverlayMinHeight", "cdkConnectedOverlayBackdropClass", "cdkConnectedOverlayPanelClass", "cdkConnectedOverlayViewportMargin", "cdkConnectedOverlayScrollStrategy", "cdkConnectedOverlayOpen", "cdkConnectedOverlayDisableClose", "cdkConnectedOverlayTransformOriginOn", "cdkConnectedOverlayHasBackdrop", "cdkConnectedOverlayLockPosition", "cdkConnectedOverlayFlexibleDimensions", "cdkConnectedOverlayGrowAfterOpen", "cdkConnectedOverlayPush", "cdkConnectedOverlayDisposeOnNavigation", "cdkConnectedOverlayUsePopover", "cdkConnectedOverlayMatchWidth", "cdkConnectedOverlay"], outputs: ["backdropClick", "positionChange", "attach", "detach", "overlayKeydown", "overlayOutsideClick"], exportAs: ["cdkConnectedOverlay"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiPopover, decorators: [{
            type: Component,
            args: [{ selector: 'ui-popover', imports: [CdkOverlayOrigin, CdkConnectedOverlay], template: `
    <span
      class="trigger"
      cdkOverlayOrigin
      #origin="cdkOverlayOrigin"
      (click)="toggle()">
      <ng-content select="[popover-trigger]" />
    </span>

    <ng-template
      cdkConnectedOverlay
      [cdkConnectedOverlayOrigin]="origin"
      [cdkConnectedOverlayOpen]="open()"
      [cdkConnectedOverlayPositions]="positions"
      [cdkConnectedOverlayHasBackdrop]="false"
      (overlayOutsideClick)="open.set(false)"
      (detach)="open.set(false)">
      <div
        class="ui-popover"
        [class.glass]="glass()"
        [class.no-radius]="!radius()"
        role="dialog"
        (keydown.escape)="open.set(false)"
        animate.enter="ui-scale-enter"
        animate.leave="ui-scale-leave">
        <ng-content />
      </div>
    </ng-template>
  `, styles: [".trigger{display:inline-flex}.ui-popover{min-width:180px;max-width:320px;margin-top:var(--ui-space-2);padding:var(--ui-space-3);background:var(--ui-color-surface-raised);color:var(--ui-color-text);border:1px solid var(--ui-color-border);border-radius:var(--ui-radius);box-shadow:var(--ui-shadow-2);font-family:var(--ui-font-default)}.ui-popover.no-radius{border-radius:0}.ui-popover.glass{background:var(--ui-glass-bg);-webkit-backdrop-filter:blur(var(--ui-glass-blur));backdrop-filter:blur(var(--ui-glass-blur));border-color:var(--ui-glass-border)}\n"] }]
        }], propDecorators: { open: [{ type: i0.Input, args: [{ isSignal: true, alias: "open", required: false }] }, { type: i0.Output, args: ["openChange"] }], placement: [{ type: i0.Input, args: [{ isSignal: true, alias: "placement", required: false }] }], glass: [{ type: i0.Input, args: [{ isSignal: true, alias: "glass", required: false }] }], radius: [{ type: i0.Input, args: [{ isSignal: true, alias: "radius", required: false }] }] } });

/**
 * `ui-menu` — dropdown menu anchored to a trigger (CDK Overlay). Project the
 * trigger with `[menu-trigger]`; pass `items` and listen to `(select)`.
 * Arrow keys move focus, Enter activates, Escape closes (WAI-ARIA menu).
 */
class UiMenu {
    config = inject(UI_CONFIG);
    open = model(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "open" }] : /* istanbul ignore next */ []));
    items = input([], /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "items" }] : /* istanbul ignore next */ []));
    select = output();
    glass = input(this.config.glass, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "glass" }] : /* istanbul ignore next */ []));
    radius = input(this.config.radius, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "radius" }] : /* istanbul ignore next */ []));
    panel = viewChild('panel', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "panel" }] : /* istanbul ignore next */ []));
    positions = [
        { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' },
        { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom' },
    ];
    toggle() { this.open.update((v) => !v); }
    choose(item) {
        if (item.disabled)
            return;
        this.select.emit(item);
        this.open.set(false);
    }
    focusFirst() {
        queueMicrotask(() => this.itemEls()[0]?.focus());
    }
    onKeydown(e) {
        const els = this.itemEls();
        if (!els.length)
            return;
        const current = els.indexOf(document.activeElement);
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            els[(current + 1) % els.length]?.focus();
        }
        else if (e.key === 'ArrowUp') {
            e.preventDefault();
            els[(current - 1 + els.length) % els.length]?.focus();
        }
        else if (e.key === 'Home') {
            e.preventDefault();
            els[0]?.focus();
        }
        else if (e.key === 'End') {
            e.preventDefault();
            els[els.length - 1]?.focus();
        }
        else if (e.key === 'Escape') {
            e.preventDefault();
            this.open.set(false);
        }
    }
    itemEls() {
        const el = this.panel()?.nativeElement;
        return el ? Array.from(el.querySelectorAll('.item:not([disabled])')) : [];
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiMenu, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "22.0.4", type: UiMenu, isStandalone: true, selector: "ui-menu", inputs: { open: { classPropertyName: "open", publicName: "open", isSignal: true, isRequired: false, transformFunction: null }, items: { classPropertyName: "items", publicName: "items", isSignal: true, isRequired: false, transformFunction: null }, glass: { classPropertyName: "glass", publicName: "glass", isSignal: true, isRequired: false, transformFunction: null }, radius: { classPropertyName: "radius", publicName: "radius", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { open: "openChange", select: "select" }, viewQueries: [{ propertyName: "panel", first: true, predicate: ["panel"], descendants: true, isSignal: true }], ngImport: i0, template: `
    <span class="trigger" cdkOverlayOrigin #origin="cdkOverlayOrigin" (click)="toggle()">
      <ng-content select="[menu-trigger]" />
    </span>

    <ng-template
      cdkConnectedOverlay
      [cdkConnectedOverlayOrigin]="origin"
      [cdkConnectedOverlayOpen]="open()"
      [cdkConnectedOverlayPositions]="positions"
      (overlayOutsideClick)="open.set(false)"
      (attach)="focusFirst()"
      (detach)="open.set(false)">
      <div
        #panel
        class="ui-menu"
        [class.glass]="glass()"
        [class.no-radius]="!radius()"
        role="menu"
        (keydown)="onKeydown($event)">
        @for (item of items(); track item.value) {
          <button
            type="button"
            role="menuitem"
            class="item"
            [class.danger]="item.danger"
            [disabled]="item.disabled"
            (click)="choose(item)">
            {{ item.label }}
          </button>
        }
      </div>
    </ng-template>
  `, isInline: true, styles: [".trigger{display:inline-flex}.ui-menu{display:flex;flex-direction:column;min-width:180px;margin-top:var(--ui-space-2);padding:var(--ui-space-1);background:var(--ui-color-surface-raised);color:var(--ui-color-text);border:1px solid var(--ui-color-border);border-radius:var(--ui-radius);box-shadow:var(--ui-shadow-2);font-family:var(--ui-font-default);animation:ui-scale-in var(--ui-motion-fast) var(--ui-ease-standard)}.ui-menu.no-radius{border-radius:0}.ui-menu.glass{background:var(--ui-glass-bg);-webkit-backdrop-filter:blur(var(--ui-glass-blur));backdrop-filter:blur(var(--ui-glass-blur));border-color:var(--ui-glass-border)}.item{display:flex;align-items:center;gap:var(--ui-space-2);padding:var(--ui-space-2) var(--ui-space-3);background:transparent;border:none;border-radius:6px;color:inherit;font:inherit;text-align:left;cursor:pointer}.item:hover:not(:disabled),.item:focus-visible{background:color-mix(in srgb,var(--ui-color-primary) 18%,transparent);outline:none}.item.danger{color:var(--ui-color-danger)}.item:disabled{opacity:.5;cursor:not-allowed}@media(prefers-reduced-motion:reduce){.ui-menu{animation:none}}\n"], dependencies: [{ kind: "directive", type: CdkOverlayOrigin, selector: "[cdk-overlay-origin], [overlay-origin], [cdkOverlayOrigin]", exportAs: ["cdkOverlayOrigin"] }, { kind: "directive", type: CdkConnectedOverlay, selector: "[cdk-connected-overlay], [connected-overlay], [cdkConnectedOverlay]", inputs: ["cdkConnectedOverlayOrigin", "cdkConnectedOverlayPositions", "cdkConnectedOverlayPositionStrategy", "cdkConnectedOverlayOffsetX", "cdkConnectedOverlayOffsetY", "cdkConnectedOverlayWidth", "cdkConnectedOverlayHeight", "cdkConnectedOverlayMinWidth", "cdkConnectedOverlayMinHeight", "cdkConnectedOverlayBackdropClass", "cdkConnectedOverlayPanelClass", "cdkConnectedOverlayViewportMargin", "cdkConnectedOverlayScrollStrategy", "cdkConnectedOverlayOpen", "cdkConnectedOverlayDisableClose", "cdkConnectedOverlayTransformOriginOn", "cdkConnectedOverlayHasBackdrop", "cdkConnectedOverlayLockPosition", "cdkConnectedOverlayFlexibleDimensions", "cdkConnectedOverlayGrowAfterOpen", "cdkConnectedOverlayPush", "cdkConnectedOverlayDisposeOnNavigation", "cdkConnectedOverlayUsePopover", "cdkConnectedOverlayMatchWidth", "cdkConnectedOverlay"], outputs: ["backdropClick", "positionChange", "attach", "detach", "overlayKeydown", "overlayOutsideClick"], exportAs: ["cdkConnectedOverlay"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiMenu, decorators: [{
            type: Component,
            args: [{ selector: 'ui-menu', imports: [CdkOverlayOrigin, CdkConnectedOverlay], template: `
    <span class="trigger" cdkOverlayOrigin #origin="cdkOverlayOrigin" (click)="toggle()">
      <ng-content select="[menu-trigger]" />
    </span>

    <ng-template
      cdkConnectedOverlay
      [cdkConnectedOverlayOrigin]="origin"
      [cdkConnectedOverlayOpen]="open()"
      [cdkConnectedOverlayPositions]="positions"
      (overlayOutsideClick)="open.set(false)"
      (attach)="focusFirst()"
      (detach)="open.set(false)">
      <div
        #panel
        class="ui-menu"
        [class.glass]="glass()"
        [class.no-radius]="!radius()"
        role="menu"
        (keydown)="onKeydown($event)">
        @for (item of items(); track item.value) {
          <button
            type="button"
            role="menuitem"
            class="item"
            [class.danger]="item.danger"
            [disabled]="item.disabled"
            (click)="choose(item)">
            {{ item.label }}
          </button>
        }
      </div>
    </ng-template>
  `, styles: [".trigger{display:inline-flex}.ui-menu{display:flex;flex-direction:column;min-width:180px;margin-top:var(--ui-space-2);padding:var(--ui-space-1);background:var(--ui-color-surface-raised);color:var(--ui-color-text);border:1px solid var(--ui-color-border);border-radius:var(--ui-radius);box-shadow:var(--ui-shadow-2);font-family:var(--ui-font-default);animation:ui-scale-in var(--ui-motion-fast) var(--ui-ease-standard)}.ui-menu.no-radius{border-radius:0}.ui-menu.glass{background:var(--ui-glass-bg);-webkit-backdrop-filter:blur(var(--ui-glass-blur));backdrop-filter:blur(var(--ui-glass-blur));border-color:var(--ui-glass-border)}.item{display:flex;align-items:center;gap:var(--ui-space-2);padding:var(--ui-space-2) var(--ui-space-3);background:transparent;border:none;border-radius:6px;color:inherit;font:inherit;text-align:left;cursor:pointer}.item:hover:not(:disabled),.item:focus-visible{background:color-mix(in srgb,var(--ui-color-primary) 18%,transparent);outline:none}.item.danger{color:var(--ui-color-danger)}.item:disabled{opacity:.5;cursor:not-allowed}@media(prefers-reduced-motion:reduce){.ui-menu{animation:none}}\n"] }]
        }], propDecorators: { open: [{ type: i0.Input, args: [{ isSignal: true, alias: "open", required: false }] }, { type: i0.Output, args: ["openChange"] }], items: [{ type: i0.Input, args: [{ isSignal: true, alias: "items", required: false }] }], select: [{ type: i0.Output, args: ["select"] }], glass: [{ type: i0.Input, args: [{ isSignal: true, alias: "glass", required: false }] }], radius: [{ type: i0.Input, args: [{ isSignal: true, alias: "radius", required: false }] }], panel: [{ type: i0.ViewChild, args: ['panel', { isSignal: true }] }] } });

/** Internal panel rendered in the context-menu overlay. */
class UiContextMenuPanel {
    items = signal([], /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "items" }] : /* istanbul ignore next */ []));
    onPick = () => { };
    pick(item) {
        if (!item.disabled)
            this.onPick(item);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiContextMenuPanel, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "22.0.4", type: UiContextMenuPanel, isStandalone: true, selector: "ui-context-menu-panel", ngImport: i0, template: `
    <div class="cm" role="menu">
      @for (item of items(); track item.value) {
        <button type="button" role="menuitem" class="mi" [class.danger]="item.danger"
                [disabled]="item.disabled" (click)="pick(item)">{{ item.label }}</button>
      }
    </div>
  `, isInline: true, styles: [".cm{display:flex;flex-direction:column;min-width:170px;padding:var(--ui-space-1);background:var(--ui-color-surface-raised);border:1px solid var(--ui-color-border);border-radius:var(--ui-radius);box-shadow:var(--ui-shadow-2);font-family:var(--ui-font-default);animation:ui-scale-in var(--ui-motion-fast) var(--ui-ease-standard)}.mi{padding:var(--ui-space-2) var(--ui-space-3);background:none;border:none;border-radius:6px;text-align:left;cursor:pointer;color:var(--ui-color-text);font:inherit;font-size:var(--ui-font-size-md)}.mi:hover:not(:disabled){background:color-mix(in srgb,var(--ui-color-primary) 18%,transparent)}.mi.danger{color:var(--ui-color-danger)}.mi:disabled{opacity:.5;cursor:not-allowed}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiContextMenuPanel, decorators: [{
            type: Component,
            args: [{ selector: 'ui-context-menu-panel', template: `
    <div class="cm" role="menu">
      @for (item of items(); track item.value) {
        <button type="button" role="menuitem" class="mi" [class.danger]="item.danger"
                [disabled]="item.disabled" (click)="pick(item)">{{ item.label }}</button>
      }
    </div>
  `, styles: [".cm{display:flex;flex-direction:column;min-width:170px;padding:var(--ui-space-1);background:var(--ui-color-surface-raised);border:1px solid var(--ui-color-border);border-radius:var(--ui-radius);box-shadow:var(--ui-shadow-2);font-family:var(--ui-font-default);animation:ui-scale-in var(--ui-motion-fast) var(--ui-ease-standard)}.mi{padding:var(--ui-space-2) var(--ui-space-3);background:none;border:none;border-radius:6px;text-align:left;cursor:pointer;color:var(--ui-color-text);font:inherit;font-size:var(--ui-font-size-md)}.mi:hover:not(:disabled){background:color-mix(in srgb,var(--ui-color-primary) 18%,transparent)}.mi.danger{color:var(--ui-color-danger)}.mi:disabled{opacity:.5;cursor:not-allowed}\n"] }]
        }] });
/**
 * `uiContextMenu` — opens a menu at the pointer on right-click (CDK Overlay).
 * Bind the items and listen to `(contextSelect)`.
 */
class UiContextMenu {
    overlay = inject(Overlay);
    items = input([], { ...(ngDevMode ? { debugName: "items" } : /* istanbul ignore next */ {}), alias: 'uiContextMenu' });
    contextSelect = output();
    ref = null;
    open(e) {
        e.preventDefault();
        this.close();
        const positionStrategy = this.overlay.position().global()
            .left(`${e.clientX}px`).top(`${e.clientY}px`);
        this.ref = this.overlay.create({ positionStrategy, scrollStrategy: this.overlay.scrollStrategies.close() });
        const panel = this.ref.attach(new ComponentPortal(UiContextMenuPanel)).instance;
        panel.items.set(this.items());
        panel.onPick = (item) => { this.contextSelect.emit(item); this.close(); };
        setTimeout(() => this.ref?.outsidePointerEvents().subscribe(() => this.close()));
    }
    close() {
        this.ref?.dispose();
        this.ref = null;
    }
    ngOnDestroy() { this.close(); }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiContextMenu, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "17.1.0", version: "22.0.4", type: UiContextMenu, isStandalone: true, selector: "[uiContextMenu]", inputs: { items: { classPropertyName: "items", publicName: "uiContextMenu", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { contextSelect: "contextSelect" }, host: { listeners: { "contextmenu": "open($event)" } }, ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiContextMenu, decorators: [{
            type: Directive,
            args: [{
                    selector: '[uiContextMenu]',
                    host: { '(contextmenu)': 'open($event)' },
                }]
        }], propDecorators: { items: [{ type: i0.Input, args: [{ isSignal: true, alias: "uiContextMenu", required: false }] }], contextSelect: [{ type: i0.Output, args: ["contextSelect"] }] } });

/**
 * Generated bundle index. Do not edit.
 */

export { UiBackdrop, UiClickOutside, UiContextMenu, UiContextMenuPanel, UiMenu, UiPopover, UiTooltip, UiTooltipPanel };
//# sourceMappingURL=ui-overlay.mjs.map
