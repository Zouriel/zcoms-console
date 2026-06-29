import * as _angular_core from '@angular/core';

/** `ui-divider` — horizontal or vertical separator, optionally with a label. */
declare class UiDivider {
    orientation: _angular_core.InputSignal<"horizontal" | "vertical">;
    /** Optional centered label (horizontal only). */
    label: _angular_core.InputSignal<string | undefined>;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiDivider, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiDivider, "ui-divider", never, { "orientation": { "alias": "orientation"; "required": false; "isSignal": true; }; "label": { "alias": "label"; "required": false; "isSignal": true; }; }, {}, never, never, true, never>;
}

export { UiDivider };
