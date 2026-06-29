import * as _angular_core from '@angular/core';

/**
 * `ui-tab` — a single tab + its panel. Provide a `label` and project the panel
 * content. Inactive panels stay in the DOM but are hidden (`[hidden]`).
 */
declare class UiTab {
    label: _angular_core.InputSignal<string>;
    disabled: _angular_core.InputSignal<boolean>;
    readonly active: _angular_core.WritableSignal<boolean>;
    readonly tabId: string;
    readonly panelId: string;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiTab, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiTab, "ui-tab", never, { "label": { "alias": "label"; "required": true; "isSignal": true; }; "disabled": { "alias": "disabled"; "required": false; "isSignal": true; }; }, {}, never, ["*"], true, never>;
}
/**
 * `ui-tabs` — WAI-ARIA tabs. Wraps `ui-tab` children; renders a tablist with
 * roving tabindex and Arrow/Home/End keyboard navigation.
 */
declare class UiTabs {
    private host;
    selectedIndex: _angular_core.ModelSignal<number>;
    label: _angular_core.InputSignal<string>;
    readonly tabs: _angular_core.Signal<readonly UiTab[]>;
    constructor();
    protected select(i: number): void;
    protected onKeydown(e: KeyboardEvent, i: number): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiTabs, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiTabs, "ui-tabs", never, { "selectedIndex": { "alias": "selectedIndex"; "required": false; "isSignal": true; }; "label": { "alias": "label"; "required": false; "isSignal": true; }; }, { "selectedIndex": "selectedIndexChange"; }, ["tabs"], ["*"], true, never>;
}

export { UiTab, UiTabs };
