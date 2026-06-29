import { NgTemplateOutlet } from '@angular/common';
import * as i0 from '@angular/core';
import { input, Component } from '@angular/core';

/**
 * `ui-text` — the typography primitive and the ONLY text element in the
 * library. Renders the correct semantic tag per variant (keeps a11y/SEO
 * intact) and applies an optional `font` that falls back to the token.
 *
 * Projected content lives in a single `<ng-content>` (captured in the
 * `#content` template) and is stamped into the chosen tag via
 * `ngTemplateOutlet`. A naive "one `<ng-content>` per `@case`" template does
 * NOT work — Angular only fills the last default slot, leaving every other
 * variant empty.
 */
class UiText {
    variant = input('body', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "variant" }] : /* istanbul ignore next */ []));
    /** Optional font-family override; the CSS token fills in when undefined. */
    font = input(/* @ts-ignore */
    ...(ngDevMode ? [undefined, { debugName: "font" }] : /* istanbul ignore next */ []));
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiText, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "22.0.4", type: UiText, isStandalone: true, selector: "ui-text", inputs: { variant: { classPropertyName: "variant", publicName: "variant", isSignal: true, isRequired: false, transformFunction: null }, font: { classPropertyName: "font", publicName: "font", isSignal: true, isRequired: false, transformFunction: null } }, ngImport: i0, template: `
    @switch (variant()) {
      @case ('h1') { <h1 [style.font-family]="font()"><ng-container [ngTemplateOutlet]="content" /></h1> }
      @case ('h2') { <h2 [style.font-family]="font()"><ng-container [ngTemplateOutlet]="content" /></h2> }
      @case ('h3') { <h3 [style.font-family]="font()"><ng-container [ngTemplateOutlet]="content" /></h3> }
      @case ('h4') { <h4 [style.font-family]="font()"><ng-container [ngTemplateOutlet]="content" /></h4> }
      @case ('h5') { <h5 [style.font-family]="font()"><ng-container [ngTemplateOutlet]="content" /></h5> }
      @case ('h6') { <h6 [style.font-family]="font()"><ng-container [ngTemplateOutlet]="content" /></h6> }
      @case ('caption') { <small [style.font-family]="font()"><ng-container [ngTemplateOutlet]="content" /></small> }
      @case ('label') { <span class="label" [style.font-family]="font()"><ng-container [ngTemplateOutlet]="content" /></span> }
      @case ('code') { <code [style.font-family]="font()"><ng-container [ngTemplateOutlet]="content" /></code> }
      @case ('quote') { <blockquote [style.font-family]="font()"><ng-container [ngTemplateOutlet]="content" /></blockquote> }
      @default { <p [style.font-family]="font()"><ng-container [ngTemplateOutlet]="content" /></p> }
    }
    <ng-template #content><ng-content /></ng-template>
  `, isInline: true, styles: [":host{color:var(--ui-color-text);display:block}:host([inline]){display:inline}h1,h2,h3,h4,h5,h6,p,small,span,code,blockquote{margin:0;font-family:var(--ui-font-default);line-height:1.35}h1,h2,h3{font-family:var(--ui-font-display);letter-spacing:-.02em}h1{font-size:2rem;font-weight:700;line-height:1.15}h2{font-size:1.5rem;font-weight:700;line-height:1.2}h3{font-size:1.25rem;font-weight:600}h4{font-size:1.1rem;font-weight:600}h5{font-size:1rem;font-weight:600}h6{font-size:.9rem;font-weight:600;text-transform:uppercase;letter-spacing:.04em;color:var(--ui-color-text-muted)}p{font-size:var(--ui-font-size-md)}small{font-size:var(--ui-font-size-sm);color:var(--ui-color-text-muted)}.label{font-size:var(--ui-font-size-sm);font-weight:600}code{font-family:var(--ui-font-mono);font-size:.9em;background:var(--ui-color-surface-raised);border:1px solid var(--ui-color-border);border-radius:6px;padding:.1em .35em}blockquote{border-left:3px solid var(--ui-color-border);padding-left:var(--ui-space-4);color:var(--ui-color-text-muted);font-style:italic}\n"], dependencies: [{ kind: "directive", type: NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiText, decorators: [{
            type: Component,
            args: [{ selector: 'ui-text', imports: [NgTemplateOutlet], template: `
    @switch (variant()) {
      @case ('h1') { <h1 [style.font-family]="font()"><ng-container [ngTemplateOutlet]="content" /></h1> }
      @case ('h2') { <h2 [style.font-family]="font()"><ng-container [ngTemplateOutlet]="content" /></h2> }
      @case ('h3') { <h3 [style.font-family]="font()"><ng-container [ngTemplateOutlet]="content" /></h3> }
      @case ('h4') { <h4 [style.font-family]="font()"><ng-container [ngTemplateOutlet]="content" /></h4> }
      @case ('h5') { <h5 [style.font-family]="font()"><ng-container [ngTemplateOutlet]="content" /></h5> }
      @case ('h6') { <h6 [style.font-family]="font()"><ng-container [ngTemplateOutlet]="content" /></h6> }
      @case ('caption') { <small [style.font-family]="font()"><ng-container [ngTemplateOutlet]="content" /></small> }
      @case ('label') { <span class="label" [style.font-family]="font()"><ng-container [ngTemplateOutlet]="content" /></span> }
      @case ('code') { <code [style.font-family]="font()"><ng-container [ngTemplateOutlet]="content" /></code> }
      @case ('quote') { <blockquote [style.font-family]="font()"><ng-container [ngTemplateOutlet]="content" /></blockquote> }
      @default { <p [style.font-family]="font()"><ng-container [ngTemplateOutlet]="content" /></p> }
    }
    <ng-template #content><ng-content /></ng-template>
  `, styles: [":host{color:var(--ui-color-text);display:block}:host([inline]){display:inline}h1,h2,h3,h4,h5,h6,p,small,span,code,blockquote{margin:0;font-family:var(--ui-font-default);line-height:1.35}h1,h2,h3{font-family:var(--ui-font-display);letter-spacing:-.02em}h1{font-size:2rem;font-weight:700;line-height:1.15}h2{font-size:1.5rem;font-weight:700;line-height:1.2}h3{font-size:1.25rem;font-weight:600}h4{font-size:1.1rem;font-weight:600}h5{font-size:1rem;font-weight:600}h6{font-size:.9rem;font-weight:600;text-transform:uppercase;letter-spacing:.04em;color:var(--ui-color-text-muted)}p{font-size:var(--ui-font-size-md)}small{font-size:var(--ui-font-size-sm);color:var(--ui-color-text-muted)}.label{font-size:var(--ui-font-size-sm);font-weight:600}code{font-family:var(--ui-font-mono);font-size:.9em;background:var(--ui-color-surface-raised);border:1px solid var(--ui-color-border);border-radius:6px;padding:.1em .35em}blockquote{border-left:3px solid var(--ui-color-border);padding-left:var(--ui-space-4);color:var(--ui-color-text-muted);font-style:italic}\n"] }]
        }], propDecorators: { variant: [{ type: i0.Input, args: [{ isSignal: true, alias: "variant", required: false }] }], font: [{ type: i0.Input, args: [{ isSignal: true, alias: "font", required: false }] }] } });

/**
 * Generated bundle index. Do not edit.
 */

export { UiText };
//# sourceMappingURL=ui-text.mjs.map
