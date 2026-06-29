import * as _angular_core from '@angular/core';

interface UiCommand {
    label: string;
    value: string;
    group?: string;
    icon?: string;
    shortcut?: string;
    keywords?: string;
}
/**
 * `ui-command-palette` — ⌘K-style fuzzy command launcher. Bind `[(open)]`,
 * pass `commands`, listen to `(run)`. Filters as you type; Arrow/Enter to run.
 */
declare class UiCommandPalette {
    open: _angular_core.ModelSignal<boolean>;
    commands: _angular_core.InputSignal<UiCommand[]>;
    placeholder: _angular_core.InputSignal<string>;
    run: _angular_core.OutputEmitterRef<UiCommand>;
    protected readonly query: _angular_core.WritableSignal<string>;
    protected readonly active: _angular_core.WritableSignal<number>;
    private input;
    protected readonly filtered: _angular_core.Signal<UiCommand[]>;
    constructor();
    protected onInput(e: Event): void;
    protected onKey(e: KeyboardEvent): void;
    protected pick(c: UiCommand): void;
    private runCommand;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiCommandPalette, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiCommandPalette, "ui-command-palette", never, { "open": { "alias": "open"; "required": false; "isSignal": true; }; "commands": { "alias": "commands"; "required": false; "isSignal": true; }; "placeholder": { "alias": "placeholder"; "required": false; "isSignal": true; }; }, { "open": "openChange"; "run": "run"; }, never, never, true, never>;
}

export { UiCommandPalette };
export type { UiCommand };
