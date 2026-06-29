import * as i0 from '@angular/core';
import { input, computed, Component } from '@angular/core';

/**
 * `ui-progress-bar` — determinate or indeterminate progress.
 * Set `value` (0–100) for determinate; omit/null for indeterminate.
 */
class UiProgressBar {
    value = input(null, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "value" }] : /* istanbul ignore next */ []));
    tone = input('primary', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "tone" }] : /* istanbul ignore next */ []));
    label = input('Progress', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "label" }] : /* istanbul ignore next */ []));
    indeterminate = computed(() => this.value() === null || this.value() === undefined, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "indeterminate" }] : /* istanbul ignore next */ []));
    pct = computed(() => Math.max(0, Math.min(100, this.value() ?? 0)), /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "pct" }] : /* istanbul ignore next */ []));
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiProgressBar, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.1.0", version: "22.0.4", type: UiProgressBar, isStandalone: true, selector: "ui-progress-bar", inputs: { value: { classPropertyName: "value", publicName: "value", isSignal: true, isRequired: false, transformFunction: null }, tone: { classPropertyName: "tone", publicName: "tone", isSignal: true, isRequired: false, transformFunction: null }, label: { classPropertyName: "label", publicName: "label", isSignal: true, isRequired: false, transformFunction: null } }, ngImport: i0, template: `
    <div
      class="track"
      [attr.data-tone]="tone()"
      role="progressbar"
      [attr.aria-valuenow]="indeterminate() ? null : pct()"
      [attr.aria-valuemin]="indeterminate() ? null : 0"
      [attr.aria-valuemax]="indeterminate() ? null : 100"
      [attr.aria-label]="label()">
      <div class="fill" [class.indeterminate]="indeterminate()" [style.width.%]="indeterminate() ? null : pct()"></div>
    </div>
  `, isInline: true, styles: [":host{display:block}.track{position:relative;height:8px;width:100%;background:var(--ui-color-surface-raised);border-radius:999px;overflow:hidden}.fill{height:100%;background:var(--ui-color-primary);border-radius:inherit;transition:width var(--ui-motion-base) var(--ui-ease-standard)}.track[data-tone=success] .fill{background:var(--ui-color-success)}.track[data-tone=warning] .fill{background:var(--ui-color-warning)}.track[data-tone=danger] .fill{background:var(--ui-color-danger)}.fill.indeterminate{width:40%;animation:ui-progress-indeterminate 1.2s var(--ui-ease-standard) infinite}@keyframes ui-progress-indeterminate{0%{margin-left:-40%}to{margin-left:100%}}@media(prefers-reduced-motion:reduce){.fill.indeterminate{animation-duration:2.4s}}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiProgressBar, decorators: [{
            type: Component,
            args: [{ selector: 'ui-progress-bar', template: `
    <div
      class="track"
      [attr.data-tone]="tone()"
      role="progressbar"
      [attr.aria-valuenow]="indeterminate() ? null : pct()"
      [attr.aria-valuemin]="indeterminate() ? null : 0"
      [attr.aria-valuemax]="indeterminate() ? null : 100"
      [attr.aria-label]="label()">
      <div class="fill" [class.indeterminate]="indeterminate()" [style.width.%]="indeterminate() ? null : pct()"></div>
    </div>
  `, styles: [":host{display:block}.track{position:relative;height:8px;width:100%;background:var(--ui-color-surface-raised);border-radius:999px;overflow:hidden}.fill{height:100%;background:var(--ui-color-primary);border-radius:inherit;transition:width var(--ui-motion-base) var(--ui-ease-standard)}.track[data-tone=success] .fill{background:var(--ui-color-success)}.track[data-tone=warning] .fill{background:var(--ui-color-warning)}.track[data-tone=danger] .fill{background:var(--ui-color-danger)}.fill.indeterminate{width:40%;animation:ui-progress-indeterminate 1.2s var(--ui-ease-standard) infinite}@keyframes ui-progress-indeterminate{0%{margin-left:-40%}to{margin-left:100%}}@media(prefers-reduced-motion:reduce){.fill.indeterminate{animation-duration:2.4s}}\n"] }]
        }], propDecorators: { value: [{ type: i0.Input, args: [{ isSignal: true, alias: "value", required: false }] }], tone: [{ type: i0.Input, args: [{ isSignal: true, alias: "tone", required: false }] }], label: [{ type: i0.Input, args: [{ isSignal: true, alias: "label", required: false }] }] } });

/**
 * Generated bundle index. Do not edit.
 */

export { UiProgressBar };
//# sourceMappingURL=ui-progress.mjs.map
