import * as i0 from '@angular/core';
import { input, Component } from '@angular/core';

/** `ui-divider` — horizontal or vertical separator, optionally with a label. */
class UiDivider {
    orientation = input('horizontal', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "orientation" }] : /* istanbul ignore next */ []));
    /** Optional centered label (horizontal only). */
    label = input(/* @ts-ignore */
    ...(ngDevMode ? [undefined, { debugName: "label" }] : /* istanbul ignore next */ []));
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiDivider, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "22.0.4", type: UiDivider, isStandalone: true, selector: "ui-divider", inputs: { orientation: { classPropertyName: "orientation", publicName: "orientation", isSignal: true, isRequired: false, transformFunction: null }, label: { classPropertyName: "label", publicName: "label", isSignal: true, isRequired: false, transformFunction: null } }, host: { properties: { "attr.data-orientation": "orientation()" } }, ngImport: i0, template: `
    @if (label()) {
      <div class="labeled" role="separator" aria-orientation="horizontal">
        <span class="line"></span>
        <span class="label">{{ label() }}</span>
        <span class="line"></span>
      </div>
    } @else {
      <div class="bare" role="separator" [attr.aria-orientation]="orientation()"></div>
    }
  `, isInline: true, styles: [":host{display:block}:host([data-orientation=\"vertical\"]){display:inline-block;height:100%}.bare{background:var(--ui-color-border)}:host([data-orientation=\"horizontal\"]) .bare{height:1px;width:100%;margin:var(--ui-space-3) 0}:host([data-orientation=\"vertical\"]) .bare{width:1px;height:100%;margin:0 var(--ui-space-3)}.labeled{display:flex;align-items:center;gap:var(--ui-space-3);margin:var(--ui-space-3) 0}.labeled .line{flex:1;height:1px;background:var(--ui-color-border)}.labeled .label{color:var(--ui-color-text-muted);font-size:var(--ui-font-size-sm);font-family:var(--ui-font-default)}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiDivider, decorators: [{
            type: Component,
            args: [{ selector: 'ui-divider', template: `
    @if (label()) {
      <div class="labeled" role="separator" aria-orientation="horizontal">
        <span class="line"></span>
        <span class="label">{{ label() }}</span>
        <span class="line"></span>
      </div>
    } @else {
      <div class="bare" role="separator" [attr.aria-orientation]="orientation()"></div>
    }
  `, host: { '[attr.data-orientation]': 'orientation()' }, styles: [":host{display:block}:host([data-orientation=\"vertical\"]){display:inline-block;height:100%}.bare{background:var(--ui-color-border)}:host([data-orientation=\"horizontal\"]) .bare{height:1px;width:100%;margin:var(--ui-space-3) 0}:host([data-orientation=\"vertical\"]) .bare{width:1px;height:100%;margin:0 var(--ui-space-3)}.labeled{display:flex;align-items:center;gap:var(--ui-space-3);margin:var(--ui-space-3) 0}.labeled .line{flex:1;height:1px;background:var(--ui-color-border)}.labeled .label{color:var(--ui-color-text-muted);font-size:var(--ui-font-size-sm);font-family:var(--ui-font-default)}\n"] }]
        }], propDecorators: { orientation: [{ type: i0.Input, args: [{ isSignal: true, alias: "orientation", required: false }] }], label: [{ type: i0.Input, args: [{ isSignal: true, alias: "label", required: false }] }] } });

/**
 * Generated bundle index. Do not edit.
 */

export { UiDivider };
//# sourceMappingURL=ui-divider.mjs.map
