import * as _angular_core from '@angular/core';

type UiAlertTone = 'info' | 'success' | 'warning' | 'danger';
/** `ui-alert` — inline contextual message. Uses role="alert" for danger/warning. */
declare class UiAlert {
    private config;
    tone: _angular_core.InputSignal<UiAlertTone>;
    heading: _angular_core.InputSignal<string | undefined>;
    dismissible: _angular_core.InputSignal<boolean>;
    radius: _angular_core.InputSignal<boolean>;
    dismiss: _angular_core.OutputEmitterRef<void>;
    protected readonly glyph: Record<UiAlertTone, string>;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiAlert, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiAlert, "ui-alert", never, { "tone": { "alias": "tone"; "required": false; "isSignal": true; }; "heading": { "alias": "heading"; "required": false; "isSignal": true; }; "dismissible": { "alias": "dismissible"; "required": false; "isSignal": true; }; "radius": { "alias": "radius"; "required": false; "isSignal": true; }; }, { "dismiss": "dismiss"; }, never, ["*"], true, never>;
}

export { UiAlert };
export type { UiAlertTone };
