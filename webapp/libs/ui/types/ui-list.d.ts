import * as _angular_core from '@angular/core';

/** `ui-list` — semantic list container. Project `ui-list-item` children. */
declare class UiList {
    bordered: _angular_core.InputSignal<boolean>;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiList, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiList, "ui-list", never, { "bordered": { "alias": "bordered"; "required": false; "isSignal": true; }; }, {}, never, ["*"], true, never>;
}
/** `ui-list-item` — a row in `ui-list`. Optional `[item-leading]` / `[item-trailing]` slots. */
declare class UiListItem {
    interactive: _angular_core.InputSignal<boolean>;
    selected: _angular_core.InputSignal<boolean>;
    disabled: _angular_core.InputSignal<boolean>;
    activate: _angular_core.OutputEmitterRef<void>;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiListItem, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiListItem, "ui-list-item", never, { "interactive": { "alias": "interactive"; "required": false; "isSignal": true; }; "selected": { "alias": "selected"; "required": false; "isSignal": true; }; "disabled": { "alias": "disabled"; "required": false; "isSignal": true; }; }, { "activate": "activate"; }, never, ["[item-leading]", "*", "[item-trailing]"], true, never>;
}

export { UiList, UiListItem };
