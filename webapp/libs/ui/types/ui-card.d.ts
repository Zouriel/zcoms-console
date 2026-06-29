import * as _angular_core from '@angular/core';

/**
 * `ui-card` — surface container with optional header/footer slots.
 * Project header content with `[card-header]` and footer with `[card-footer]`.
 */
declare class UiCard {
    private config;
    padding: _angular_core.InputSignal<"sm" | "md" | "lg">;
    glass: _angular_core.InputSignal<boolean>;
    radius: _angular_core.InputSignal<boolean>;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiCard, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiCard, "ui-card", never, { "padding": { "alias": "padding"; "required": false; "isSignal": true; }; "glass": { "alias": "glass"; "required": false; "isSignal": true; }; "radius": { "alias": "radius"; "required": false; "isSignal": true; }; }, {}, never, ["[card-header]", "*", "[card-footer]"], true, never>;
}

/** `ui-stat-card` — KPI tile: label, value, optional delta + icon slot. */
declare class UiStatCard {
    private config;
    label: _angular_core.InputSignal<string>;
    value: _angular_core.InputSignal<string | number>;
    delta: _angular_core.InputSignal<string | number | undefined>;
    trend: _angular_core.InputSignal<"up" | "down">;
    glass: _angular_core.InputSignal<boolean>;
    radius: _angular_core.InputSignal<boolean>;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiStatCard, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiStatCard, "ui-stat-card", never, { "label": { "alias": "label"; "required": false; "isSignal": true; }; "value": { "alias": "value"; "required": false; "isSignal": true; }; "delta": { "alias": "delta"; "required": false; "isSignal": true; }; "trend": { "alias": "trend"; "required": false; "isSignal": true; }; "glass": { "alias": "glass"; "required": false; "isSignal": true; }; "radius": { "alias": "radius"; "required": false; "isSignal": true; }; }, {}, never, ["[stat-icon]"], true, never>;
}

export { UiCard, UiStatCard };
