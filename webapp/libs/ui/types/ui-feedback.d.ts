import * as _angular_core from '@angular/core';

/** `ui-empty-state` — placeholder for empty content. Slots: `[empty-icon]`, `[empty-actions]`. */
declare class UiEmptyState {
    heading: _angular_core.InputSignal<string>;
    description: _angular_core.InputSignal<string | undefined>;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiEmptyState, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiEmptyState, "ui-empty-state", never, { "heading": { "alias": "heading"; "required": false; "isSignal": true; }; "description": { "alias": "description"; "required": false; "isSignal": true; }; }, {}, never, ["[empty-icon]", "[empty-actions]"], true, never>;
}

type UiResultStatus = 'success' | 'error' | 'info' | 'warning' | '404' | '500';
/** `ui-result` — full-page outcome state (success / error / 404 / 500). */
declare class UiResult {
    status: _angular_core.InputSignal<UiResultStatus>;
    title: _angular_core.InputSignal<string>;
    subtitle: _angular_core.InputSignal<string | undefined>;
    protected readonly glyph: Record<UiResultStatus, string>;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiResult, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiResult, "ui-result", never, { "status": { "alias": "status"; "required": false; "isSignal": true; }; "title": { "alias": "title"; "required": false; "isSignal": true; }; "subtitle": { "alias": "subtitle"; "required": false; "isSignal": true; }; }, {}, never, ["*"], true, never>;
}

/**
 * `ui-loading-overlay` — covers its positioned parent with a dimmed, blurred
 * veil + spinner while `loading` is true. Place inside a `position: relative`
 * container.
 */
declare class UiLoadingOverlay {
    loading: _angular_core.InputSignal<boolean>;
    label: _angular_core.InputSignal<string>;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiLoadingOverlay, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiLoadingOverlay, "ui-loading-overlay", never, { "loading": { "alias": "loading"; "required": false; "isSignal": true; }; "label": { "alias": "label"; "required": false; "isSignal": true; }; }, {}, never, never, true, never>;
}

export { UiEmptyState, UiLoadingOverlay, UiResult };
export type { UiResultStatus };
