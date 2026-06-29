import * as i0 from '@angular/core';

/** `ui-link` — themed anchor. External links get safe rel + a visual marker. */
declare class UiLink {
    href: i0.InputSignal<string | undefined>;
    external: i0.InputSignal<boolean>;
    tone: i0.InputSignal<"primary" | "muted" | "plain">;
    static ɵfac: i0.ɵɵFactoryDeclaration<UiLink, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<UiLink, "ui-link", never, { "href": { "alias": "href"; "required": false; "isSignal": true; }; "external": { "alias": "external"; "required": false; "isSignal": true; }; "tone": { "alias": "tone"; "required": false; "isSignal": true; }; }, {}, never, ["*"], true, never>;
}

/** `ui-kbd` — keyboard key hint. */
declare class UiKbd {
    static ɵfac: i0.ɵɵFactoryDeclaration<UiKbd, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<UiKbd, "ui-kbd", never, {}, {}, never, ["*"], true, never>;
}

/** `ui-inline-code` — inline code token. */
declare class UiInlineCode {
    static ɵfac: i0.ɵɵFactoryDeclaration<UiInlineCode, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<UiInlineCode, "ui-inline-code", never, {}, {}, never, ["*"], true, never>;
}

/** `ui-blockquote` — quotation block with optional citation. */
declare class UiBlockquote {
    cite: i0.InputSignal<string | undefined>;
    static ɵfac: i0.ɵɵFactoryDeclaration<UiBlockquote, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<UiBlockquote, "ui-blockquote", never, { "cite": { "alias": "cite"; "required": false; "isSignal": true; }; }, {}, never, ["*"], true, never>;
}

export { UiBlockquote, UiInlineCode, UiKbd, UiLink };
