import * as _angular_core from '@angular/core';
import { OnInit, OnDestroy, TemplateRef } from '@angular/core';

/**
 * `uiCopyToClipboard` — copies the bound text to the clipboard on click and
 * exposes a transient `copied` state. Emits `(copied)` / `(copyFailed)`.
 */
declare class UiCopyToClipboard {
    private doc;
    text: _angular_core.InputSignal<string>;
    readonly copied: _angular_core.WritableSignal<boolean>;
    copyEvent: _angular_core.OutputEmitterRef<string>;
    copyFailed: _angular_core.OutputEmitterRef<unknown>;
    copy(): Promise<void>;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiCopyToClipboard, never>;
    static ɵdir: _angular_core.ɵɵDirectiveDeclaration<UiCopyToClipboard, "[uiCopyToClipboard]", ["uiCopy"], { "text": { "alias": "uiCopyToClipboard"; "required": false; "isSignal": true; }; }, { "copyEvent": "copied"; "copyFailed": "copyFailed"; }, never, never, true, never>;
}

/** `uiRipple` — emits a material-style ripple from the pointer position on press. */
declare class UiRipple {
    private host;
    disabled: _angular_core.InputSignal<boolean>;
    color: _angular_core.InputSignal<string>;
    protected spawn(e: PointerEvent): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiRipple, never>;
    static ɵdir: _angular_core.ɵɵDirectiveDeclaration<UiRipple, "[uiRipple]", never, { "disabled": { "alias": "uiRippleDisabled"; "required": false; "isSignal": true; }; "color": { "alias": "uiRippleColor"; "required": false; "isSignal": true; }; }, {}, never, never, true, never>;
}

/**
 * `uiInfiniteScroll` — emits `(scrolledToEnd)` when the host scrolls within
 * `threshold` px of the bottom. Re-arms once scrolled back up.
 */
declare class UiInfiniteScroll implements OnInit, OnDestroy {
    private host;
    private zone;
    threshold: _angular_core.InputSignal<number>;
    disabled: _angular_core.InputSignal<boolean>;
    scrolledToEnd: _angular_core.OutputEmitterRef<void>;
    private armed;
    private readonly onScroll;
    ngOnInit(): void;
    ngOnDestroy(): void;
    private check;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiInfiniteScroll, never>;
    static ɵdir: _angular_core.ɵɵDirectiveDeclaration<UiInfiniteScroll, "[uiInfiniteScroll]", never, { "threshold": { "alias": "uiInfiniteScrollThreshold"; "required": false; "isSignal": true; }; "disabled": { "alias": "uiInfiniteScrollDisabled"; "required": false; "isSignal": true; }; }, { "scrolledToEnd": "scrolledToEnd"; }, never, never, true, never>;
}

/** `uiIntersect` — emits `(intersect)` with visibility as the host enters/leaves the viewport. */
declare class UiIntersect implements OnInit, OnDestroy {
    private host;
    private zone;
    rootMargin: _angular_core.InputSignal<string>;
    /** Emit only the first time the element becomes visible, then stop. */
    once: _angular_core.InputSignal<boolean>;
    intersect: _angular_core.OutputEmitterRef<boolean>;
    private observer?;
    ngOnInit(): void;
    ngOnDestroy(): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiIntersect, never>;
    static ɵdir: _angular_core.ɵɵDirectiveDeclaration<UiIntersect, "[uiIntersect]", never, { "rootMargin": { "alias": "uiIntersectRootMargin"; "required": false; "isSignal": true; }; "once": { "alias": "uiIntersectOnce"; "required": false; "isSignal": true; }; }, { "intersect": "uiIntersect"; }, never, never, true, never>;
}

interface UiSize2D {
    width: number;
    height: number;
}
/** `uiResizeObserver` — emits `(uiResizeObserver)` with the host's content-box size on change. */
declare class UiResizeObserver implements OnInit, OnDestroy {
    private host;
    private zone;
    sizeChange: _angular_core.OutputEmitterRef<UiSize2D>;
    private observer?;
    ngOnInit(): void;
    ngOnDestroy(): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiResizeObserver, never>;
    static ɵdir: _angular_core.ɵɵDirectiveDeclaration<UiResizeObserver, "[uiResizeObserver]", never, {}, { "sizeChange": "uiResizeObserver"; }, never, never, true, never>;
}

/**
 * `ui-virtual-list` — renders only the visible slice of a large list via the
 * CDK virtual scroll. Provide an item template:
 *
 *   <ui-virtual-list [items]="rows" [itemSize]="32" height="320px">
 *     <ng-template let-item>{{ item.name }}</ng-template>
 *   </ui-virtual-list>
 */
declare class UiVirtualList<T = unknown> {
    items: _angular_core.InputSignal<T[]>;
    itemSize: _angular_core.InputSignal<number>;
    height: _angular_core.InputSignal<string>;
    protected readonly tpl: _angular_core.Signal<TemplateRef<any> | undefined>;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiVirtualList<any>, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiVirtualList<any>, "ui-virtual-list", never, { "items": { "alias": "items"; "required": false; "isSignal": true; }; "itemSize": { "alias": "itemSize"; "required": false; "isSignal": true; }; "height": { "alias": "height"; "required": false; "isSignal": true; }; }, {}, ["tpl"], never, true, never>;
}

export { UiCopyToClipboard, UiInfiniteScroll, UiIntersect, UiResizeObserver, UiRipple, UiVirtualList };
export type { UiSize2D };
