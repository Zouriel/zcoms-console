import * as _angular_core from '@angular/core';
import { UiSize } from 'ui';
import { ConnectedPosition } from '@angular/cdk/overlay';

type UiButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'destructive';
/**
 * `ui-button` — the action primitive. Wires `glass`/`radius` to the global
 * UiConfig defaults (overridable per instance) and uses only design tokens.
 */
declare class UiButton {
    private config;
    variant: _angular_core.InputSignal<UiButtonVariant>;
    size: _angular_core.InputSignal<UiSize>;
    type: _angular_core.InputSignal<"button" | "submit" | "reset">;
    disabled: _angular_core.InputSignal<boolean>;
    loading: _angular_core.InputSignal<boolean>;
    block: _angular_core.InputSignal<boolean>;
    /** Opt-in glass treatment. Buttons are solid by default (not driven by the
     *  global glass config, which targets surface components only). */
    glass: _angular_core.InputSignal<boolean>;
    radius: _angular_core.InputSignal<boolean>;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiButton, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiButton, "ui-button", never, { "variant": { "alias": "variant"; "required": false; "isSignal": true; }; "size": { "alias": "size"; "required": false; "isSignal": true; }; "type": { "alias": "type"; "required": false; "isSignal": true; }; "disabled": { "alias": "disabled"; "required": false; "isSignal": true; }; "loading": { "alias": "loading"; "required": false; "isSignal": true; }; "block": { "alias": "block"; "required": false; "isSignal": true; }; "glass": { "alias": "glass"; "required": false; "isSignal": true; }; "radius": { "alias": "radius"; "required": false; "isSignal": true; }; }, {}, never, ["*"], true, never>;
}

/**
 * `ui-icon-button` — square, icon-only action. `label` is REQUIRED and applied
 * as `aria-label` so the control is named for assistive tech (WCAG).
 */
declare class UiIconButton {
    private config;
    /** Accessible name for the icon-only control (required for a11y). */
    label: _angular_core.InputSignal<string>;
    variant: _angular_core.InputSignal<UiButtonVariant>;
    size: _angular_core.InputSignal<UiSize>;
    type: _angular_core.InputSignal<"button" | "submit" | "reset">;
    disabled: _angular_core.InputSignal<boolean>;
    round: _angular_core.InputSignal<boolean>;
    /** Opt-in glass treatment; solid by default (see UiButton). */
    glass: _angular_core.InputSignal<boolean>;
    radius: _angular_core.InputSignal<boolean>;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiIconButton, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiIconButton, "ui-icon-button", never, { "label": { "alias": "label"; "required": true; "isSignal": true; }; "variant": { "alias": "variant"; "required": false; "isSignal": true; }; "size": { "alias": "size"; "required": false; "isSignal": true; }; "type": { "alias": "type"; "required": false; "isSignal": true; }; "disabled": { "alias": "disabled"; "required": false; "isSignal": true; }; "round": { "alias": "round"; "required": false; "isSignal": true; }; "glass": { "alias": "glass"; "required": false; "isSignal": true; }; "radius": { "alias": "radius"; "required": false; "isSignal": true; }; }, {}, never, ["*"], true, never>;
}

/** `ui-button-group` — visually joins a row of `ui-button`s into a segmented control. */
declare class UiButtonGroup {
    label: _angular_core.InputSignal<string | undefined>;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiButtonGroup, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiButtonGroup, "ui-button-group", never, { "label": { "alias": "label"; "required": false; "isSignal": true; }; }, {}, never, ["*"], true, never>;
}

/** `ui-toggle-button` — two-state button (`aria-pressed`). Bind `[(pressed)]`. */
declare class UiToggleButton {
    private config;
    pressed: _angular_core.ModelSignal<boolean>;
    size: _angular_core.InputSignal<UiSize>;
    disabled: _angular_core.InputSignal<boolean>;
    radius: _angular_core.InputSignal<boolean>;
    protected toggle(): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiToggleButton, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiToggleButton, "ui-toggle-button", never, { "pressed": { "alias": "pressed"; "required": false; "isSignal": true; }; "size": { "alias": "size"; "required": false; "isSignal": true; }; "disabled": { "alias": "disabled"; "required": false; "isSignal": true; }; "radius": { "alias": "radius"; "required": false; "isSignal": true; }; }, { "pressed": "pressedChange"; }, never, ["*"], true, never>;
}

/** `ui-fab` — floating action button, fixed to a screen corner. `label` is required (a11y). */
declare class UiFab {
    label: _angular_core.InputSignal<string>;
    position: _angular_core.InputSignal<"bottom-right" | "bottom-left" | "top-right" | "top-left">;
    size: _angular_core.InputSignal<"sm" | "md">;
    disabled: _angular_core.InputSignal<boolean>;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiFab, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiFab, "ui-fab", never, { "label": { "alias": "label"; "required": true; "isSignal": true; }; "position": { "alias": "position"; "required": false; "isSignal": true; }; "size": { "alias": "size"; "required": false; "isSignal": true; }; "disabled": { "alias": "disabled"; "required": false; "isSignal": true; }; }, {}, never, ["*"], true, never>;
}

/**
 * `ui-split-button` — a primary action plus a caret that emits `(menu)` for an
 * attached dropdown. Project the main label as content.
 */
declare class UiSplitButton {
    private config;
    variant: _angular_core.InputSignal<UiButtonVariant>;
    size: _angular_core.InputSignal<UiSize>;
    disabled: _angular_core.InputSignal<boolean>;
    radius: _angular_core.InputSignal<boolean>;
    action: _angular_core.OutputEmitterRef<void>;
    menu: _angular_core.OutputEmitterRef<void>;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiSplitButton, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiSplitButton, "ui-split-button", never, { "variant": { "alias": "variant"; "required": false; "isSignal": true; }; "size": { "alias": "size"; "required": false; "isSignal": true; }; "disabled": { "alias": "disabled"; "required": false; "isSignal": true; }; "radius": { "alias": "radius"; "required": false; "isSignal": true; }; }, { "action": "action"; "menu": "menu"; }, never, ["*"], true, never>;
}

interface UiDropdownItem {
    label: string;
    value: string;
    disabled?: boolean;
    danger?: boolean;
}
/** `ui-dropdown-button` — a button that opens a menu of actions (CDK Overlay). */
declare class UiDropdownButton {
    private config;
    items: _angular_core.InputSignal<UiDropdownItem[]>;
    variant: _angular_core.InputSignal<UiButtonVariant>;
    size: _angular_core.InputSignal<UiSize>;
    disabled: _angular_core.InputSignal<boolean>;
    radius: _angular_core.InputSignal<boolean>;
    select: _angular_core.OutputEmitterRef<UiDropdownItem>;
    protected readonly open: _angular_core.WritableSignal<boolean>;
    protected readonly positions: ConnectedPosition[];
    protected choose(item: UiDropdownItem): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiDropdownButton, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiDropdownButton, "ui-dropdown-button", never, { "items": { "alias": "items"; "required": false; "isSignal": true; }; "variant": { "alias": "variant"; "required": false; "isSignal": true; }; "size": { "alias": "size"; "required": false; "isSignal": true; }; "disabled": { "alias": "disabled"; "required": false; "isSignal": true; }; "radius": { "alias": "radius"; "required": false; "isSignal": true; }; }, { "select": "select"; }, never, ["*"], true, never>;
}

export { UiButton, UiButtonGroup, UiDropdownButton, UiFab, UiIconButton, UiSplitButton, UiToggleButton };
export type { UiButtonVariant, UiDropdownItem };
