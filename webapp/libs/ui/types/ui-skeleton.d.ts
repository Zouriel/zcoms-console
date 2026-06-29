import * as _angular_core from '@angular/core';

/** `ui-skeleton` — content placeholder shown while data loads. */
declare class UiSkeleton {
    shape: _angular_core.InputSignal<"rect" | "circle" | "text">;
    width: _angular_core.InputSignal<string | undefined>;
    height: _angular_core.InputSignal<string | undefined>;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiSkeleton, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiSkeleton, "ui-skeleton", never, { "shape": { "alias": "shape"; "required": false; "isSignal": true; }; "width": { "alias": "width"; "required": false; "isSignal": true; }; "height": { "alias": "height"; "required": false; "isSignal": true; }; }, {}, never, never, true, never>;
}

export { UiSkeleton };
