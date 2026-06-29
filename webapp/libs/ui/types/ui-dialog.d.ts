import * as _angular_core from '@angular/core';

/**
 * `ui-modal` — centered dialog with backdrop. Traps focus (CDK a11y), locks
 * body scroll while open, closes on Escape / backdrop click, and animates with
 * the shared scale + backdrop-fade animations.
 */
declare class UiModal {
    private config;
    private doc;
    open: _angular_core.ModelSignal<boolean>;
    title: _angular_core.InputSignal<string | undefined>;
    size: _angular_core.InputSignal<"sm" | "md" | "lg">;
    closeOnBackdrop: _angular_core.InputSignal<boolean>;
    closeOnEscape: _angular_core.InputSignal<boolean>;
    glass: _angular_core.InputSignal<boolean>;
    radius: _angular_core.InputSignal<boolean>;
    protected readonly labelId: string;
    constructor();
    protected onBackdrop(): void;
    protected onEscape(): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiModal, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiModal, "ui-modal", never, { "open": { "alias": "open"; "required": false; "isSignal": true; }; "title": { "alias": "title"; "required": false; "isSignal": true; }; "size": { "alias": "size"; "required": false; "isSignal": true; }; "closeOnBackdrop": { "alias": "closeOnBackdrop"; "required": false; "isSignal": true; }; "closeOnEscape": { "alias": "closeOnEscape"; "required": false; "isSignal": true; }; "glass": { "alias": "glass"; "required": false; "isSignal": true; }; "radius": { "alias": "radius"; "required": false; "isSignal": true; }; }, { "open": "openChange"; }, never, ["*", "[modal-footer]"], true, never>;
}

type UiDrawerSide = 'left' | 'right' | 'top' | 'bottom';
/**
 * `ui-drawer` — edge-anchored sheet. Slides in from `side`, traps focus, locks
 * scroll, and dismisses on Escape / backdrop click.
 */
declare class UiDrawer {
    private config;
    private doc;
    open: _angular_core.ModelSignal<boolean>;
    side: _angular_core.InputSignal<UiDrawerSide>;
    title: _angular_core.InputSignal<string | undefined>;
    closeOnBackdrop: _angular_core.InputSignal<boolean>;
    closeOnEscape: _angular_core.InputSignal<boolean>;
    glass: _angular_core.InputSignal<boolean>;
    protected readonly labelId: string;
    protected readonly slideFrom: _angular_core.Signal<"translateX(-100%)" | "translateX(100%)" | "translateY(-100%)" | "translateY(100%)">;
    constructor();
    protected onBackdrop(): void;
    protected onEscape(): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiDrawer, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiDrawer, "ui-drawer", never, { "open": { "alias": "open"; "required": false; "isSignal": true; }; "side": { "alias": "side"; "required": false; "isSignal": true; }; "title": { "alias": "title"; "required": false; "isSignal": true; }; "closeOnBackdrop": { "alias": "closeOnBackdrop"; "required": false; "isSignal": true; }; "closeOnEscape": { "alias": "closeOnEscape"; "required": false; "isSignal": true; }; "glass": { "alias": "glass"; "required": false; "isSignal": true; }; }, { "open": "openChange"; }, never, ["*"], true, never>;
}

type UiToastTone = 'info' | 'success' | 'warning' | 'danger';
interface UiToastOptions {
    message: string;
    title?: string;
    tone?: UiToastTone;
    /** Auto-dismiss after ms. Pass 0 to keep until dismissed. Default 4000. */
    duration?: number;
}
interface UiToast extends Required<Omit<UiToastOptions, 'title'>> {
    id: number;
    title?: string;
}
/**
 * `UiToastService` — enqueue transient notifications. Render once with
 * `<ui-toast-host />` near the app root.
 */
declare class UiToastService {
    readonly toasts: _angular_core.WritableSignal<UiToast[]>;
    show(opts: UiToastOptions): number;
    info(message: string, title?: string): number;
    success(message: string, title?: string): number;
    warning(message: string, title?: string): number;
    danger(message: string, title?: string): number;
    dismiss(id: number): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiToastService, never>;
    static ɵprov: _angular_core.ɵɵInjectableDeclaration<UiToastService>;
}
/** `ui-toast-host` — fixed-corner renderer for queued toasts. */
declare class UiToastHost {
    protected readonly toasts: UiToastService;
    position: _angular_core.InputSignal<"top-right" | "top-left" | "bottom-right" | "bottom-left">;
    protected readonly glyph: Record<UiToastTone, string>;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiToastHost, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiToastHost, "ui-toast-host", never, { "position": { "alias": "position"; "required": false; "isSignal": true; }; }, {}, never, never, true, never>;
}

/**
 * `ui-confirm-dialog` — a focused confirm/cancel prompt built on `ui-modal`.
 * Bind `[(open)]` and listen to `(confirm)` / `(cancel)`.
 */
declare class UiConfirmDialog {
    open: _angular_core.ModelSignal<boolean>;
    title: _angular_core.InputSignal<string>;
    message: _angular_core.InputSignal<string>;
    confirmLabel: _angular_core.InputSignal<string>;
    cancelLabel: _angular_core.InputSignal<string>;
    destructive: _angular_core.InputSignal<boolean>;
    confirm: _angular_core.OutputEmitterRef<void>;
    cancel: _angular_core.OutputEmitterRef<void>;
    protected confirmClick(): void;
    protected cancelClick(): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiConfirmDialog, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiConfirmDialog, "ui-confirm-dialog", never, { "open": { "alias": "open"; "required": false; "isSignal": true; }; "title": { "alias": "title"; "required": false; "isSignal": true; }; "message": { "alias": "message"; "required": false; "isSignal": true; }; "confirmLabel": { "alias": "confirmLabel"; "required": false; "isSignal": true; }; "cancelLabel": { "alias": "cancelLabel"; "required": false; "isSignal": true; }; "destructive": { "alias": "destructive"; "required": false; "isSignal": true; }; }, { "open": "openChange"; "confirm": "confirm"; "cancel": "cancel"; }, never, never, true, never>;
}

export { UiConfirmDialog, UiDrawer, UiModal, UiToastHost, UiToastService };
export type { UiDrawerSide, UiToast, UiToastOptions, UiToastTone };
