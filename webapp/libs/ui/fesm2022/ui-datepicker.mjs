import { CdkOverlayOrigin, CdkConnectedOverlay } from '@angular/cdk/overlay';
import * as i0 from '@angular/core';
import { inject, input, signal, computed, forwardRef, Component } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { UI_CONFIG } from 'ui';

const WEEKDAYS$2 = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS$2 = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
function iso$2(y, m, d) {
    return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}
/**
 * `ui-date-picker` — calendar popover (CVA; value is an ISO `YYYY-MM-DD`
 * string). Backed by the CDK Overlay; closes on outside click / Escape.
 */
class UiDatePicker {
    config = inject(UI_CONFIG);
    placeholder = input('Select a date', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "placeholder" }] : /* istanbul ignore next */ []));
    size = input('md', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "size" }] : /* istanbul ignore next */ []));
    radius = input(this.config.radius, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "radius" }] : /* istanbul ignore next */ []));
    value = signal(null, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "value" }] : /* istanbul ignore next */ []));
    open = signal(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "open" }] : /* istanbul ignore next */ []));
    disabled = signal(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "disabled" }] : /* istanbul ignore next */ []));
    weekdays = WEEKDAYS$2;
    // [year, monthIndex] currently displayed.
    view = signal(this.initialView(), /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "view" }] : /* istanbul ignore next */ []));
    positions = [
        { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' },
        { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom' },
    ];
    display = computed(() => {
        const v = this.value();
        if (!v)
            return '';
        const [y, m, d] = v.split('-').map(Number);
        return `${MONTHS$2[m - 1]} ${d}, ${y}`;
    }, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "display" }] : /* istanbul ignore next */ []));
    monthLabel = computed(() => `${MONTHS$2[this.view()[1]]} ${this.view()[0]}`, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "monthLabel" }] : /* istanbul ignore next */ []));
    leading = computed(() => {
        const [y, m] = this.view();
        return Array.from({ length: new Date(y, m, 1).getDay() });
    }, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "leading" }] : /* istanbul ignore next */ []));
    days = computed(() => {
        const [y, m] = this.view();
        const count = new Date(y, m + 1, 0).getDate();
        const today = new Date();
        const todayIso = iso$2(today.getFullYear(), today.getMonth(), today.getDate());
        return Array.from({ length: count }, (_, i) => {
            const d = i + 1;
            const cellIso = iso$2(y, m, d);
            return { day: d, iso: cellIso, today: cellIso === todayIso };
        });
    }, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "days" }] : /* istanbul ignore next */ []));
    initialView() {
        const now = new Date();
        return [now.getFullYear(), now.getMonth()];
    }
    writeValue(v) {
        this.value.set(v ?? null);
        if (v) {
            const [y, m] = v.split('-').map(Number);
            this.view.set([y, m - 1]);
        }
    }
    onChange = () => { };
    onTouched = () => { };
    registerOnChange(fn) { this.onChange = fn; }
    registerOnTouched(fn) { this.onTouched = fn; }
    setDisabledState(d) { this.disabled.set(d); }
    shift(delta) {
        const [y, m] = this.view();
        const date = new Date(y, m + delta, 1);
        this.view.set([date.getFullYear(), date.getMonth()]);
    }
    pick(isoDate) {
        this.value.set(isoDate);
        this.onChange(isoDate);
        this.onTouched();
        this.open.set(false);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiDatePicker, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "22.0.4", type: UiDatePicker, isStandalone: true, selector: "ui-date-picker", inputs: { placeholder: { classPropertyName: "placeholder", publicName: "placeholder", isSignal: true, isRequired: false, transformFunction: null }, size: { classPropertyName: "size", publicName: "size", isSignal: true, isRequired: false, transformFunction: null }, radius: { classPropertyName: "radius", publicName: "radius", isSignal: true, isRequired: false, transformFunction: null } }, providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiDatePicker), multi: true }], ngImport: i0, template: `
    <div class="wrap" cdkOverlayOrigin #origin="cdkOverlayOrigin" [class.no-radius]="!radius()" [attr.data-size]="size()">
      <input
        class="ui-date"
        readonly
        [attr.placeholder]="placeholder()"
        [value]="display()"
        [disabled]="disabled()"
        (click)="open.set(!open())"
        (keydown.escape)="open.set(false)" />
      <span class="cal" aria-hidden="true">📅</span>
    </div>

    <ng-template
      cdkConnectedOverlay
      [cdkConnectedOverlayOrigin]="origin"
      [cdkConnectedOverlayOpen]="open()"
      [cdkConnectedOverlayPositions]="positions"
      (overlayOutsideClick)="open.set(false)">
      <div class="cal-panel" (keydown.escape)="open.set(false)">
        <div class="cal-head">
          <button type="button" class="nav" aria-label="Previous month" (click)="shift(-1)">‹</button>
          <span class="month">{{ monthLabel() }}</span>
          <button type="button" class="nav" aria-label="Next month" (click)="shift(1)">›</button>
        </div>
        <div class="weekdays">
          @for (w of weekdays; track w) { <span class="wd">{{ w }}</span> }
        </div>
        <div class="grid" role="grid">
          @for (blank of leading(); track $index) { <span class="cell empty"></span> }
          @for (cell of days(); track cell.iso) {
            <button
              type="button"
              class="cell"
              [class.selected]="cell.iso === value()"
              [class.today]="cell.today"
              [attr.aria-selected]="cell.iso === value()"
              (click)="pick(cell.iso)">{{ cell.day }}</button>
          }
        </div>
      </div>
    </ng-template>
  `, isInline: true, styles: [":host{display:block}.wrap{position:relative}.ui-date{width:100%;box-sizing:border-box;height:var(--ui-size-md);padding:0 var(--ui-space-6) 0 var(--ui-space-3);cursor:pointer;background:var(--ui-color-surface);color:var(--ui-color-text);border:1px solid var(--ui-color-border);border-radius:var(--ui-radius);font-family:var(--ui-font-default);font-size:var(--ui-font-size-md);outline:none;transition:border-color var(--ui-motion-base) var(--ui-ease-standard),box-shadow var(--ui-motion-base) var(--ui-ease-standard)}.ui-date:focus{border-color:var(--ui-color-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--ui-color-primary) 30%,transparent)}.wrap.no-radius .ui-date{border-radius:0}.wrap[data-size=sm] .ui-date{height:var(--ui-size-sm);font-size:var(--ui-font-size-sm)}.wrap[data-size=lg] .ui-date{height:var(--ui-size-lg);font-size:var(--ui-font-size-lg)}.cal{position:absolute;right:var(--ui-space-3);top:50%;transform:translateY(-50%);pointer-events:none;font-size:13px}.cal-panel{margin-top:var(--ui-space-1);padding:var(--ui-space-3);background:var(--ui-color-surface-raised);border:1px solid var(--ui-color-border);border-radius:var(--ui-radius);box-shadow:var(--ui-shadow-2);font-family:var(--ui-font-default);width:252px}.cal-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--ui-space-2)}.month{font-weight:600;font-size:var(--ui-font-size-sm);color:var(--ui-color-text)}.nav{width:26px;height:26px;border:none;background:transparent;color:var(--ui-color-text-muted);border-radius:6px;cursor:pointer}.nav:hover{background:var(--ui-color-surface);color:var(--ui-color-text)}.weekdays,.grid{display:grid;grid-template-columns:repeat(7,1fr);gap:2px}.wd{text-align:center;font-size:11px;color:var(--ui-color-text-muted);padding:2px 0}.cell{aspect-ratio:1;border:none;background:transparent;color:var(--ui-color-text);border-radius:6px;cursor:pointer;font:inherit;font-size:var(--ui-font-size-sm)}.cell.empty{background:none;cursor:default}.cell:not(.empty):hover{background:var(--ui-color-surface)}.cell.today{box-shadow:inset 0 0 0 1px var(--ui-color-border)}.cell.selected{background:var(--ui-color-primary);color:var(--ui-color-primary-contrast)}.cell:focus-visible{outline:none;box-shadow:var(--ui-focus-ring)}\n"], dependencies: [{ kind: "directive", type: CdkOverlayOrigin, selector: "[cdk-overlay-origin], [overlay-origin], [cdkOverlayOrigin]", exportAs: ["cdkOverlayOrigin"] }, { kind: "directive", type: CdkConnectedOverlay, selector: "[cdk-connected-overlay], [connected-overlay], [cdkConnectedOverlay]", inputs: ["cdkConnectedOverlayOrigin", "cdkConnectedOverlayPositions", "cdkConnectedOverlayPositionStrategy", "cdkConnectedOverlayOffsetX", "cdkConnectedOverlayOffsetY", "cdkConnectedOverlayWidth", "cdkConnectedOverlayHeight", "cdkConnectedOverlayMinWidth", "cdkConnectedOverlayMinHeight", "cdkConnectedOverlayBackdropClass", "cdkConnectedOverlayPanelClass", "cdkConnectedOverlayViewportMargin", "cdkConnectedOverlayScrollStrategy", "cdkConnectedOverlayOpen", "cdkConnectedOverlayDisableClose", "cdkConnectedOverlayTransformOriginOn", "cdkConnectedOverlayHasBackdrop", "cdkConnectedOverlayLockPosition", "cdkConnectedOverlayFlexibleDimensions", "cdkConnectedOverlayGrowAfterOpen", "cdkConnectedOverlayPush", "cdkConnectedOverlayDisposeOnNavigation", "cdkConnectedOverlayUsePopover", "cdkConnectedOverlayMatchWidth", "cdkConnectedOverlay"], outputs: ["backdropClick", "positionChange", "attach", "detach", "overlayKeydown", "overlayOutsideClick"], exportAs: ["cdkConnectedOverlay"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiDatePicker, decorators: [{
            type: Component,
            args: [{ selector: 'ui-date-picker', imports: [CdkOverlayOrigin, CdkConnectedOverlay], template: `
    <div class="wrap" cdkOverlayOrigin #origin="cdkOverlayOrigin" [class.no-radius]="!radius()" [attr.data-size]="size()">
      <input
        class="ui-date"
        readonly
        [attr.placeholder]="placeholder()"
        [value]="display()"
        [disabled]="disabled()"
        (click)="open.set(!open())"
        (keydown.escape)="open.set(false)" />
      <span class="cal" aria-hidden="true">📅</span>
    </div>

    <ng-template
      cdkConnectedOverlay
      [cdkConnectedOverlayOrigin]="origin"
      [cdkConnectedOverlayOpen]="open()"
      [cdkConnectedOverlayPositions]="positions"
      (overlayOutsideClick)="open.set(false)">
      <div class="cal-panel" (keydown.escape)="open.set(false)">
        <div class="cal-head">
          <button type="button" class="nav" aria-label="Previous month" (click)="shift(-1)">‹</button>
          <span class="month">{{ monthLabel() }}</span>
          <button type="button" class="nav" aria-label="Next month" (click)="shift(1)">›</button>
        </div>
        <div class="weekdays">
          @for (w of weekdays; track w) { <span class="wd">{{ w }}</span> }
        </div>
        <div class="grid" role="grid">
          @for (blank of leading(); track $index) { <span class="cell empty"></span> }
          @for (cell of days(); track cell.iso) {
            <button
              type="button"
              class="cell"
              [class.selected]="cell.iso === value()"
              [class.today]="cell.today"
              [attr.aria-selected]="cell.iso === value()"
              (click)="pick(cell.iso)">{{ cell.day }}</button>
          }
        </div>
      </div>
    </ng-template>
  `, providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiDatePicker), multi: true }], styles: [":host{display:block}.wrap{position:relative}.ui-date{width:100%;box-sizing:border-box;height:var(--ui-size-md);padding:0 var(--ui-space-6) 0 var(--ui-space-3);cursor:pointer;background:var(--ui-color-surface);color:var(--ui-color-text);border:1px solid var(--ui-color-border);border-radius:var(--ui-radius);font-family:var(--ui-font-default);font-size:var(--ui-font-size-md);outline:none;transition:border-color var(--ui-motion-base) var(--ui-ease-standard),box-shadow var(--ui-motion-base) var(--ui-ease-standard)}.ui-date:focus{border-color:var(--ui-color-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--ui-color-primary) 30%,transparent)}.wrap.no-radius .ui-date{border-radius:0}.wrap[data-size=sm] .ui-date{height:var(--ui-size-sm);font-size:var(--ui-font-size-sm)}.wrap[data-size=lg] .ui-date{height:var(--ui-size-lg);font-size:var(--ui-font-size-lg)}.cal{position:absolute;right:var(--ui-space-3);top:50%;transform:translateY(-50%);pointer-events:none;font-size:13px}.cal-panel{margin-top:var(--ui-space-1);padding:var(--ui-space-3);background:var(--ui-color-surface-raised);border:1px solid var(--ui-color-border);border-radius:var(--ui-radius);box-shadow:var(--ui-shadow-2);font-family:var(--ui-font-default);width:252px}.cal-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--ui-space-2)}.month{font-weight:600;font-size:var(--ui-font-size-sm);color:var(--ui-color-text)}.nav{width:26px;height:26px;border:none;background:transparent;color:var(--ui-color-text-muted);border-radius:6px;cursor:pointer}.nav:hover{background:var(--ui-color-surface);color:var(--ui-color-text)}.weekdays,.grid{display:grid;grid-template-columns:repeat(7,1fr);gap:2px}.wd{text-align:center;font-size:11px;color:var(--ui-color-text-muted);padding:2px 0}.cell{aspect-ratio:1;border:none;background:transparent;color:var(--ui-color-text);border-radius:6px;cursor:pointer;font:inherit;font-size:var(--ui-font-size-sm)}.cell.empty{background:none;cursor:default}.cell:not(.empty):hover{background:var(--ui-color-surface)}.cell.today{box-shadow:inset 0 0 0 1px var(--ui-color-border)}.cell.selected{background:var(--ui-color-primary);color:var(--ui-color-primary-contrast)}.cell:focus-visible{outline:none;box-shadow:var(--ui-focus-ring)}\n"] }]
        }], propDecorators: { placeholder: [{ type: i0.Input, args: [{ isSignal: true, alias: "placeholder", required: false }] }], size: [{ type: i0.Input, args: [{ isSignal: true, alias: "size", required: false }] }], radius: [{ type: i0.Input, args: [{ isSignal: true, alias: "radius", required: false }] }] } });

const WEEKDAYS$1 = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS$1 = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const iso$1 = (y, m, d) => `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
/** `ui-calendar` — inline month calendar (CVA; value is an ISO `YYYY-MM-DD` string). */
class UiCalendar {
    weekdays = WEEKDAYS$1;
    MONTHS = MONTHS$1;
    value = signal(null, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "value" }] : /* istanbul ignore next */ []));
    disabled = signal(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "disabled" }] : /* istanbul ignore next */ []));
    view = signal([new Date().getFullYear(), new Date().getMonth()], /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "view" }] : /* istanbul ignore next */ []));
    leading = computed(() => Array.from({ length: new Date(this.view()[0], this.view()[1], 1).getDay() }), /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "leading" }] : /* istanbul ignore next */ []));
    days = computed(() => {
        const [y, m] = this.view();
        const count = new Date(y, m + 1, 0).getDate();
        const today = new Date();
        const todayIso = iso$1(today.getFullYear(), today.getMonth(), today.getDate());
        return Array.from({ length: count }, (_, i) => ({ day: i + 1, iso: iso$1(y, m, i + 1), today: iso$1(y, m, i + 1) === todayIso }));
    }, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "days" }] : /* istanbul ignore next */ []));
    onChange = () => { };
    onTouched = () => { };
    writeValue(v) { this.value.set(v ?? null); if (v) {
        const [y, m] = v.split('-').map(Number);
        this.view.set([y, m - 1]);
    } }
    registerOnChange(fn) { this.onChange = fn; }
    registerOnTouched(fn) { this.onTouched = fn; }
    setDisabledState(d) { this.disabled.set(d); }
    shift(delta) { const d = new Date(this.view()[0], this.view()[1] + delta, 1); this.view.set([d.getFullYear(), d.getMonth()]); }
    pick(isoDate) { this.value.set(isoDate); this.onChange(isoDate); this.onTouched(); }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiCalendar, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "22.0.4", type: UiCalendar, isStandalone: true, selector: "ui-calendar", providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiCalendar), multi: true }], ngImport: i0, template: `
    <div class="cal">
      <div class="head">
        <button type="button" class="nav" aria-label="Previous month" (click)="shift(-1)">‹</button>
        <span class="month">{{ MONTHS[view()[1]] }} {{ view()[0] }}</span>
        <button type="button" class="nav" aria-label="Next month" (click)="shift(1)">›</button>
      </div>
      <div class="weekdays">@for (w of weekdays; track w) { <span>{{ w }}</span> }</div>
      <div class="grid" role="grid">
        @for (b of leading(); track $index) { <span class="cell empty"></span> }
        @for (c of days(); track c.iso) {
          <button type="button" class="cell" [class.selected]="c.iso === value()" [class.today]="c.today" (click)="pick(c.iso)">{{ c.day }}</button>
        }
      </div>
    </div>
  `, isInline: true, styles: [":host{display:inline-block}.cal{padding:var(--ui-space-3);background:var(--ui-color-surface);border:1px solid var(--ui-color-border);border-radius:var(--ui-radius);width:252px;font-family:var(--ui-font-default)}.head{display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--ui-space-2)}.month{font-weight:600;font-size:var(--ui-font-size-sm);color:var(--ui-color-text)}.nav{width:26px;height:26px;border:none;background:transparent;color:var(--ui-color-text-muted);border-radius:6px;cursor:pointer}.nav:hover{background:var(--ui-color-surface-raised);color:var(--ui-color-text)}.weekdays,.grid{display:grid;grid-template-columns:repeat(7,1fr);gap:2px}.weekdays span{text-align:center;font-size:11px;color:var(--ui-color-text-muted);padding:2px 0}.cell{aspect-ratio:1;border:none;background:transparent;color:var(--ui-color-text);border-radius:6px;cursor:pointer;font:inherit;font-size:var(--ui-font-size-sm)}.cell.empty{cursor:default}.cell:not(.empty):hover{background:var(--ui-color-surface-raised)}.cell.today{box-shadow:inset 0 0 0 1px var(--ui-color-border)}.cell.selected{background:var(--ui-color-primary);color:var(--ui-color-primary-contrast)}.cell:focus-visible{outline:none;box-shadow:var(--ui-focus-ring)}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiCalendar, decorators: [{
            type: Component,
            args: [{ selector: 'ui-calendar', template: `
    <div class="cal">
      <div class="head">
        <button type="button" class="nav" aria-label="Previous month" (click)="shift(-1)">‹</button>
        <span class="month">{{ MONTHS[view()[1]] }} {{ view()[0] }}</span>
        <button type="button" class="nav" aria-label="Next month" (click)="shift(1)">›</button>
      </div>
      <div class="weekdays">@for (w of weekdays; track w) { <span>{{ w }}</span> }</div>
      <div class="grid" role="grid">
        @for (b of leading(); track $index) { <span class="cell empty"></span> }
        @for (c of days(); track c.iso) {
          <button type="button" class="cell" [class.selected]="c.iso === value()" [class.today]="c.today" (click)="pick(c.iso)">{{ c.day }}</button>
        }
      </div>
    </div>
  `, providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiCalendar), multi: true }], styles: [":host{display:inline-block}.cal{padding:var(--ui-space-3);background:var(--ui-color-surface);border:1px solid var(--ui-color-border);border-radius:var(--ui-radius);width:252px;font-family:var(--ui-font-default)}.head{display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--ui-space-2)}.month{font-weight:600;font-size:var(--ui-font-size-sm);color:var(--ui-color-text)}.nav{width:26px;height:26px;border:none;background:transparent;color:var(--ui-color-text-muted);border-radius:6px;cursor:pointer}.nav:hover{background:var(--ui-color-surface-raised);color:var(--ui-color-text)}.weekdays,.grid{display:grid;grid-template-columns:repeat(7,1fr);gap:2px}.weekdays span{text-align:center;font-size:11px;color:var(--ui-color-text-muted);padding:2px 0}.cell{aspect-ratio:1;border:none;background:transparent;color:var(--ui-color-text);border-radius:6px;cursor:pointer;font:inherit;font-size:var(--ui-font-size-sm)}.cell.empty{cursor:default}.cell:not(.empty):hover{background:var(--ui-color-surface-raised)}.cell.today{box-shadow:inset 0 0 0 1px var(--ui-color-border)}.cell.selected{background:var(--ui-color-primary);color:var(--ui-color-primary-contrast)}.cell:focus-visible{outline:none;box-shadow:var(--ui-focus-ring)}\n"] }]
        }] });

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const iso = (y, m, d) => `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
/** `ui-date-range-picker` — inline range selection (CVA; value is `{ start, end }` ISO strings). */
class UiDateRangePicker {
    weekdays = WEEKDAYS;
    MONTHS = MONTHS;
    range = signal({ start: null, end: null }, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "range" }] : /* istanbul ignore next */ []));
    hover = signal(null, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "hover" }] : /* istanbul ignore next */ []));
    disabled = signal(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "disabled" }] : /* istanbul ignore next */ []));
    view = signal([new Date().getFullYear(), new Date().getMonth()], /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "view" }] : /* istanbul ignore next */ []));
    leading = computed(() => Array.from({ length: new Date(this.view()[0], this.view()[1], 1).getDay() }), /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "leading" }] : /* istanbul ignore next */ []));
    days = computed(() => {
        const [y, m] = this.view();
        const count = new Date(y, m + 1, 0).getDate();
        return Array.from({ length: count }, (_, i) => ({ day: i + 1, iso: iso(y, m, i + 1) }));
    }, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "days" }] : /* istanbul ignore next */ []));
    onChange = () => { };
    onTouched = () => { };
    writeValue(v) { this.range.set(v ?? { start: null, end: null }); }
    registerOnChange(fn) { this.onChange = fn; }
    registerOnTouched(fn) { this.onTouched = fn; }
    setDisabledState(d) { this.disabled.set(d); }
    shift(delta) { const d = new Date(this.view()[0], this.view()[1] + delta, 1); this.view.set([d.getFullYear(), d.getMonth()]); }
    inRange(d) {
        const { start, end } = this.range();
        if (!start)
            return false;
        const hi = end ?? this.hover();
        if (!hi)
            return false;
        const lo = start < hi ? start : hi;
        const up = start < hi ? hi : start;
        return d > lo && d < up;
    }
    pick(d) {
        const { start, end } = this.range();
        let next;
        if (!start || (start && end))
            next = { start: d, end: null };
        else
            next = d < start ? { start: d, end: start } : { start, end: d };
        this.range.set(next);
        this.onChange(next);
        if (next.end)
            this.onTouched();
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiDateRangePicker, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "22.0.4", type: UiDateRangePicker, isStandalone: true, selector: "ui-date-range-picker", providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiDateRangePicker), multi: true }], ngImport: i0, template: `
    <div class="cal">
      <div class="head">
        <button type="button" class="nav" aria-label="Previous month" (click)="shift(-1)">‹</button>
        <span class="month">{{ MONTHS[view()[1]] }} {{ view()[0] }}</span>
        <button type="button" class="nav" aria-label="Next month" (click)="shift(1)">›</button>
      </div>
      <div class="weekdays">@for (w of weekdays; track w) { <span>{{ w }}</span> }</div>
      <div class="grid" role="grid">
        @for (b of leading(); track $index) { <span class="cell empty"></span> }
        @for (c of days(); track c.iso) {
          <button type="button" class="cell" [class.start]="c.iso === range().start" [class.end]="c.iso === range().end"
                  [class.inrange]="inRange(c.iso)" (click)="pick(c.iso)" (mouseenter)="hover.set(c.iso)">{{ c.day }}</button>
        }
      </div>
      <div class="foot">{{ range().start || '—' }} → {{ range().end || '—' }}</div>
    </div>
  `, isInline: true, styles: [":host{display:inline-block}.cal{padding:var(--ui-space-3);background:var(--ui-color-surface);border:1px solid var(--ui-color-border);border-radius:var(--ui-radius);width:252px;font-family:var(--ui-font-default)}.head{display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--ui-space-2)}.month{font-weight:600;font-size:var(--ui-font-size-sm)}.nav{width:26px;height:26px;border:none;background:transparent;color:var(--ui-color-text-muted);border-radius:6px;cursor:pointer}.nav:hover{background:var(--ui-color-surface-raised);color:var(--ui-color-text)}.weekdays,.grid{display:grid;grid-template-columns:repeat(7,1fr);gap:2px}.weekdays span{text-align:center;font-size:11px;color:var(--ui-color-text-muted);padding:2px 0}.cell{aspect-ratio:1;border:none;background:transparent;color:var(--ui-color-text);border-radius:6px;cursor:pointer;font:inherit;font-size:var(--ui-font-size-sm)}.cell.empty{cursor:default}.cell:not(.empty):hover{background:var(--ui-color-surface-raised)}.cell.inrange{background:color-mix(in srgb,var(--ui-color-primary) 18%,transparent);border-radius:0}.cell.start,.cell.end{background:var(--ui-color-primary);color:var(--ui-color-primary-contrast)}.foot{margin-top:var(--ui-space-2);font-size:12px;color:var(--ui-color-text-muted);font-family:var(--ui-font-mono)}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiDateRangePicker, decorators: [{
            type: Component,
            args: [{ selector: 'ui-date-range-picker', template: `
    <div class="cal">
      <div class="head">
        <button type="button" class="nav" aria-label="Previous month" (click)="shift(-1)">‹</button>
        <span class="month">{{ MONTHS[view()[1]] }} {{ view()[0] }}</span>
        <button type="button" class="nav" aria-label="Next month" (click)="shift(1)">›</button>
      </div>
      <div class="weekdays">@for (w of weekdays; track w) { <span>{{ w }}</span> }</div>
      <div class="grid" role="grid">
        @for (b of leading(); track $index) { <span class="cell empty"></span> }
        @for (c of days(); track c.iso) {
          <button type="button" class="cell" [class.start]="c.iso === range().start" [class.end]="c.iso === range().end"
                  [class.inrange]="inRange(c.iso)" (click)="pick(c.iso)" (mouseenter)="hover.set(c.iso)">{{ c.day }}</button>
        }
      </div>
      <div class="foot">{{ range().start || '—' }} → {{ range().end || '—' }}</div>
    </div>
  `, providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiDateRangePicker), multi: true }], styles: [":host{display:inline-block}.cal{padding:var(--ui-space-3);background:var(--ui-color-surface);border:1px solid var(--ui-color-border);border-radius:var(--ui-radius);width:252px;font-family:var(--ui-font-default)}.head{display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--ui-space-2)}.month{font-weight:600;font-size:var(--ui-font-size-sm)}.nav{width:26px;height:26px;border:none;background:transparent;color:var(--ui-color-text-muted);border-radius:6px;cursor:pointer}.nav:hover{background:var(--ui-color-surface-raised);color:var(--ui-color-text)}.weekdays,.grid{display:grid;grid-template-columns:repeat(7,1fr);gap:2px}.weekdays span{text-align:center;font-size:11px;color:var(--ui-color-text-muted);padding:2px 0}.cell{aspect-ratio:1;border:none;background:transparent;color:var(--ui-color-text);border-radius:6px;cursor:pointer;font:inherit;font-size:var(--ui-font-size-sm)}.cell.empty{cursor:default}.cell:not(.empty):hover{background:var(--ui-color-surface-raised)}.cell.inrange{background:color-mix(in srgb,var(--ui-color-primary) 18%,transparent);border-radius:0}.cell.start,.cell.end{background:var(--ui-color-primary);color:var(--ui-color-primary-contrast)}.foot{margin-top:var(--ui-space-2);font-size:12px;color:var(--ui-color-text-muted);font-family:var(--ui-font-mono)}\n"] }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { UiCalendar, UiDatePicker, UiDateRangePicker };
//# sourceMappingURL=ui-datepicker.mjs.map
