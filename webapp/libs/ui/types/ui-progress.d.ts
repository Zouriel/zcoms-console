import * as _angular_core from '@angular/core';
import { UiStatus } from 'ui';

/**
 * `ui-progress-bar` — determinate or indeterminate progress.
 * Set `value` (0–100) for determinate; omit/null for indeterminate.
 */
declare class UiProgressBar {
    value: _angular_core.InputSignal<number | null>;
    tone: _angular_core.InputSignal<UiStatus>;
    label: _angular_core.InputSignal<string>;
    protected readonly indeterminate: _angular_core.Signal<boolean>;
    protected readonly pct: _angular_core.Signal<number>;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiProgressBar, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiProgressBar, "ui-progress-bar", never, { "value": { "alias": "value"; "required": false; "isSignal": true; }; "tone": { "alias": "tone"; "required": false; "isSignal": true; }; "label": { "alias": "label"; "required": false; "isSignal": true; }; }, {}, never, never, true, never>;
}

export { UiProgressBar };
