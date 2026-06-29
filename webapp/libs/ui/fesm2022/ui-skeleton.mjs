import * as i0 from '@angular/core';
import { input, Component } from '@angular/core';

/** `ui-skeleton` — content placeholder shown while data loads. */
class UiSkeleton {
    shape = input('rect', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "shape" }] : /* istanbul ignore next */ []));
    width = input(/* @ts-ignore */
    ...(ngDevMode ? [undefined, { debugName: "width" }] : /* istanbul ignore next */ []));
    height = input(/* @ts-ignore */
    ...(ngDevMode ? [undefined, { debugName: "height" }] : /* istanbul ignore next */ []));
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiSkeleton, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.1.0", version: "22.0.4", type: UiSkeleton, isStandalone: true, selector: "ui-skeleton", inputs: { shape: { classPropertyName: "shape", publicName: "shape", isSignal: true, isRequired: false, transformFunction: null }, width: { classPropertyName: "width", publicName: "width", isSignal: true, isRequired: false, transformFunction: null }, height: { classPropertyName: "height", publicName: "height", isSignal: true, isRequired: false, transformFunction: null } }, host: { attributes: { "aria-hidden": "true" }, properties: { "class.circle": "shape() === 'circle'", "class.text": "shape() === 'text'", "style.width": "width()", "style.height": "height()" }, classAttribute: "ui-skeleton" }, ngImport: i0, template: ``, isInline: true, styles: [":host{display:block;background:linear-gradient(90deg,var(--ui-color-surface) 25%,var(--ui-color-surface-raised) 37%,var(--ui-color-surface) 63%);background-size:400% 100%;border-radius:var(--ui-radius);animation:ui-skeleton-shimmer 1.4s ease infinite}:host(.circle){border-radius:50%}:host(.text){height:.85em;border-radius:4px}@keyframes ui-skeleton-shimmer{0%{background-position:100% 0}to{background-position:0 0}}@media(prefers-reduced-motion:reduce){:host{animation:none}}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiSkeleton, decorators: [{
            type: Component,
            args: [{ selector: 'ui-skeleton', template: ``, host: {
                        class: 'ui-skeleton',
                        'aria-hidden': 'true',
                        '[class.circle]': "shape() === 'circle'",
                        '[class.text]': "shape() === 'text'",
                        '[style.width]': 'width()',
                        '[style.height]': 'height()',
                    }, styles: [":host{display:block;background:linear-gradient(90deg,var(--ui-color-surface) 25%,var(--ui-color-surface-raised) 37%,var(--ui-color-surface) 63%);background-size:400% 100%;border-radius:var(--ui-radius);animation:ui-skeleton-shimmer 1.4s ease infinite}:host(.circle){border-radius:50%}:host(.text){height:.85em;border-radius:4px}@keyframes ui-skeleton-shimmer{0%{background-position:100% 0}to{background-position:0 0}}@media(prefers-reduced-motion:reduce){:host{animation:none}}\n"] }]
        }], propDecorators: { shape: [{ type: i0.Input, args: [{ isSignal: true, alias: "shape", required: false }] }], width: [{ type: i0.Input, args: [{ isSignal: true, alias: "width", required: false }] }], height: [{ type: i0.Input, args: [{ isSignal: true, alias: "height", required: false }] }] } });

/**
 * Generated bundle index. Do not edit.
 */

export { UiSkeleton };
//# sourceMappingURL=ui-skeleton.mjs.map
