import * as _angular_core from '@angular/core';
import { OnDestroy } from '@angular/core';
import { ConnectedPosition } from '@angular/cdk/overlay';

/**
 * `uiClickOutside` — emits when a pointer/focus event occurs outside the host
 * element. Used by popovers, dropdowns, and menus to dismiss on outside click.
 */
declare class UiClickOutside {
    private el;
    private doc;
    uiClickOutside: _angular_core.OutputEmitterRef<PointerEvent>;
    protected onDocument(event: PointerEvent): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiClickOutside, never>;
    static ɵdir: _angular_core.ɵɵDirectiveDeclaration<UiClickOutside, "[uiClickOutside]", never, {}, { "uiClickOutside": "uiClickOutside"; }, never, never, true, never>;
}

/**
 * `ui-backdrop` — full-viewport scrim behind overlays. Emits `(backdropClick)`.
 * Render conditionally with `@if`; it animates via the shared backdrop fade.
 */
declare class UiBackdrop {
    blur: _angular_core.InputSignal<boolean>;
    backdropClick: _angular_core.OutputEmitterRef<void>;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiBackdrop, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiBackdrop, "ui-backdrop", never, { "blur": { "alias": "blur"; "required": false; "isSignal": true; }; }, { "backdropClick": "backdropClick"; }, never, never, true, never>;
}

type UiTooltipPosition = 'top' | 'bottom' | 'left' | 'right';
/** Internal panel rendered inside the CDK overlay. */
declare class UiTooltipPanel {
    readonly text: _angular_core.WritableSignal<string>;
    id: string;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiTooltipPanel, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiTooltipPanel, "ui-tooltip-panel", never, {}, {}, never, never, true, never>;
}
/**
 * `uiTooltip` — accessible hover/focus tooltip backed by the CDK Overlay.
 * Sets `aria-describedby` on the host so screen readers announce it.
 */
declare class UiTooltip implements OnDestroy {
    text: _angular_core.InputSignal<string>;
    position: _angular_core.InputSignal<UiTooltipPosition>;
    private overlay;
    private el;
    private ref;
    private panel;
    protected readonly describedBy: _angular_core.WritableSignal<string | null>;
    protected show(): void;
    protected hide(): void;
    ngOnDestroy(): void;
    private positionFor;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiTooltip, never>;
    static ɵdir: _angular_core.ɵɵDirectiveDeclaration<UiTooltip, "[uiTooltip]", never, { "text": { "alias": "uiTooltip"; "required": true; "isSignal": true; }; "position": { "alias": "uiTooltipPosition"; "required": false; "isSignal": true; }; }, {}, never, never, true, never>;
}

type UiPopoverPlacement = 'bottom' | 'top' | 'bottom-start' | 'bottom-end';
/**
 * `ui-popover` — click-triggered floating panel anchored to its trigger via the
 * CDK Overlay. Project the trigger with `[popover-trigger]` and the panel body
 * as default content. Dismisses on outside click and Escape.
 */
declare class UiPopover {
    private config;
    open: _angular_core.ModelSignal<boolean>;
    placement: _angular_core.InputSignal<UiPopoverPlacement>;
    glass: _angular_core.InputSignal<boolean>;
    radius: _angular_core.InputSignal<boolean>;
    protected toggle(): void;
    protected get positions(): ConnectedPosition[];
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiPopover, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiPopover, "ui-popover", never, { "open": { "alias": "open"; "required": false; "isSignal": true; }; "placement": { "alias": "placement"; "required": false; "isSignal": true; }; "glass": { "alias": "glass"; "required": false; "isSignal": true; }; "radius": { "alias": "radius"; "required": false; "isSignal": true; }; }, { "open": "openChange"; }, never, ["[popover-trigger]", "*"], true, never>;
}

interface UiMenuItem {
    label: string;
    value: string;
    disabled?: boolean;
    danger?: boolean;
}
/**
 * `ui-menu` — dropdown menu anchored to a trigger (CDK Overlay). Project the
 * trigger with `[menu-trigger]`; pass `items` and listen to `(select)`.
 * Arrow keys move focus, Enter activates, Escape closes (WAI-ARIA menu).
 */
declare class UiMenu {
    private config;
    open: _angular_core.ModelSignal<boolean>;
    items: _angular_core.InputSignal<UiMenuItem[]>;
    select: _angular_core.OutputEmitterRef<UiMenuItem>;
    glass: _angular_core.InputSignal<boolean>;
    radius: _angular_core.InputSignal<boolean>;
    private panel;
    protected readonly positions: ConnectedPosition[];
    protected toggle(): void;
    protected choose(item: UiMenuItem): void;
    protected focusFirst(): void;
    protected onKeydown(e: KeyboardEvent): void;
    private itemEls;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiMenu, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiMenu, "ui-menu", never, { "open": { "alias": "open"; "required": false; "isSignal": true; }; "items": { "alias": "items"; "required": false; "isSignal": true; }; "glass": { "alias": "glass"; "required": false; "isSignal": true; }; "radius": { "alias": "radius"; "required": false; "isSignal": true; }; }, { "open": "openChange"; "select": "select"; }, never, ["[menu-trigger]"], true, never>;
}

/** Internal panel rendered in the context-menu overlay. */
declare class UiContextMenuPanel {
    readonly items: _angular_core.WritableSignal<UiMenuItem[]>;
    onPick: (item: UiMenuItem) => void;
    protected pick(item: UiMenuItem): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiContextMenuPanel, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiContextMenuPanel, "ui-context-menu-panel", never, {}, {}, never, never, true, never>;
}
/**
 * `uiContextMenu` — opens a menu at the pointer on right-click (CDK Overlay).
 * Bind the items and listen to `(contextSelect)`.
 */
declare class UiContextMenu implements OnDestroy {
    private overlay;
    items: _angular_core.InputSignal<UiMenuItem[]>;
    contextSelect: _angular_core.OutputEmitterRef<UiMenuItem>;
    private ref;
    protected open(e: MouseEvent): void;
    private close;
    ngOnDestroy(): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiContextMenu, never>;
    static ɵdir: _angular_core.ɵɵDirectiveDeclaration<UiContextMenu, "[uiContextMenu]", never, { "items": { "alias": "uiContextMenu"; "required": false; "isSignal": true; }; }, { "contextSelect": "contextSelect"; }, never, never, true, never>;
}

export { UiBackdrop, UiClickOutside, UiContextMenu, UiContextMenuPanel, UiMenu, UiPopover, UiTooltip, UiTooltipPanel };
export type { UiMenuItem, UiPopoverPlacement, UiTooltipPosition };
