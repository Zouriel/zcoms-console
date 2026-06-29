import * as _angular_core from '@angular/core';

type TextVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'caption' | 'label' | 'code' | 'quote';
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
declare class UiText {
    variant: _angular_core.InputSignal<TextVariant>;
    /** Optional font-family override; the CSS token fills in when undefined. */
    font: _angular_core.InputSignal<string | undefined>;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiText, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiText, "ui-text", never, { "variant": { "alias": "variant"; "required": false; "isSignal": true; }; "font": { "alias": "font"; "required": false; "isSignal": true; }; }, {}, never, ["*"], true, never>;
}

export { UiText };
export type { TextVariant };
