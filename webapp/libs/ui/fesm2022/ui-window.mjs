import * as i0 from '@angular/core';
import { signal, Injectable, inject, ElementRef, NgZone, input, model, output, computed, Directive, Component } from '@angular/core';
import { UI_CONFIG } from 'ui';

let windowSeq = 0;
/**
 * `UiWindowManager` — tracks open windows, focus order, and z-index stacking,
 * and exposes bulk operations (minimize all, tile). Each `ui-window` registers
 * itself on init.
 */
class UiWindowManager {
    baseZ = 1100; // matches --ui-z-window
    topZ = signal(this.baseZ, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "topZ" }] : /* istanbul ignore next */ []));
    registry = new Map();
    /** Currently focused window id (front-most). */
    focusedId = signal(null, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "focusedId" }] : /* istanbul ignore next */ []));
    /** Number of registered windows (reactive, for UIs that show a count). */
    count = signal(0, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "count" }] : /* istanbul ignore next */ []));
    nextId() {
        return `ui-window-${windowSeq++}`;
    }
    register(handle) {
        this.registry.set(handle.id, handle);
        this.count.set(this.registry.size);
        this.focusedId.set(handle.id);
    }
    unregister(id) {
        this.registry.delete(id);
        this.count.set(this.registry.size);
        if (this.focusedId() === id)
            this.focusedId.set(null);
    }
    /** Allocate the next z-index and mark the window focused. */
    bringToFront(id) {
        const z = this.topZ() + 1;
        this.topZ.set(z);
        this.focusedId.set(id);
        return z;
    }
    focus(id) {
        this.registry.get(id)?.focus();
    }
    dock(id, side) {
        this.registry.get(id)?.dock(side);
    }
    minimizeAll() {
        for (const h of this.registry.values())
            h.minimize();
    }
    restoreAll() {
        for (const h of this.registry.values())
            h.restore();
    }
    /** Tile all registered windows into a grid covering the viewport. */
    tile() {
        const handles = [...this.registry.values()];
        const n = handles.length;
        if (!n)
            return;
        const cols = Math.ceil(Math.sqrt(n));
        const rows = Math.ceil(n / cols);
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const w = Math.floor(vw / cols);
        const h = Math.floor(vh / rows);
        handles.forEach((handle, i) => {
            const cx = i % cols;
            const cy = Math.floor(i / cols);
            handle.setBounds({ x: cx * w, y: cy * h, width: w, height: h });
        });
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiWindowManager, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiWindowManager, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiWindowManager, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });

/**
 * `uiDraggable` — makes the host element draggable via pointer. Moves the host
 * with a CSS transform and keeps a two-way `[(position)]`. Restrict the grab
 * area with `uiDragHandle` (a child element). Reusable behavior directive.
 */
class UiDraggable {
    host = inject(ElementRef);
    zone = inject(NgZone);
    uiDragHandle = input(/* @ts-ignore */
    ...(ngDevMode ? [undefined, { debugName: "uiDragHandle" }] : /* istanbul ignore next */ []));
    disabled = input(false, { ...(ngDevMode ? { debugName: "disabled" } : /* istanbul ignore next */ {}), alias: 'uiDraggableDisabled' });
    position = model({ x: 0, y: 0 }, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "position" }] : /* istanbul ignore next */ []));
    dragStart = output();
    dragMove = output();
    dragEnd = output();
    transform = computed(() => {
        const p = this.position();
        return `translate(${p.x}px, ${p.y}px)`;
    }, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "transform" }] : /* istanbul ignore next */ []));
    startPointer = { x: 0, y: 0 };
    startPos = { x: 0, y: 0 };
    dragging = false;
    move = (e) => this.onPointerMove(e);
    up = (e) => this.onPointerUp(e);
    onPointerDown(e) {
        if (this.disabled() || e.button !== 0)
            return;
        const handle = this.uiDragHandle();
        if (handle && !handle.contains(e.target))
            return;
        this.dragging = true;
        this.startPointer = { x: e.clientX, y: e.clientY };
        this.startPos = { ...this.position() };
        this.host.nativeElement.setPointerCapture?.(e.pointerId);
        this.zone.runOutsideAngular(() => {
            document.addEventListener('pointermove', this.move);
            document.addEventListener('pointerup', this.up);
        });
        this.dragStart.emit({ ...this.startPos, pointerX: e.clientX, pointerY: e.clientY });
        e.preventDefault();
    }
    onPointerMove(e) {
        if (!this.dragging)
            return;
        const next = {
            x: this.startPos.x + (e.clientX - this.startPointer.x),
            y: this.startPos.y + (e.clientY - this.startPointer.y),
        };
        this.zone.run(() => {
            this.position.set(next);
            this.dragMove.emit({ ...next, pointerX: e.clientX, pointerY: e.clientY });
        });
    }
    onPointerUp(e) {
        if (!this.dragging)
            return;
        this.dragging = false;
        this.teardown();
        this.zone.run(() => this.dragEnd.emit({ ...this.position(), pointerX: e.clientX, pointerY: e.clientY }));
    }
    teardown() {
        document.removeEventListener('pointermove', this.move);
        document.removeEventListener('pointerup', this.up);
    }
    ngOnDestroy() {
        this.teardown();
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiDraggable, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "17.1.0", version: "22.0.4", type: UiDraggable, isStandalone: true, selector: "[uiDraggable]", inputs: { uiDragHandle: { classPropertyName: "uiDragHandle", publicName: "uiDragHandle", isSignal: true, isRequired: false, transformFunction: null }, disabled: { classPropertyName: "disabled", publicName: "uiDraggableDisabled", isSignal: true, isRequired: false, transformFunction: null }, position: { classPropertyName: "position", publicName: "position", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { position: "positionChange", dragStart: "dragStart", dragMove: "dragMove", dragEnd: "dragEnd" }, host: { listeners: { "pointerdown": "onPointerDown($event)" }, properties: { "style.transform": "transform()", "style.touch-action": "\"none\"" } }, ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiDraggable, decorators: [{
            type: Directive,
            args: [{
                    selector: '[uiDraggable]',
                    host: {
                        '[style.transform]': 'transform()',
                        '[style.touch-action]': '"none"',
                        '(pointerdown)': 'onPointerDown($event)',
                    },
                }]
        }], propDecorators: { uiDragHandle: [{ type: i0.Input, args: [{ isSignal: true, alias: "uiDragHandle", required: false }] }], disabled: [{ type: i0.Input, args: [{ isSignal: true, alias: "uiDraggableDisabled", required: false }] }], position: [{ type: i0.Input, args: [{ isSignal: true, alias: "position", required: false }] }, { type: i0.Output, args: ["positionChange"] }], dragStart: [{ type: i0.Output, args: ["dragStart"] }], dragMove: [{ type: i0.Output, args: ["dragMove"] }], dragEnd: [{ type: i0.Output, args: ["dragEnd"] }] } });

/**
 * `uiResizable` — adds edge/corner resize handles (E, S, SE) to the host and
 * resizes it in place. Emits `(resized)` with the new dimensions. The host
 * should establish its own width/height (e.g. a sized box). Reusable behavior.
 */
class UiResizable {
    host = inject(ElementRef);
    zone = inject(NgZone);
    minWidth = input(80, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "minWidth" }] : /* istanbul ignore next */ []));
    minHeight = input(48, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "minHeight" }] : /* istanbul ignore next */ []));
    disabled = input(false, { ...(ngDevMode ? { debugName: "disabled" } : /* istanbul ignore next */ {}), alias: 'uiResizableDisabled' });
    resized = output();
    handleEls = [];
    edge = null;
    start = { x: 0, y: 0, w: 0, h: 0 };
    move = (e) => this.onMove(e);
    up = () => this.onUp();
    ngAfterViewInit() {
        const edges = ['e', 's', 'se'];
        for (const edge of edges) {
            const el = document.createElement('div');
            el.className = `ui-resize-handle ui-resize-${edge}`;
            Object.assign(el.style, this.styleFor(edge));
            el.addEventListener('pointerdown', (e) => this.onDown(e, edge));
            this.host.nativeElement.appendChild(el);
            this.handleEls.push(el);
        }
    }
    styleFor(edge) {
        const base = { position: 'absolute', zIndex: '2', touchAction: 'none' };
        if (edge === 'e')
            return { ...base, top: '0', right: '0', width: '6px', height: '100%', cursor: 'ew-resize' };
        if (edge === 's')
            return { ...base, left: '0', bottom: '0', width: '100%', height: '6px', cursor: 'ns-resize' };
        return { ...base, right: '0', bottom: '0', width: '14px', height: '14px', cursor: 'nwse-resize' };
    }
    onDown(e, edge) {
        if (this.disabled() || e.button !== 0)
            return;
        e.preventDefault();
        e.stopPropagation();
        const rect = this.host.nativeElement.getBoundingClientRect();
        this.edge = edge;
        this.start = { x: e.clientX, y: e.clientY, w: rect.width, h: rect.height };
        this.zone.runOutsideAngular(() => {
            document.addEventListener('pointermove', this.move);
            document.addEventListener('pointerup', this.up);
        });
    }
    onMove(e) {
        if (!this.edge)
            return;
        let w = this.start.w;
        let h = this.start.h;
        if (this.edge === 'e' || this.edge === 'se')
            w = Math.max(this.minWidth(), this.start.w + (e.clientX - this.start.x));
        if (this.edge === 's' || this.edge === 'se')
            h = Math.max(this.minHeight(), this.start.h + (e.clientY - this.start.y));
        const el = this.host.nativeElement;
        el.style.width = `${w}px`;
        el.style.height = `${h}px`;
        this.zone.run(() => this.resized.emit({ width: w, height: h }));
    }
    onUp() {
        this.edge = null;
        document.removeEventListener('pointermove', this.move);
        document.removeEventListener('pointerup', this.up);
    }
    ngOnDestroy() {
        this.onUp();
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiResizable, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "17.1.0", version: "22.0.4", type: UiResizable, isStandalone: true, selector: "[uiResizable]", inputs: { minWidth: { classPropertyName: "minWidth", publicName: "minWidth", isSignal: true, isRequired: false, transformFunction: null }, minHeight: { classPropertyName: "minHeight", publicName: "minHeight", isSignal: true, isRequired: false, transformFunction: null }, disabled: { classPropertyName: "disabled", publicName: "uiResizableDisabled", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { resized: "resized" }, host: { properties: { "style.position": "\"relative\"" } }, ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiResizable, decorators: [{
            type: Directive,
            args: [{
                    selector: '[uiResizable]',
                    host: { '[style.position]': '"relative"' },
                }]
        }], propDecorators: { minWidth: [{ type: i0.Input, args: [{ isSignal: true, alias: "minWidth", required: false }] }], minHeight: [{ type: i0.Input, args: [{ isSignal: true, alias: "minHeight", required: false }] }], disabled: [{ type: i0.Input, args: [{ isSignal: true, alias: "uiResizableDisabled", required: false }] }], resized: [{ type: i0.Output, args: ["resized"] }] } });

/**
 * `ui-window` — floating, draggable, resizable window shell ("a window inside
 * the window"). Drag the title bar to move; drag near a screen edge to snap
 * (left/right half, maximize). Resize from any edge/corner. Min/max/restore/
 * close chrome, focus-to-front z-index via {@link UiWindowManager}. Glass +
 * radius + open animation. Hosts any content via `<ng-content>`.
 */
class UiWindow {
    config = inject(UI_CONFIG);
    mgr = inject(UiWindowManager);
    zone = inject(NgZone);
    id = this.mgr.nextId();
    open = model(true, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "open" }] : /* istanbul ignore next */ []));
    title = input('Window', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "title" }] : /* istanbul ignore next */ []));
    draggable = input(true, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "draggable" }] : /* istanbul ignore next */ []));
    resizable = input(true, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "resizable" }] : /* istanbul ignore next */ []));
    glass = input(this.config.glass, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "glass" }] : /* istanbul ignore next */ []));
    radius = input(this.config.radius, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "radius" }] : /* istanbul ignore next */ []));
    initialX = input(80, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "initialX" }] : /* istanbul ignore next */ []));
    initialY = input(80, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "initialY" }] : /* istanbul ignore next */ []));
    initialWidth = input(440, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "initialWidth" }] : /* istanbul ignore next */ []));
    initialHeight = input(300, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "initialHeight" }] : /* istanbul ignore next */ []));
    closed = output();
    edges = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'];
    x = signal(0, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "x" }] : /* istanbul ignore next */ []));
    y = signal(0, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "y" }] : /* istanbul ignore next */ []));
    width = signal(440, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "width" }] : /* istanbul ignore next */ []));
    height = signal(300, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "height" }] : /* istanbul ignore next */ []));
    z = signal(1100, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "z" }] : /* istanbul ignore next */ []));
    maximized = signal(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "maximized" }] : /* istanbul ignore next */ []));
    minimized = signal(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "minimized" }] : /* istanbul ignore next */ []));
    snap = signal(null, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "snap" }] : /* istanbul ignore next */ []));
    prev = null;
    snapBounds = computed(() => this.dockBounds(this.snap()), /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "snapBounds" }] : /* istanbul ignore next */ []));
    // ----- drag -----
    dragStart = { px: 0, py: 0, x: 0, y: 0 };
    dragging = false;
    dMove = (e) => this.onDragMove(e);
    dUp = () => this.onDragUp();
    // ----- resize -----
    rzEdge = null;
    rzStart = { px: 0, py: 0, x: 0, y: 0, w: 0, h: 0 };
    rMove = (e) => this.onResizeMove(e);
    rUp = () => this.onResizeUp();
    ngOnInit() {
        this.x.set(this.initialX());
        this.y.set(this.initialY());
        this.width.set(this.initialWidth());
        this.height.set(this.initialHeight());
        this.mgr.register({
            id: this.id,
            minimize: () => this.minimized.set(true),
            restore: () => this.restore(),
            dock: (side) => this.dock(side),
            focus: () => this.focus(),
            setBounds: (b) => this.setBounds(b),
        });
        this.focus();
    }
    ngOnDestroy() {
        this.mgr.unregister(this.id);
        this.teardownDrag();
        this.teardownResize();
    }
    focus() {
        this.z.set(this.mgr.bringToFront(this.id));
    }
    // ---- dragging ----
    startDrag(e) {
        if (!this.draggable() || e.button !== 0)
            return;
        if (this.maximized()) {
            this.restore();
        }
        this.dragging = true;
        this.dragStart = { px: e.clientX, py: e.clientY, x: this.x(), y: this.y() };
        this.zone.runOutsideAngular(() => {
            document.addEventListener('pointermove', this.dMove);
            document.addEventListener('pointerup', this.dUp);
        });
        e.preventDefault();
    }
    onDragMove(e) {
        if (!this.dragging)
            return;
        const nx = this.dragStart.x + (e.clientX - this.dragStart.px);
        const ny = this.dragStart.y + (e.clientY - this.dragStart.py);
        const side = this.detectSnap(e.clientX, e.clientY);
        this.zone.run(() => {
            this.x.set(nx);
            this.y.set(Math.max(0, ny));
            this.snap.set(side);
        });
    }
    onDragUp() {
        if (!this.dragging)
            return;
        this.dragging = false;
        this.teardownDrag();
        this.zone.run(() => {
            const side = this.snap();
            this.snap.set(null);
            if (side)
                this.dock(side);
        });
    }
    teardownDrag() {
        document.removeEventListener('pointermove', this.dMove);
        document.removeEventListener('pointerup', this.dUp);
    }
    detectSnap(px, py) {
        const t = 24;
        if (py <= t)
            return 'maximize';
        if (px <= t)
            return 'left';
        if (px >= window.innerWidth - t)
            return 'right';
        if (py >= window.innerHeight - t)
            return 'bottom';
        return null;
    }
    // ---- resizing ----
    startResize(e, edge) {
        if (e.button !== 0)
            return;
        e.preventDefault();
        e.stopPropagation();
        this.rzEdge = edge;
        this.rzStart = { px: e.clientX, py: e.clientY, x: this.x(), y: this.y(), w: this.width(), h: this.height() };
        this.zone.runOutsideAngular(() => {
            document.addEventListener('pointermove', this.rMove);
            document.addEventListener('pointerup', this.rUp);
        });
    }
    onResizeMove(e) {
        if (!this.rzEdge)
            return;
        const dx = e.clientX - this.rzStart.px;
        const dy = e.clientY - this.rzStart.py;
        const minW = 220, minH = 120;
        let { x, y, w, h } = this.rzStart;
        const edge = this.rzEdge;
        if (edge.includes('e'))
            w = Math.max(minW, this.rzStart.w + dx);
        if (edge.includes('s'))
            h = Math.max(minH, this.rzStart.h + dy);
        if (edge.includes('w')) {
            w = Math.max(minW, this.rzStart.w - dx);
            x = this.rzStart.x + (this.rzStart.w - w);
        }
        if (edge.includes('n')) {
            h = Math.max(minH, this.rzStart.h - dy);
            y = this.rzStart.y + (this.rzStart.h - h);
        }
        this.zone.run(() => {
            this.x.set(x);
            this.y.set(y);
            this.width.set(w);
            this.height.set(h);
        });
    }
    onResizeUp() {
        this.rzEdge = null;
        this.teardownResize();
    }
    teardownResize() {
        document.removeEventListener('pointermove', this.rMove);
        document.removeEventListener('pointerup', this.rUp);
    }
    // ---- chrome / docking ----
    toggleMax() {
        this.maximized() ? this.restore() : this.dock('maximize');
    }
    minimize() {
        this.minimized.set(true);
    }
    close() {
        this.open.set(false);
        this.closed.emit();
        this.mgr.unregister(this.id);
    }
    dock(side) {
        if (!side) {
            this.restore();
            return;
        }
        if (!this.prev)
            this.prev = { x: this.x(), y: this.y(), width: this.width(), height: this.height() };
        const b = this.dockBounds(side);
        this.applyBounds(b);
        this.maximized.set(side === 'maximize');
        this.minimized.set(false);
    }
    restore() {
        this.maximized.set(false);
        this.minimized.set(false);
        if (this.prev) {
            this.applyBounds(this.prev);
            this.prev = null;
        }
    }
    setBounds(b) {
        this.prev = null;
        this.maximized.set(false);
        this.minimized.set(false);
        this.applyBounds(b);
    }
    applyBounds(b) {
        this.x.set(b.x);
        this.y.set(b.y);
        this.width.set(b.width);
        this.height.set(b.height);
    }
    dockBounds(side) {
        const vw = typeof window !== 'undefined' ? window.innerWidth : 1200;
        const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
        switch (side) {
            case 'left': return { x: 0, y: 0, width: Math.floor(vw / 2), height: vh };
            case 'right': return { x: Math.ceil(vw / 2), y: 0, width: Math.floor(vw / 2), height: vh };
            case 'bottom': return { x: 0, y: Math.ceil(vh / 2), width: vw, height: Math.floor(vh / 2) };
            case 'maximize': return { x: 0, y: 0, width: vw, height: vh };
            default: return { x: this.x(), y: this.y(), width: this.width(), height: this.height() };
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiWindow, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "22.0.4", type: UiWindow, isStandalone: true, selector: "ui-window", inputs: { open: { classPropertyName: "open", publicName: "open", isSignal: true, isRequired: false, transformFunction: null }, title: { classPropertyName: "title", publicName: "title", isSignal: true, isRequired: false, transformFunction: null }, draggable: { classPropertyName: "draggable", publicName: "draggable", isSignal: true, isRequired: false, transformFunction: null }, resizable: { classPropertyName: "resizable", publicName: "resizable", isSignal: true, isRequired: false, transformFunction: null }, glass: { classPropertyName: "glass", publicName: "glass", isSignal: true, isRequired: false, transformFunction: null }, radius: { classPropertyName: "radius", publicName: "radius", isSignal: true, isRequired: false, transformFunction: null }, initialX: { classPropertyName: "initialX", publicName: "initialX", isSignal: true, isRequired: false, transformFunction: null }, initialY: { classPropertyName: "initialY", publicName: "initialY", isSignal: true, isRequired: false, transformFunction: null }, initialWidth: { classPropertyName: "initialWidth", publicName: "initialWidth", isSignal: true, isRequired: false, transformFunction: null }, initialHeight: { classPropertyName: "initialHeight", publicName: "initialHeight", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { open: "openChange", closed: "closed" }, ngImport: i0, template: `
    @if (snap()) { <div class="snap-preview" [style.left.px]="snapBounds().x" [style.top.px]="snapBounds().y"
                        [style.width.px]="snapBounds().width" [style.height.px]="snapBounds().height"></div> }
    <section
      class="ui-window"
      [class.glass]="glass()"
      [class.no-radius]="!radius()"
      [class.minimized]="minimized()"
      [style.left.px]="x()" [style.top.px]="y()"
      [style.width.px]="width()" [style.height.px]="minimized() ? null : height()"
      [style.z-index]="z()"
      role="dialog" [attr.aria-label]="title()"
      (pointerdown)="focus()"
      animate.enter="ui-window-open-enter"
      animate.leave="ui-window-close-leave">
      <header class="titlebar" (pointerdown)="startDrag($event)" (dblclick)="toggleMax()">
        <span class="title">{{ title() }}</span>
        <div class="chrome">
          <button type="button" class="ctl" aria-label="Minimize" (pointerdown)="$event.stopPropagation()" (click)="minimize()">—</button>
          <button type="button" class="ctl" [attr.aria-label]="maximized() ? 'Restore' : 'Maximize'" (pointerdown)="$event.stopPropagation()" (click)="toggleMax()">{{ maximized() ? '❐' : '▢' }}</button>
          <button type="button" class="ctl close" aria-label="Close" (pointerdown)="$event.stopPropagation()" (click)="close()">✕</button>
        </div>
      </header>
      @if (!minimized()) {
        <div class="body"><ng-content /></div>
      }
      @if (resizable() && !maximized() && !minimized()) {
        @for (edge of edges; track edge) {
          <div class="rz rz-{{edge}}" (pointerdown)="startResize($event, edge)"></div>
        }
      }
    </section>
  `, isInline: true, styles: [":host{display:contents}.ui-window{position:fixed;display:flex;flex-direction:column;min-width:220px;min-height:120px;background:var(--ui-color-surface);color:var(--ui-color-text);border:1px solid var(--ui-color-border);border-radius:var(--ui-radius);box-shadow:var(--ui-shadow-3);font-family:var(--ui-font-default);overflow:hidden}.ui-window.no-radius{border-radius:0}.ui-window.glass{background:var(--ui-glass-bg);-webkit-backdrop-filter:blur(var(--ui-glass-blur));backdrop-filter:blur(var(--ui-glass-blur));border-color:var(--ui-glass-border)}.ui-window.minimized{min-height:0;height:auto}.titlebar{display:flex;align-items:center;justify-content:space-between;gap:var(--ui-space-3);height:34px;padding:0 var(--ui-space-2) 0 var(--ui-space-3);flex:none;background:var(--ui-color-surface-raised);border-bottom:1px solid var(--ui-color-border);cursor:grab;-webkit-user-select:none;user-select:none;touch-action:none}.titlebar:active{cursor:grabbing}.title{font-size:var(--ui-font-size-sm);font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.chrome{display:flex;gap:2px}.ctl{width:26px;height:24px;border:none;background:transparent;color:var(--ui-color-text-muted);border-radius:5px;cursor:pointer;font-size:12px;line-height:1}.ctl:hover{background:var(--ui-color-surface);color:var(--ui-color-text)}.ctl.close:hover{background:var(--ui-color-danger);color:#fff}.ctl:focus-visible{outline:none;box-shadow:var(--ui-focus-ring)}.body{flex:1;overflow:auto;padding:var(--ui-space-4)}.rz{position:absolute;z-index:3;touch-action:none}.rz-n{top:-3px;left:6px;right:6px;height:7px;cursor:ns-resize}.rz-s{bottom:-3px;left:6px;right:6px;height:7px;cursor:ns-resize}.rz-e{right:-3px;top:6px;bottom:6px;width:7px;cursor:ew-resize}.rz-w{left:-3px;top:6px;bottom:6px;width:7px;cursor:ew-resize}.rz-ne{top:-3px;right:-3px;width:12px;height:12px;cursor:nesw-resize}.rz-nw{top:-3px;left:-3px;width:12px;height:12px;cursor:nwse-resize}.rz-se{bottom:-3px;right:-3px;width:12px;height:12px;cursor:nwse-resize}.rz-sw{bottom:-3px;left:-3px;width:12px;height:12px;cursor:nesw-resize}.snap-preview{position:fixed;z-index:1099;border-radius:var(--ui-radius);background:color-mix(in srgb,var(--ui-color-primary) 22%,transparent);border:2px solid var(--ui-color-primary);pointer-events:none;transition:all var(--ui-motion-fast) var(--ui-ease-standard)}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiWindow, decorators: [{
            type: Component,
            args: [{ selector: 'ui-window', template: `
    @if (snap()) { <div class="snap-preview" [style.left.px]="snapBounds().x" [style.top.px]="snapBounds().y"
                        [style.width.px]="snapBounds().width" [style.height.px]="snapBounds().height"></div> }
    <section
      class="ui-window"
      [class.glass]="glass()"
      [class.no-radius]="!radius()"
      [class.minimized]="minimized()"
      [style.left.px]="x()" [style.top.px]="y()"
      [style.width.px]="width()" [style.height.px]="minimized() ? null : height()"
      [style.z-index]="z()"
      role="dialog" [attr.aria-label]="title()"
      (pointerdown)="focus()"
      animate.enter="ui-window-open-enter"
      animate.leave="ui-window-close-leave">
      <header class="titlebar" (pointerdown)="startDrag($event)" (dblclick)="toggleMax()">
        <span class="title">{{ title() }}</span>
        <div class="chrome">
          <button type="button" class="ctl" aria-label="Minimize" (pointerdown)="$event.stopPropagation()" (click)="minimize()">—</button>
          <button type="button" class="ctl" [attr.aria-label]="maximized() ? 'Restore' : 'Maximize'" (pointerdown)="$event.stopPropagation()" (click)="toggleMax()">{{ maximized() ? '❐' : '▢' }}</button>
          <button type="button" class="ctl close" aria-label="Close" (pointerdown)="$event.stopPropagation()" (click)="close()">✕</button>
        </div>
      </header>
      @if (!minimized()) {
        <div class="body"><ng-content /></div>
      }
      @if (resizable() && !maximized() && !minimized()) {
        @for (edge of edges; track edge) {
          <div class="rz rz-{{edge}}" (pointerdown)="startResize($event, edge)"></div>
        }
      }
    </section>
  `, styles: [":host{display:contents}.ui-window{position:fixed;display:flex;flex-direction:column;min-width:220px;min-height:120px;background:var(--ui-color-surface);color:var(--ui-color-text);border:1px solid var(--ui-color-border);border-radius:var(--ui-radius);box-shadow:var(--ui-shadow-3);font-family:var(--ui-font-default);overflow:hidden}.ui-window.no-radius{border-radius:0}.ui-window.glass{background:var(--ui-glass-bg);-webkit-backdrop-filter:blur(var(--ui-glass-blur));backdrop-filter:blur(var(--ui-glass-blur));border-color:var(--ui-glass-border)}.ui-window.minimized{min-height:0;height:auto}.titlebar{display:flex;align-items:center;justify-content:space-between;gap:var(--ui-space-3);height:34px;padding:0 var(--ui-space-2) 0 var(--ui-space-3);flex:none;background:var(--ui-color-surface-raised);border-bottom:1px solid var(--ui-color-border);cursor:grab;-webkit-user-select:none;user-select:none;touch-action:none}.titlebar:active{cursor:grabbing}.title{font-size:var(--ui-font-size-sm);font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.chrome{display:flex;gap:2px}.ctl{width:26px;height:24px;border:none;background:transparent;color:var(--ui-color-text-muted);border-radius:5px;cursor:pointer;font-size:12px;line-height:1}.ctl:hover{background:var(--ui-color-surface);color:var(--ui-color-text)}.ctl.close:hover{background:var(--ui-color-danger);color:#fff}.ctl:focus-visible{outline:none;box-shadow:var(--ui-focus-ring)}.body{flex:1;overflow:auto;padding:var(--ui-space-4)}.rz{position:absolute;z-index:3;touch-action:none}.rz-n{top:-3px;left:6px;right:6px;height:7px;cursor:ns-resize}.rz-s{bottom:-3px;left:6px;right:6px;height:7px;cursor:ns-resize}.rz-e{right:-3px;top:6px;bottom:6px;width:7px;cursor:ew-resize}.rz-w{left:-3px;top:6px;bottom:6px;width:7px;cursor:ew-resize}.rz-ne{top:-3px;right:-3px;width:12px;height:12px;cursor:nesw-resize}.rz-nw{top:-3px;left:-3px;width:12px;height:12px;cursor:nwse-resize}.rz-se{bottom:-3px;right:-3px;width:12px;height:12px;cursor:nwse-resize}.rz-sw{bottom:-3px;left:-3px;width:12px;height:12px;cursor:nesw-resize}.snap-preview{position:fixed;z-index:1099;border-radius:var(--ui-radius);background:color-mix(in srgb,var(--ui-color-primary) 22%,transparent);border:2px solid var(--ui-color-primary);pointer-events:none;transition:all var(--ui-motion-fast) var(--ui-ease-standard)}\n"] }]
        }], propDecorators: { open: [{ type: i0.Input, args: [{ isSignal: true, alias: "open", required: false }] }, { type: i0.Output, args: ["openChange"] }], title: [{ type: i0.Input, args: [{ isSignal: true, alias: "title", required: false }] }], draggable: [{ type: i0.Input, args: [{ isSignal: true, alias: "draggable", required: false }] }], resizable: [{ type: i0.Input, args: [{ isSignal: true, alias: "resizable", required: false }] }], glass: [{ type: i0.Input, args: [{ isSignal: true, alias: "glass", required: false }] }], radius: [{ type: i0.Input, args: [{ isSignal: true, alias: "radius", required: false }] }], initialX: [{ type: i0.Input, args: [{ isSignal: true, alias: "initialX", required: false }] }], initialY: [{ type: i0.Input, args: [{ isSignal: true, alias: "initialY", required: false }] }], initialWidth: [{ type: i0.Input, args: [{ isSignal: true, alias: "initialWidth", required: false }] }], initialHeight: [{ type: i0.Input, args: [{ isSignal: true, alias: "initialHeight", required: false }] }], closed: [{ type: i0.Output, args: ["closed"] }] } });

/**
 * Generated bundle index. Do not edit.
 */

export { UiDraggable, UiResizable, UiWindow, UiWindowManager };
//# sourceMappingURL=ui-window.mjs.map
