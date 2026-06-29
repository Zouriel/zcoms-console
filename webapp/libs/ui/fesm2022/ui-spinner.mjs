import * as i0 from '@angular/core';
import { input, Component } from '@angular/core';

/** `ui-spinner` — indeterminate activity indicator. */
class UiSpinner {
    size = input('md', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "size" }] : /* istanbul ignore next */ []));
    label = input('Loading', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "label" }] : /* istanbul ignore next */ []));
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiSpinner, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.1.0", version: "22.0.4", type: UiSpinner, isStandalone: true, selector: "ui-spinner", inputs: { size: { classPropertyName: "size", publicName: "size", isSignal: true, isRequired: false, transformFunction: null }, label: { classPropertyName: "label", publicName: "label", isSignal: true, isRequired: false, transformFunction: null } }, ngImport: i0, template: `<span class="ui-spinner" [attr.data-size]="size()" role="status" [attr.aria-label]="label()"></span>`, isInline: true, styles: [":host{display:inline-flex}.ui-spinner{display:inline-block;box-sizing:border-box;width:20px;height:20px;border-radius:50%;border:2px solid var(--ui-color-border);border-top-color:var(--ui-color-primary);animation:ui-spinner-rot var(--ui-motion-slow) linear infinite}.ui-spinner[data-size=sm]{width:14px;height:14px}.ui-spinner[data-size=lg]{width:32px;height:32px;border-width:3px}@keyframes ui-spinner-rot{to{transform:rotate(360deg)}}@media(prefers-reduced-motion:reduce){.ui-spinner{animation-duration:1.2s}}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiSpinner, decorators: [{
            type: Component,
            args: [{ selector: 'ui-spinner', template: `<span class="ui-spinner" [attr.data-size]="size()" role="status" [attr.aria-label]="label()"></span>`, styles: [":host{display:inline-flex}.ui-spinner{display:inline-block;box-sizing:border-box;width:20px;height:20px;border-radius:50%;border:2px solid var(--ui-color-border);border-top-color:var(--ui-color-primary);animation:ui-spinner-rot var(--ui-motion-slow) linear infinite}.ui-spinner[data-size=sm]{width:14px;height:14px}.ui-spinner[data-size=lg]{width:32px;height:32px;border-width:3px}@keyframes ui-spinner-rot{to{transform:rotate(360deg)}}@media(prefers-reduced-motion:reduce){.ui-spinner{animation-duration:1.2s}}\n"] }]
        }], propDecorators: { size: [{ type: i0.Input, args: [{ isSignal: true, alias: "size", required: false }] }], label: [{ type: i0.Input, args: [{ isSignal: true, alias: "label", required: false }] }] } });

/**
 * Generated bundle index. Do not edit.
 */

export { UiSpinner };
//# sourceMappingURL=ui-spinner.mjs.map
