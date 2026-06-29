import * as i0 from '@angular/core';
import { inject, input, Component } from '@angular/core';
import { UI_CONFIG } from 'ui';

/**
 * `ui-card` — surface container with optional header/footer slots.
 * Project header content with `[card-header]` and footer with `[card-footer]`.
 */
class UiCard {
    config = inject(UI_CONFIG);
    padding = input('md', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "padding" }] : /* istanbul ignore next */ []));
    glass = input(this.config.glass, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "glass" }] : /* istanbul ignore next */ []));
    radius = input(this.config.radius, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "radius" }] : /* istanbul ignore next */ []));
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiCard, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.1.0", version: "22.0.4", type: UiCard, isStandalone: true, selector: "ui-card", inputs: { padding: { classPropertyName: "padding", publicName: "padding", isSignal: true, isRequired: false, transformFunction: null }, glass: { classPropertyName: "glass", publicName: "glass", isSignal: true, isRequired: false, transformFunction: null }, radius: { classPropertyName: "radius", publicName: "radius", isSignal: true, isRequired: false, transformFunction: null } }, ngImport: i0, template: `
    <div class="ui-card" [class.glass]="glass()" [class.no-radius]="!radius()" [attr.data-pad]="padding()">
      <div class="hd"><ng-content select="[card-header]" /></div>
      <div class="bd"><ng-content /></div>
      <div class="ft"><ng-content select="[card-footer]" /></div>
    </div>
  `, isInline: true, styles: [":host{display:block}.ui-card{display:flex;flex-direction:column;background:var(--ui-color-surface);border:1px solid var(--ui-color-border);border-radius:var(--ui-radius);box-shadow:var(--ui-shadow-1);overflow:hidden}.ui-card.no-radius{border-radius:0}.ui-card.glass{background:var(--ui-glass-bg);-webkit-backdrop-filter:blur(var(--ui-glass-blur));backdrop-filter:blur(var(--ui-glass-blur));border-color:var(--ui-glass-border)}.hd,.bd,.ft{padding:var(--ui-space-3) var(--ui-space-4)}.ui-card[data-pad=sm] .hd,.ui-card[data-pad=sm] .bd,.ui-card[data-pad=sm] .ft{padding:var(--ui-space-2) var(--ui-space-3)}.ui-card[data-pad=lg] .hd,.ui-card[data-pad=lg] .bd,.ui-card[data-pad=lg] .ft{padding:var(--ui-space-4) var(--ui-space-6)}.hd{border-bottom:1px solid var(--ui-color-border);font-weight:600}.ft{border-top:1px solid var(--ui-color-border)}.hd:empty,.ft:empty{display:none}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiCard, decorators: [{
            type: Component,
            args: [{ selector: 'ui-card', template: `
    <div class="ui-card" [class.glass]="glass()" [class.no-radius]="!radius()" [attr.data-pad]="padding()">
      <div class="hd"><ng-content select="[card-header]" /></div>
      <div class="bd"><ng-content /></div>
      <div class="ft"><ng-content select="[card-footer]" /></div>
    </div>
  `, styles: [":host{display:block}.ui-card{display:flex;flex-direction:column;background:var(--ui-color-surface);border:1px solid var(--ui-color-border);border-radius:var(--ui-radius);box-shadow:var(--ui-shadow-1);overflow:hidden}.ui-card.no-radius{border-radius:0}.ui-card.glass{background:var(--ui-glass-bg);-webkit-backdrop-filter:blur(var(--ui-glass-blur));backdrop-filter:blur(var(--ui-glass-blur));border-color:var(--ui-glass-border)}.hd,.bd,.ft{padding:var(--ui-space-3) var(--ui-space-4)}.ui-card[data-pad=sm] .hd,.ui-card[data-pad=sm] .bd,.ui-card[data-pad=sm] .ft{padding:var(--ui-space-2) var(--ui-space-3)}.ui-card[data-pad=lg] .hd,.ui-card[data-pad=lg] .bd,.ui-card[data-pad=lg] .ft{padding:var(--ui-space-4) var(--ui-space-6)}.hd{border-bottom:1px solid var(--ui-color-border);font-weight:600}.ft{border-top:1px solid var(--ui-color-border)}.hd:empty,.ft:empty{display:none}\n"] }]
        }], propDecorators: { padding: [{ type: i0.Input, args: [{ isSignal: true, alias: "padding", required: false }] }], glass: [{ type: i0.Input, args: [{ isSignal: true, alias: "glass", required: false }] }], radius: [{ type: i0.Input, args: [{ isSignal: true, alias: "radius", required: false }] }] } });

/** `ui-stat-card` — KPI tile: label, value, optional delta + icon slot. */
class UiStatCard {
    config = inject(UI_CONFIG);
    label = input('', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "label" }] : /* istanbul ignore next */ []));
    value = input('', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "value" }] : /* istanbul ignore next */ []));
    delta = input(/* @ts-ignore */
    ...(ngDevMode ? [undefined, { debugName: "delta" }] : /* istanbul ignore next */ []));
    trend = input('up', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "trend" }] : /* istanbul ignore next */ []));
    glass = input(this.config.glass, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "glass" }] : /* istanbul ignore next */ []));
    radius = input(this.config.radius, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "radius" }] : /* istanbul ignore next */ []));
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiStatCard, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "22.0.4", type: UiStatCard, isStandalone: true, selector: "ui-stat-card", inputs: { label: { classPropertyName: "label", publicName: "label", isSignal: true, isRequired: false, transformFunction: null }, value: { classPropertyName: "value", publicName: "value", isSignal: true, isRequired: false, transformFunction: null }, delta: { classPropertyName: "delta", publicName: "delta", isSignal: true, isRequired: false, transformFunction: null }, trend: { classPropertyName: "trend", publicName: "trend", isSignal: true, isRequired: false, transformFunction: null }, glass: { classPropertyName: "glass", publicName: "glass", isSignal: true, isRequired: false, transformFunction: null }, radius: { classPropertyName: "radius", publicName: "radius", isSignal: true, isRequired: false, transformFunction: null } }, ngImport: i0, template: `
    <div class="stat" [class.glass]="glass()" [class.no-radius]="!radius()">
      <div class="top">
        <span class="label">{{ label() }}</span>
        <span class="icon"><ng-content select="[stat-icon]" /></span>
      </div>
      <div class="value">{{ value() }}</div>
      @if (delta() !== undefined) {
        <div class="delta" [attr.data-trend]="trend()">
          {{ trend() === 'down' ? '▼' : '▲' }} {{ delta() }}
        </div>
      }
    </div>
  `, isInline: true, styles: [":host{display:block}.stat{display:flex;flex-direction:column;gap:var(--ui-space-1);padding:var(--ui-space-3) var(--ui-space-4);background:var(--ui-color-surface);border:1px solid var(--ui-color-border);border-radius:var(--ui-radius);box-shadow:var(--ui-shadow-1);font-family:var(--ui-font-default)}.stat.no-radius{border-radius:0}.stat.glass{background:var(--ui-glass-bg);-webkit-backdrop-filter:blur(var(--ui-glass-blur));backdrop-filter:blur(var(--ui-glass-blur));border-color:var(--ui-glass-border)}.top{display:flex;align-items:center;justify-content:space-between}.label{font-size:var(--ui-font-size-sm);color:var(--ui-color-text-muted)}.icon{color:var(--ui-color-text-muted)}.icon:empty{display:none}.value{font-size:1.6rem;font-weight:700;color:var(--ui-color-text);line-height:1.1}.delta{font-size:var(--ui-font-size-sm);font-weight:600}.delta[data-trend=up]{color:var(--ui-color-success)}.delta[data-trend=down]{color:var(--ui-color-danger)}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiStatCard, decorators: [{
            type: Component,
            args: [{ selector: 'ui-stat-card', template: `
    <div class="stat" [class.glass]="glass()" [class.no-radius]="!radius()">
      <div class="top">
        <span class="label">{{ label() }}</span>
        <span class="icon"><ng-content select="[stat-icon]" /></span>
      </div>
      <div class="value">{{ value() }}</div>
      @if (delta() !== undefined) {
        <div class="delta" [attr.data-trend]="trend()">
          {{ trend() === 'down' ? '▼' : '▲' }} {{ delta() }}
        </div>
      }
    </div>
  `, styles: [":host{display:block}.stat{display:flex;flex-direction:column;gap:var(--ui-space-1);padding:var(--ui-space-3) var(--ui-space-4);background:var(--ui-color-surface);border:1px solid var(--ui-color-border);border-radius:var(--ui-radius);box-shadow:var(--ui-shadow-1);font-family:var(--ui-font-default)}.stat.no-radius{border-radius:0}.stat.glass{background:var(--ui-glass-bg);-webkit-backdrop-filter:blur(var(--ui-glass-blur));backdrop-filter:blur(var(--ui-glass-blur));border-color:var(--ui-glass-border)}.top{display:flex;align-items:center;justify-content:space-between}.label{font-size:var(--ui-font-size-sm);color:var(--ui-color-text-muted)}.icon{color:var(--ui-color-text-muted)}.icon:empty{display:none}.value{font-size:1.6rem;font-weight:700;color:var(--ui-color-text);line-height:1.1}.delta{font-size:var(--ui-font-size-sm);font-weight:600}.delta[data-trend=up]{color:var(--ui-color-success)}.delta[data-trend=down]{color:var(--ui-color-danger)}\n"] }]
        }], propDecorators: { label: [{ type: i0.Input, args: [{ isSignal: true, alias: "label", required: false }] }], value: [{ type: i0.Input, args: [{ isSignal: true, alias: "value", required: false }] }], delta: [{ type: i0.Input, args: [{ isSignal: true, alias: "delta", required: false }] }], trend: [{ type: i0.Input, args: [{ isSignal: true, alias: "trend", required: false }] }], glass: [{ type: i0.Input, args: [{ isSignal: true, alias: "glass", required: false }] }], radius: [{ type: i0.Input, args: [{ isSignal: true, alias: "radius", required: false }] }] } });

/**
 * Generated bundle index. Do not edit.
 */

export { UiCard, UiStatCard };
//# sourceMappingURL=ui-card.mjs.map
