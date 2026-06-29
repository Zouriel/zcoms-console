import * as i0 from '@angular/core';
import { inject, input, output, Component } from '@angular/core';
import { UI_CONFIG } from 'ui';

/** `ui-alert` — inline contextual message. Uses role="alert" for danger/warning. */
class UiAlert {
    config = inject(UI_CONFIG);
    tone = input('info', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "tone" }] : /* istanbul ignore next */ []));
    heading = input(/* @ts-ignore */
    ...(ngDevMode ? [undefined, { debugName: "heading" }] : /* istanbul ignore next */ []));
    dismissible = input(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "dismissible" }] : /* istanbul ignore next */ []));
    radius = input(this.config.radius, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "radius" }] : /* istanbul ignore next */ []));
    dismiss = output();
    glyph = {
        info: 'ℹ', success: '✓', warning: '⚠', danger: '✕',
    };
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiAlert, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "22.0.4", type: UiAlert, isStandalone: true, selector: "ui-alert", inputs: { tone: { classPropertyName: "tone", publicName: "tone", isSignal: true, isRequired: false, transformFunction: null }, heading: { classPropertyName: "heading", publicName: "heading", isSignal: true, isRequired: false, transformFunction: null }, dismissible: { classPropertyName: "dismissible", publicName: "dismissible", isSignal: true, isRequired: false, transformFunction: null }, radius: { classPropertyName: "radius", publicName: "radius", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { dismiss: "dismiss" }, ngImport: i0, template: `
    <div
      class="ui-alert"
      [attr.data-tone]="tone()"
      [class.no-radius]="!radius()"
      [attr.role]="tone() === 'danger' || tone() === 'warning' ? 'alert' : 'status'">
      <span class="icon" aria-hidden="true">{{ glyph[tone()] }}</span>
      <div class="content">
        @if (heading()) { <strong class="title">{{ heading() }}</strong> }
        <div class="body"><ng-content /></div>
      </div>
      @if (dismissible()) {
        <button class="x" type="button" aria-label="Dismiss" (click)="dismiss.emit()">×</button>
      }
    </div>
  `, isInline: true, styles: [":host{display:block}.ui-alert{display:flex;gap:var(--ui-space-3);align-items:flex-start;padding:var(--ui-space-2) var(--ui-space-3);border:1px solid var(--ui-color-border);border-left-width:3px;border-radius:var(--ui-radius);background:var(--ui-color-surface);color:var(--ui-color-text);font-family:var(--ui-font-default);font-size:var(--ui-font-size-md)}.ui-alert.no-radius{border-radius:0}.icon{font-size:1.1em;line-height:1.4}.content{flex:1;min-width:0}.title{display:block;margin-bottom:2px}.body{color:var(--ui-color-text-muted)}.ui-alert[data-tone=info]{border-left-color:var(--ui-color-primary)}.ui-alert[data-tone=success]{border-left-color:var(--ui-color-success)}.ui-alert[data-tone=warning]{border-left-color:var(--ui-color-warning)}.ui-alert[data-tone=danger]{border-left-color:var(--ui-color-danger)}.x{border:none;background:transparent;color:var(--ui-color-text-muted);cursor:pointer;font-size:18px;line-height:1;padding:0 4px}.x:hover{color:var(--ui-color-text)}.x:focus-visible{outline:none;box-shadow:var(--ui-focus-ring);border-radius:4px}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiAlert, decorators: [{
            type: Component,
            args: [{ selector: 'ui-alert', template: `
    <div
      class="ui-alert"
      [attr.data-tone]="tone()"
      [class.no-radius]="!radius()"
      [attr.role]="tone() === 'danger' || tone() === 'warning' ? 'alert' : 'status'">
      <span class="icon" aria-hidden="true">{{ glyph[tone()] }}</span>
      <div class="content">
        @if (heading()) { <strong class="title">{{ heading() }}</strong> }
        <div class="body"><ng-content /></div>
      </div>
      @if (dismissible()) {
        <button class="x" type="button" aria-label="Dismiss" (click)="dismiss.emit()">×</button>
      }
    </div>
  `, styles: [":host{display:block}.ui-alert{display:flex;gap:var(--ui-space-3);align-items:flex-start;padding:var(--ui-space-2) var(--ui-space-3);border:1px solid var(--ui-color-border);border-left-width:3px;border-radius:var(--ui-radius);background:var(--ui-color-surface);color:var(--ui-color-text);font-family:var(--ui-font-default);font-size:var(--ui-font-size-md)}.ui-alert.no-radius{border-radius:0}.icon{font-size:1.1em;line-height:1.4}.content{flex:1;min-width:0}.title{display:block;margin-bottom:2px}.body{color:var(--ui-color-text-muted)}.ui-alert[data-tone=info]{border-left-color:var(--ui-color-primary)}.ui-alert[data-tone=success]{border-left-color:var(--ui-color-success)}.ui-alert[data-tone=warning]{border-left-color:var(--ui-color-warning)}.ui-alert[data-tone=danger]{border-left-color:var(--ui-color-danger)}.x{border:none;background:transparent;color:var(--ui-color-text-muted);cursor:pointer;font-size:18px;line-height:1;padding:0 4px}.x:hover{color:var(--ui-color-text)}.x:focus-visible{outline:none;box-shadow:var(--ui-focus-ring);border-radius:4px}\n"] }]
        }], propDecorators: { tone: [{ type: i0.Input, args: [{ isSignal: true, alias: "tone", required: false }] }], heading: [{ type: i0.Input, args: [{ isSignal: true, alias: "heading", required: false }] }], dismissible: [{ type: i0.Input, args: [{ isSignal: true, alias: "dismissible", required: false }] }], radius: [{ type: i0.Input, args: [{ isSignal: true, alias: "radius", required: false }] }], dismiss: [{ type: i0.Output, args: ["dismiss"] }] } });

/**
 * Generated bundle index. Do not edit.
 */

export { UiAlert };
//# sourceMappingURL=ui-alert.mjs.map
