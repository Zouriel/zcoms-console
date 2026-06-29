import { CdkOverlayOrigin, CdkConnectedOverlay } from '@angular/cdk/overlay';
import * as i0 from '@angular/core';
import { inject, input, signal, computed, forwardRef, Component } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { UI_CONFIG } from 'ui';

/**
 * `ui-combobox` — filterable autocomplete (CVA). Type to filter; Arrow keys +
 * Enter to choose; Escape to close. Backed by the CDK Overlay (WAI-ARIA combobox).
 */
class UiCombobox {
    config = inject(UI_CONFIG);
    options = input([], /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "options" }] : /* istanbul ignore next */ []));
    placeholder = input('Search…', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "placeholder" }] : /* istanbul ignore next */ []));
    size = input('md', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "size" }] : /* istanbul ignore next */ []));
    radius = input(this.config.radius, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "radius" }] : /* istanbul ignore next */ []));
    query = signal('', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "query" }] : /* istanbul ignore next */ []));
    value = signal(null, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "value" }] : /* istanbul ignore next */ []));
    open = signal(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "open" }] : /* istanbul ignore next */ []));
    activeIndex = signal(0, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "activeIndex" }] : /* istanbul ignore next */ []));
    disabled = signal(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "disabled" }] : /* istanbul ignore next */ []));
    triggerWidth = signal('auto', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "triggerWidth" }] : /* istanbul ignore next */ []));
    positions = [
        { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' },
        { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom' },
    ];
    filtered = computed(() => {
        const q = this.query().trim().toLowerCase();
        if (!q)
            return this.options();
        return this.options().filter((o) => o.label.toLowerCase().includes(q));
    }, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "filtered" }] : /* istanbul ignore next */ []));
    onChange = () => { };
    onTouched = () => { };
    writeValue(v) {
        this.value.set(v ?? null);
        const match = this.options().find((o) => o.value === v);
        this.query.set(match ? match.label : '');
    }
    registerOnChange(fn) { this.onChange = fn; }
    registerOnTouched(fn) { this.onTouched = fn; }
    setDisabledState(d) { this.disabled.set(d); }
    onInput(e) {
        this.query.set(e.target.value);
        this.open.set(true);
        this.activeIndex.set(0);
    }
    onKeydown(e) {
        const items = this.filtered();
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            this.open.set(true);
            this.activeIndex.update((i) => Math.min(items.length - 1, i + 1));
        }
        else if (e.key === 'ArrowUp') {
            e.preventDefault();
            this.activeIndex.update((i) => Math.max(0, i - 1));
        }
        else if (e.key === 'Enter') {
            e.preventDefault();
            const opt = items[this.activeIndex()];
            if (opt)
                this.select(opt);
        }
        else if (e.key === 'Escape') {
            this.open.set(false);
        }
    }
    select(opt) {
        this.value.set(opt.value);
        this.query.set(opt.label);
        this.open.set(false);
        this.onChange(opt.value);
    }
    onBlur() {
        this.onTouched();
        // Restore the selected label if the typed query doesn't match a selection.
        const match = this.options().find((o) => o.value === this.value());
        if (match && this.query() !== match.label)
            this.query.set(match.label);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiCombobox, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "22.0.4", type: UiCombobox, isStandalone: true, selector: "ui-combobox", inputs: { options: { classPropertyName: "options", publicName: "options", isSignal: true, isRequired: false, transformFunction: null }, placeholder: { classPropertyName: "placeholder", publicName: "placeholder", isSignal: true, isRequired: false, transformFunction: null }, size: { classPropertyName: "size", publicName: "size", isSignal: true, isRequired: false, transformFunction: null }, radius: { classPropertyName: "radius", publicName: "radius", isSignal: true, isRequired: false, transformFunction: null } }, providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiCombobox), multi: true }], ngImport: i0, template: `
    <div class="wrap" cdkOverlayOrigin #origin="cdkOverlayOrigin" [class.no-radius]="!radius()" [attr.data-size]="size()">
      <input
        class="ui-combobox"
        role="combobox"
        [attr.aria-expanded]="open()"
        aria-autocomplete="list"
        [attr.placeholder]="placeholder()"
        [value]="query()"
        [disabled]="disabled()"
        (input)="onInput($event)"
        (focus)="open.set(true)"
        (keydown)="onKeydown($event)"
        (blur)="onBlur()" />
      <span class="chevron" aria-hidden="true">▾</span>
    </div>

    <ng-template
      cdkConnectedOverlay
      [cdkConnectedOverlayOrigin]="origin"
      [cdkConnectedOverlayOpen]="open() && filtered().length > 0"
      [cdkConnectedOverlayPositions]="positions"
      [cdkConnectedOverlayWidth]="triggerWidth()"
      (overlayOutsideClick)="open.set(false)">
      <ul class="panel" role="listbox">
        @for (opt of filtered(); track opt.value; let i = $index) {
          <li
            role="option"
            class="opt"
            [class.active]="i === activeIndex()"
            [attr.aria-selected]="opt.value === value()"
            (mousedown)="$event.preventDefault(); select(opt)"
            (mouseenter)="activeIndex.set(i)">
            {{ opt.label }}
          </li>
        }
      </ul>
    </ng-template>
  `, isInline: true, styles: [":host{display:block}.wrap{position:relative}.ui-combobox{width:100%;box-sizing:border-box;height:var(--ui-size-md);padding:0 var(--ui-space-6) 0 var(--ui-space-3);background:var(--ui-color-surface);color:var(--ui-color-text);border:1px solid var(--ui-color-border);border-radius:var(--ui-radius);font-family:var(--ui-font-default);font-size:var(--ui-font-size-md);outline:none;transition:border-color var(--ui-motion-base) var(--ui-ease-standard),box-shadow var(--ui-motion-base) var(--ui-ease-standard)}.ui-combobox:focus{border-color:var(--ui-color-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--ui-color-primary) 30%,transparent)}.wrap.no-radius .ui-combobox{border-radius:0}.wrap[data-size=sm] .ui-combobox{height:var(--ui-size-sm);font-size:var(--ui-font-size-sm)}.wrap[data-size=lg] .ui-combobox{height:var(--ui-size-lg);font-size:var(--ui-font-size-lg)}.chevron{position:absolute;right:var(--ui-space-3);top:50%;transform:translateY(-50%);pointer-events:none;color:var(--ui-color-text-muted)}.panel{margin:var(--ui-space-1) 0 0;padding:var(--ui-space-1);list-style:none;max-height:240px;overflow:auto;background:var(--ui-color-surface-raised);border:1px solid var(--ui-color-border);border-radius:var(--ui-radius);box-shadow:var(--ui-shadow-2);font-family:var(--ui-font-default)}.opt{padding:var(--ui-space-2) var(--ui-space-3);border-radius:6px;cursor:pointer;color:var(--ui-color-text);font-size:var(--ui-font-size-md)}.opt.active{background:color-mix(in srgb,var(--ui-color-primary) 18%,transparent)}.opt[aria-selected=true]{font-weight:600}\n"], dependencies: [{ kind: "directive", type: CdkOverlayOrigin, selector: "[cdk-overlay-origin], [overlay-origin], [cdkOverlayOrigin]", exportAs: ["cdkOverlayOrigin"] }, { kind: "directive", type: CdkConnectedOverlay, selector: "[cdk-connected-overlay], [connected-overlay], [cdkConnectedOverlay]", inputs: ["cdkConnectedOverlayOrigin", "cdkConnectedOverlayPositions", "cdkConnectedOverlayPositionStrategy", "cdkConnectedOverlayOffsetX", "cdkConnectedOverlayOffsetY", "cdkConnectedOverlayWidth", "cdkConnectedOverlayHeight", "cdkConnectedOverlayMinWidth", "cdkConnectedOverlayMinHeight", "cdkConnectedOverlayBackdropClass", "cdkConnectedOverlayPanelClass", "cdkConnectedOverlayViewportMargin", "cdkConnectedOverlayScrollStrategy", "cdkConnectedOverlayOpen", "cdkConnectedOverlayDisableClose", "cdkConnectedOverlayTransformOriginOn", "cdkConnectedOverlayHasBackdrop", "cdkConnectedOverlayLockPosition", "cdkConnectedOverlayFlexibleDimensions", "cdkConnectedOverlayGrowAfterOpen", "cdkConnectedOverlayPush", "cdkConnectedOverlayDisposeOnNavigation", "cdkConnectedOverlayUsePopover", "cdkConnectedOverlayMatchWidth", "cdkConnectedOverlay"], outputs: ["backdropClick", "positionChange", "attach", "detach", "overlayKeydown", "overlayOutsideClick"], exportAs: ["cdkConnectedOverlay"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiCombobox, decorators: [{
            type: Component,
            args: [{ selector: 'ui-combobox', imports: [CdkOverlayOrigin, CdkConnectedOverlay], template: `
    <div class="wrap" cdkOverlayOrigin #origin="cdkOverlayOrigin" [class.no-radius]="!radius()" [attr.data-size]="size()">
      <input
        class="ui-combobox"
        role="combobox"
        [attr.aria-expanded]="open()"
        aria-autocomplete="list"
        [attr.placeholder]="placeholder()"
        [value]="query()"
        [disabled]="disabled()"
        (input)="onInput($event)"
        (focus)="open.set(true)"
        (keydown)="onKeydown($event)"
        (blur)="onBlur()" />
      <span class="chevron" aria-hidden="true">▾</span>
    </div>

    <ng-template
      cdkConnectedOverlay
      [cdkConnectedOverlayOrigin]="origin"
      [cdkConnectedOverlayOpen]="open() && filtered().length > 0"
      [cdkConnectedOverlayPositions]="positions"
      [cdkConnectedOverlayWidth]="triggerWidth()"
      (overlayOutsideClick)="open.set(false)">
      <ul class="panel" role="listbox">
        @for (opt of filtered(); track opt.value; let i = $index) {
          <li
            role="option"
            class="opt"
            [class.active]="i === activeIndex()"
            [attr.aria-selected]="opt.value === value()"
            (mousedown)="$event.preventDefault(); select(opt)"
            (mouseenter)="activeIndex.set(i)">
            {{ opt.label }}
          </li>
        }
      </ul>
    </ng-template>
  `, providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiCombobox), multi: true }], styles: [":host{display:block}.wrap{position:relative}.ui-combobox{width:100%;box-sizing:border-box;height:var(--ui-size-md);padding:0 var(--ui-space-6) 0 var(--ui-space-3);background:var(--ui-color-surface);color:var(--ui-color-text);border:1px solid var(--ui-color-border);border-radius:var(--ui-radius);font-family:var(--ui-font-default);font-size:var(--ui-font-size-md);outline:none;transition:border-color var(--ui-motion-base) var(--ui-ease-standard),box-shadow var(--ui-motion-base) var(--ui-ease-standard)}.ui-combobox:focus{border-color:var(--ui-color-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--ui-color-primary) 30%,transparent)}.wrap.no-radius .ui-combobox{border-radius:0}.wrap[data-size=sm] .ui-combobox{height:var(--ui-size-sm);font-size:var(--ui-font-size-sm)}.wrap[data-size=lg] .ui-combobox{height:var(--ui-size-lg);font-size:var(--ui-font-size-lg)}.chevron{position:absolute;right:var(--ui-space-3);top:50%;transform:translateY(-50%);pointer-events:none;color:var(--ui-color-text-muted)}.panel{margin:var(--ui-space-1) 0 0;padding:var(--ui-space-1);list-style:none;max-height:240px;overflow:auto;background:var(--ui-color-surface-raised);border:1px solid var(--ui-color-border);border-radius:var(--ui-radius);box-shadow:var(--ui-shadow-2);font-family:var(--ui-font-default)}.opt{padding:var(--ui-space-2) var(--ui-space-3);border-radius:6px;cursor:pointer;color:var(--ui-color-text);font-size:var(--ui-font-size-md)}.opt.active{background:color-mix(in srgb,var(--ui-color-primary) 18%,transparent)}.opt[aria-selected=true]{font-weight:600}\n"] }]
        }], propDecorators: { options: [{ type: i0.Input, args: [{ isSignal: true, alias: "options", required: false }] }], placeholder: [{ type: i0.Input, args: [{ isSignal: true, alias: "placeholder", required: false }] }], size: [{ type: i0.Input, args: [{ isSignal: true, alias: "size", required: false }] }], radius: [{ type: i0.Input, args: [{ isSignal: true, alias: "radius", required: false }] }] } });

/** `ui-multi-select` — choose several options; selections shown as chips (CVA; value is string[]). */
class UiMultiSelect {
    config = inject(UI_CONFIG);
    options = input([], /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "options" }] : /* istanbul ignore next */ []));
    placeholder = input('Select…', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "placeholder" }] : /* istanbul ignore next */ []));
    radius = input(this.config.radius, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "radius" }] : /* istanbul ignore next */ []));
    value = signal([], /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "value" }] : /* istanbul ignore next */ []));
    query = signal('', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "query" }] : /* istanbul ignore next */ []));
    open = signal(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "open" }] : /* istanbul ignore next */ []));
    disabled = signal(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "disabled" }] : /* istanbul ignore next */ []));
    width = signal('auto', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "width" }] : /* istanbul ignore next */ []));
    positions = [
        { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' },
        { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom' },
    ];
    filtered = computed(() => {
        const q = this.query().trim().toLowerCase();
        return q ? this.options().filter((o) => o.label.toLowerCase().includes(q)) : this.options();
    }, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "filtered" }] : /* istanbul ignore next */ []));
    onChange = () => { };
    onTouched = () => { };
    writeValue(v) { this.value.set(v ?? []); }
    registerOnChange(fn) { this.onChange = fn; }
    registerOnTouched(fn) { this.onTouched = fn; }
    setDisabledState(d) { this.disabled.set(d); }
    labelOf(v) { return this.options().find((o) => o.value === v)?.label ?? v; }
    onInput(e) { this.query.set(e.target.value); this.open.set(true); }
    toggle(v, e) {
        e?.stopPropagation();
        const next = this.value().includes(v) ? this.value().filter((x) => x !== v) : [...this.value(), v];
        this.value.set(next);
        this.onChange(next);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiMultiSelect, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "22.0.4", type: UiMultiSelect, isStandalone: true, selector: "ui-multi-select", inputs: { options: { classPropertyName: "options", publicName: "options", isSignal: true, isRequired: false, transformFunction: null }, placeholder: { classPropertyName: "placeholder", publicName: "placeholder", isSignal: true, isRequired: false, transformFunction: null }, radius: { classPropertyName: "radius", publicName: "radius", isSignal: true, isRequired: false, transformFunction: null } }, providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiMultiSelect), multi: true }], ngImport: i0, template: `
    <div class="ms" cdkOverlayOrigin #origin="cdkOverlayOrigin" [class.no-radius]="!radius()" (click)="open.set(true)">
      @for (v of value(); track v) {
        <span class="chip">{{ labelOf(v) }}<button type="button" class="x" tabindex="-1" aria-label="Remove" (click)="toggle(v, $event)">×</button></span>
      }
      <input class="entry" [attr.placeholder]="value().length ? '' : placeholder()"
             [value]="query()" [disabled]="disabled()" (input)="onInput($event)" (focus)="open.set(true)" (blur)="onTouched()" />
    </div>
    <ng-template cdkConnectedOverlay [cdkConnectedOverlayOrigin]="origin" [cdkConnectedOverlayOpen]="open() && filtered().length > 0"
                 [cdkConnectedOverlayPositions]="positions" [cdkConnectedOverlayWidth]="width()" (overlayOutsideClick)="open.set(false)">
      <ul class="panel" role="listbox" aria-multiselectable="true">
        @for (opt of filtered(); track opt.value) {
          <li role="option" class="opt" [attr.aria-selected]="value().includes(opt.value)"
              (mousedown)="$event.preventDefault(); toggle(opt.value)">
            <span class="box">{{ value().includes(opt.value) ? '☑' : '☐' }}</span>{{ opt.label }}
          </li>
        }
      </ul>
    </ng-template>
  `, isInline: true, styles: [":host{display:block}.ms{display:flex;flex-wrap:wrap;gap:var(--ui-space-1);align-items:center;min-height:var(--ui-size-md);padding:3px var(--ui-space-2);background:var(--ui-color-surface);border:1px solid var(--ui-color-border);border-radius:var(--ui-radius);cursor:text}.ms:focus-within{border-color:var(--ui-color-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--ui-color-primary) 30%,transparent)}.ms.no-radius{border-radius:0}.chip{display:inline-flex;align-items:center;gap:2px;height:22px;padding:0 var(--ui-space-2);background:color-mix(in srgb,var(--ui-color-primary) 18%,transparent);border:1px solid var(--ui-color-primary);border-radius:999px;font-family:var(--ui-font-default);font-size:var(--ui-font-size-sm);color:var(--ui-color-text)}.x{border:none;background:none;color:inherit;cursor:pointer;font-size:13px;line-height:1;padding:0}.entry{flex:1;min-width:80px;border:none;background:transparent;outline:none;color:var(--ui-color-text);font-family:var(--ui-font-default);font-size:var(--ui-font-size-md);height:22px}.panel{margin:var(--ui-space-1) 0 0;padding:var(--ui-space-1);list-style:none;max-height:240px;overflow:auto;background:var(--ui-color-surface-raised);border:1px solid var(--ui-color-border);border-radius:var(--ui-radius);box-shadow:var(--ui-shadow-2)}.opt{display:flex;align-items:center;gap:var(--ui-space-2);padding:var(--ui-space-2) var(--ui-space-3);border-radius:6px;cursor:pointer;color:var(--ui-color-text);font-family:var(--ui-font-default);font-size:var(--ui-font-size-md)}.opt:hover{background:color-mix(in srgb,var(--ui-color-primary) 14%,transparent)}.box{color:var(--ui-color-primary)}\n"], dependencies: [{ kind: "directive", type: CdkOverlayOrigin, selector: "[cdk-overlay-origin], [overlay-origin], [cdkOverlayOrigin]", exportAs: ["cdkOverlayOrigin"] }, { kind: "directive", type: CdkConnectedOverlay, selector: "[cdk-connected-overlay], [connected-overlay], [cdkConnectedOverlay]", inputs: ["cdkConnectedOverlayOrigin", "cdkConnectedOverlayPositions", "cdkConnectedOverlayPositionStrategy", "cdkConnectedOverlayOffsetX", "cdkConnectedOverlayOffsetY", "cdkConnectedOverlayWidth", "cdkConnectedOverlayHeight", "cdkConnectedOverlayMinWidth", "cdkConnectedOverlayMinHeight", "cdkConnectedOverlayBackdropClass", "cdkConnectedOverlayPanelClass", "cdkConnectedOverlayViewportMargin", "cdkConnectedOverlayScrollStrategy", "cdkConnectedOverlayOpen", "cdkConnectedOverlayDisableClose", "cdkConnectedOverlayTransformOriginOn", "cdkConnectedOverlayHasBackdrop", "cdkConnectedOverlayLockPosition", "cdkConnectedOverlayFlexibleDimensions", "cdkConnectedOverlayGrowAfterOpen", "cdkConnectedOverlayPush", "cdkConnectedOverlayDisposeOnNavigation", "cdkConnectedOverlayUsePopover", "cdkConnectedOverlayMatchWidth", "cdkConnectedOverlay"], outputs: ["backdropClick", "positionChange", "attach", "detach", "overlayKeydown", "overlayOutsideClick"], exportAs: ["cdkConnectedOverlay"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiMultiSelect, decorators: [{
            type: Component,
            args: [{ selector: 'ui-multi-select', imports: [CdkOverlayOrigin, CdkConnectedOverlay], template: `
    <div class="ms" cdkOverlayOrigin #origin="cdkOverlayOrigin" [class.no-radius]="!radius()" (click)="open.set(true)">
      @for (v of value(); track v) {
        <span class="chip">{{ labelOf(v) }}<button type="button" class="x" tabindex="-1" aria-label="Remove" (click)="toggle(v, $event)">×</button></span>
      }
      <input class="entry" [attr.placeholder]="value().length ? '' : placeholder()"
             [value]="query()" [disabled]="disabled()" (input)="onInput($event)" (focus)="open.set(true)" (blur)="onTouched()" />
    </div>
    <ng-template cdkConnectedOverlay [cdkConnectedOverlayOrigin]="origin" [cdkConnectedOverlayOpen]="open() && filtered().length > 0"
                 [cdkConnectedOverlayPositions]="positions" [cdkConnectedOverlayWidth]="width()" (overlayOutsideClick)="open.set(false)">
      <ul class="panel" role="listbox" aria-multiselectable="true">
        @for (opt of filtered(); track opt.value) {
          <li role="option" class="opt" [attr.aria-selected]="value().includes(opt.value)"
              (mousedown)="$event.preventDefault(); toggle(opt.value)">
            <span class="box">{{ value().includes(opt.value) ? '☑' : '☐' }}</span>{{ opt.label }}
          </li>
        }
      </ul>
    </ng-template>
  `, providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiMultiSelect), multi: true }], styles: [":host{display:block}.ms{display:flex;flex-wrap:wrap;gap:var(--ui-space-1);align-items:center;min-height:var(--ui-size-md);padding:3px var(--ui-space-2);background:var(--ui-color-surface);border:1px solid var(--ui-color-border);border-radius:var(--ui-radius);cursor:text}.ms:focus-within{border-color:var(--ui-color-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--ui-color-primary) 30%,transparent)}.ms.no-radius{border-radius:0}.chip{display:inline-flex;align-items:center;gap:2px;height:22px;padding:0 var(--ui-space-2);background:color-mix(in srgb,var(--ui-color-primary) 18%,transparent);border:1px solid var(--ui-color-primary);border-radius:999px;font-family:var(--ui-font-default);font-size:var(--ui-font-size-sm);color:var(--ui-color-text)}.x{border:none;background:none;color:inherit;cursor:pointer;font-size:13px;line-height:1;padding:0}.entry{flex:1;min-width:80px;border:none;background:transparent;outline:none;color:var(--ui-color-text);font-family:var(--ui-font-default);font-size:var(--ui-font-size-md);height:22px}.panel{margin:var(--ui-space-1) 0 0;padding:var(--ui-space-1);list-style:none;max-height:240px;overflow:auto;background:var(--ui-color-surface-raised);border:1px solid var(--ui-color-border);border-radius:var(--ui-radius);box-shadow:var(--ui-shadow-2)}.opt{display:flex;align-items:center;gap:var(--ui-space-2);padding:var(--ui-space-2) var(--ui-space-3);border-radius:6px;cursor:pointer;color:var(--ui-color-text);font-family:var(--ui-font-default);font-size:var(--ui-font-size-md)}.opt:hover{background:color-mix(in srgb,var(--ui-color-primary) 14%,transparent)}.box{color:var(--ui-color-primary)}\n"] }]
        }], propDecorators: { options: [{ type: i0.Input, args: [{ isSignal: true, alias: "options", required: false }] }], placeholder: [{ type: i0.Input, args: [{ isSignal: true, alias: "placeholder", required: false }] }], radius: [{ type: i0.Input, args: [{ isSignal: true, alias: "radius", required: false }] }] } });

/**
 * Generated bundle index. Do not edit.
 */

export { UiCombobox, UiMultiSelect };
//# sourceMappingURL=ui-combobox.mjs.map
