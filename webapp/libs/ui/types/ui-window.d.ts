import * as _angular_core from '@angular/core';
import { OnDestroy, AfterViewInit, OnInit } from '@angular/core';

type UiDockSide = 'left' | 'right' | 'top' | 'bottom' | 'maximize' | null;
/** A window's imperative surface, registered with the manager for coordination. */
interface UiWindowBounds {
    x: number;
    y: number;
    width: number;
    height: number;
}
interface UiWindowHandle {
    id: string;
    minimize(): void;
    restore(): void;
    dock(side: UiDockSide): void;
    focus(): void;
    setBounds(bounds: UiWindowBounds): void;
}
/**
 * `UiWindowManager` — tracks open windows, focus order, and z-index stacking,
 * and exposes bulk operations (minimize all, tile). Each `ui-window` registers
 * itself on init.
 */
declare class UiWindowManager {
    private readonly baseZ;
    private readonly topZ;
    private readonly registry;
    /** Currently focused window id (front-most). */
    readonly focusedId: _angular_core.WritableSignal<string | null>;
    /** Number of registered windows (reactive, for UIs that show a count). */
    readonly count: _angular_core.WritableSignal<number>;
    nextId(): string;
    register(handle: UiWindowHandle): void;
    unregister(id: string): void;
    /** Allocate the next z-index and mark the window focused. */
    bringToFront(id: string): number;
    focus(id: string): void;
    dock(id: string, side: UiDockSide): void;
    minimizeAll(): void;
    restoreAll(): void;
    /** Tile all registered windows into a grid covering the viewport. */
    tile(): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiWindowManager, never>;
    static ɵprov: _angular_core.ɵɵInjectableDeclaration<UiWindowManager>;
}

interface UiDragPosition {
    x: number;
    y: number;
}
interface UiDragEvent extends UiDragPosition {
    pointerX: number;
    pointerY: number;
}
/**
 * `uiDraggable` — makes the host element draggable via pointer. Moves the host
 * with a CSS transform and keeps a two-way `[(position)]`. Restrict the grab
 * area with `uiDragHandle` (a child element). Reusable behavior directive.
 */
declare class UiDraggable implements OnDestroy {
    private host;
    private zone;
    uiDragHandle: _angular_core.InputSignal<HTMLElement | undefined>;
    disabled: _angular_core.InputSignal<boolean>;
    position: _angular_core.ModelSignal<UiDragPosition>;
    dragStart: _angular_core.OutputEmitterRef<UiDragEvent>;
    dragMove: _angular_core.OutputEmitterRef<UiDragEvent>;
    dragEnd: _angular_core.OutputEmitterRef<UiDragEvent>;
    protected readonly transform: _angular_core.Signal<string>;
    private startPointer;
    private startPos;
    private dragging;
    private readonly move;
    private readonly up;
    protected onPointerDown(e: PointerEvent): void;
    private onPointerMove;
    private onPointerUp;
    private teardown;
    ngOnDestroy(): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiDraggable, never>;
    static ɵdir: _angular_core.ɵɵDirectiveDeclaration<UiDraggable, "[uiDraggable]", never, { "uiDragHandle": { "alias": "uiDragHandle"; "required": false; "isSignal": true; }; "disabled": { "alias": "uiDraggableDisabled"; "required": false; "isSignal": true; }; "position": { "alias": "position"; "required": false; "isSignal": true; }; }, { "position": "positionChange"; "dragStart": "dragStart"; "dragMove": "dragMove"; "dragEnd": "dragEnd"; }, never, never, true, never>;
}

type UiResizeEdge = 'e' | 's' | 'se';
interface UiResizeEvent {
    width: number;
    height: number;
}
/**
 * `uiResizable` — adds edge/corner resize handles (E, S, SE) to the host and
 * resizes it in place. Emits `(resized)` with the new dimensions. The host
 * should establish its own width/height (e.g. a sized box). Reusable behavior.
 */
declare class UiResizable implements AfterViewInit, OnDestroy {
    private host;
    private zone;
    minWidth: _angular_core.InputSignal<number>;
    minHeight: _angular_core.InputSignal<number>;
    disabled: _angular_core.InputSignal<boolean>;
    resized: _angular_core.OutputEmitterRef<UiResizeEvent>;
    private readonly handleEls;
    private edge;
    private start;
    private readonly move;
    private readonly up;
    ngAfterViewInit(): void;
    private styleFor;
    private onDown;
    private onMove;
    private onUp;
    ngOnDestroy(): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiResizable, never>;
    static ɵdir: _angular_core.ɵɵDirectiveDeclaration<UiResizable, "[uiResizable]", never, { "minWidth": { "alias": "minWidth"; "required": false; "isSignal": true; }; "minHeight": { "alias": "minHeight"; "required": false; "isSignal": true; }; "disabled": { "alias": "uiResizableDisabled"; "required": false; "isSignal": true; }; }, { "resized": "resized"; }, never, never, true, never>;
}

type ResizeEdge = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';
/**
 * `ui-window` — floating, draggable, resizable window shell ("a window inside
 * the window"). Drag the title bar to move; drag near a screen edge to snap
 * (left/right half, maximize). Resize from any edge/corner. Min/max/restore/
 * close chrome, focus-to-front z-index via {@link UiWindowManager}. Glass +
 * radius + open animation. Hosts any content via `<ng-content>`.
 */
declare class UiWindow implements OnInit, OnDestroy {
    private config;
    private mgr;
    private zone;
    readonly id: string;
    open: _angular_core.ModelSignal<boolean>;
    title: _angular_core.InputSignal<string>;
    draggable: _angular_core.InputSignal<boolean>;
    resizable: _angular_core.InputSignal<boolean>;
    glass: _angular_core.InputSignal<boolean>;
    radius: _angular_core.InputSignal<boolean>;
    initialX: _angular_core.InputSignal<number>;
    initialY: _angular_core.InputSignal<number>;
    initialWidth: _angular_core.InputSignal<number>;
    initialHeight: _angular_core.InputSignal<number>;
    closed: _angular_core.OutputEmitterRef<void>;
    protected readonly edges: ResizeEdge[];
    protected readonly x: _angular_core.WritableSignal<number>;
    protected readonly y: _angular_core.WritableSignal<number>;
    protected readonly width: _angular_core.WritableSignal<number>;
    protected readonly height: _angular_core.WritableSignal<number>;
    protected readonly z: _angular_core.WritableSignal<number>;
    protected readonly maximized: _angular_core.WritableSignal<boolean>;
    protected readonly minimized: _angular_core.WritableSignal<boolean>;
    protected readonly snap: _angular_core.WritableSignal<UiDockSide>;
    private prev;
    protected readonly snapBounds: _angular_core.Signal<UiWindowBounds>;
    private dragStart;
    private dragging;
    private readonly dMove;
    private readonly dUp;
    private rzEdge;
    private rzStart;
    private readonly rMove;
    private readonly rUp;
    ngOnInit(): void;
    ngOnDestroy(): void;
    protected focus(): void;
    protected startDrag(e: PointerEvent): void;
    private onDragMove;
    private onDragUp;
    private teardownDrag;
    private detectSnap;
    protected startResize(e: PointerEvent, edge: ResizeEdge): void;
    private onResizeMove;
    private onResizeUp;
    private teardownResize;
    protected toggleMax(): void;
    protected minimize(): void;
    protected close(): void;
    dock(side: UiDockSide): void;
    restore(): void;
    setBounds(b: UiWindowBounds): void;
    private applyBounds;
    private dockBounds;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiWindow, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiWindow, "ui-window", never, { "open": { "alias": "open"; "required": false; "isSignal": true; }; "title": { "alias": "title"; "required": false; "isSignal": true; }; "draggable": { "alias": "draggable"; "required": false; "isSignal": true; }; "resizable": { "alias": "resizable"; "required": false; "isSignal": true; }; "glass": { "alias": "glass"; "required": false; "isSignal": true; }; "radius": { "alias": "radius"; "required": false; "isSignal": true; }; "initialX": { "alias": "initialX"; "required": false; "isSignal": true; }; "initialY": { "alias": "initialY"; "required": false; "isSignal": true; }; "initialWidth": { "alias": "initialWidth"; "required": false; "isSignal": true; }; "initialHeight": { "alias": "initialHeight"; "required": false; "isSignal": true; }; }, { "open": "openChange"; "closed": "closed"; }, never, ["*"], true, never>;
}

export { UiDraggable, UiResizable, UiWindow, UiWindowManager };
export type { UiDockSide, UiDragEvent, UiDragPosition, UiResizeEdge, UiResizeEvent, UiWindowBounds, UiWindowHandle };
