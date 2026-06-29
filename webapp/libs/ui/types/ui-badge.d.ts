import * as _angular_core from '@angular/core';
import { UiStatus, UiSize } from 'ui';

/** `ui-badge` — small status/count label. */
declare class UiBadge {
    tone: _angular_core.InputSignal<UiStatus>;
    /** Render as a bare status dot (no content). */
    dot: _angular_core.InputSignal<boolean>;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiBadge, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiBadge, "ui-badge", never, { "tone": { "alias": "tone"; "required": false; "isSignal": true; }; "dot": { "alias": "dot"; "required": false; "isSignal": true; }; }, {}, never, ["*"], true, never>;
}

/** `ui-chip` — compact, optionally-removable tag/token. */
declare class UiChip {
    private config;
    tone: _angular_core.InputSignal<UiStatus>;
    removable: _angular_core.InputSignal<boolean>;
    /** Used to build the remove button's accessible name. */
    label: _angular_core.InputSignal<string | undefined>;
    radius: _angular_core.InputSignal<boolean>;
    remove: _angular_core.OutputEmitterRef<void>;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiChip, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiChip, "ui-chip", never, { "tone": { "alias": "tone"; "required": false; "isSignal": true; }; "removable": { "alias": "removable"; "required": false; "isSignal": true; }; "label": { "alias": "label"; "required": false; "isSignal": true; }; "radius": { "alias": "radius"; "required": false; "isSignal": true; }; }, { "remove": "remove"; }, never, ["*"], true, never>;
}

/**
 * `ui-avatar` — user/entity image with graceful initials fallback.
 * Provide `src`+`alt`, or `name` to render initials.
 */
declare class UiAvatar {
    src: _angular_core.InputSignal<string | undefined>;
    alt: _angular_core.InputSignal<string | undefined>;
    name: _angular_core.InputSignal<string | undefined>;
    size: _angular_core.InputSignal<UiSize>;
    square: _angular_core.InputSignal<boolean>;
    protected readonly initials: _angular_core.Signal<string>;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiAvatar, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiAvatar, "ui-avatar", never, { "src": { "alias": "src"; "required": false; "isSignal": true; }; "alt": { "alias": "alt"; "required": false; "isSignal": true; }; "name": { "alias": "name"; "required": false; "isSignal": true; }; "size": { "alias": "size"; "required": false; "isSignal": true; }; "square": { "alias": "square"; "required": false; "isSignal": true; }; }, {}, never, never, true, never>;
}

/**
 * `ui-avatar-group` — overlapping stack of avatars. Project `ui-avatar`
 * elements; they overlap by the `--ui-avatar-overlap` amount.
 */
declare class UiAvatarGroup {
    /** Maximum avatars before collapsing (consumer-managed; informational). */
    max: _angular_core.InputSignal<number | undefined>;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiAvatarGroup, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiAvatarGroup, "ui-avatar-group", never, { "max": { "alias": "max"; "required": false; "isSignal": true; }; }, {}, never, ["*"], true, never>;
}

export { UiAvatar, UiAvatarGroup, UiBadge, UiChip };
