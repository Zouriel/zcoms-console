import * as _angular_core from '@angular/core';
import { OnDestroy } from '@angular/core';

/** `ui-container` — centered, max-width content wrapper with responsive padding. */
declare class UiContainer {
    size: _angular_core.InputSignal<"sm" | "md" | "lg" | "xl" | "full">;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiContainer, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiContainer, "ui-container", never, { "size": { "alias": "size"; "required": false; "isSignal": true; }; }, {}, never, ["*"], true, never>;
}

type Gap$1 = 1 | 2 | 3 | 4 | 6;
/** `ui-grid` — CSS grid with a fixed column count and token-based gap. */
declare class UiGrid {
    /** Column count, or a CSS grid-template-columns string. */
    columns: _angular_core.InputSignal<string | number>;
    /** Minimum column width for an auto-fit responsive grid (overrides columns). */
    min: _angular_core.InputSignal<string | undefined>;
    gap: _angular_core.InputSignal<Gap$1>;
    protected readonly cols: _angular_core.Signal<string>;
    protected readonly gapVar: _angular_core.Signal<string>;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiGrid, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiGrid, "ui-grid", never, { "columns": { "alias": "columns"; "required": false; "isSignal": true; }; "min": { "alias": "min"; "required": false; "isSignal": true; }; "gap": { "alias": "gap"; "required": false; "isSignal": true; }; }, {}, never, ["*"], true, never>;
}

type Gap = 0 | 1 | 2 | 3 | 4 | 6;
/** `ui-stack` — flexbox row/column with token gap and alignment. */
declare class UiStack {
    direction: _angular_core.InputSignal<"row" | "column">;
    gap: _angular_core.InputSignal<Gap>;
    align: _angular_core.InputSignal<"start" | "center" | "end" | "stretch">;
    justify: _angular_core.InputSignal<"start" | "center" | "end" | "space-between">;
    wrap: _angular_core.InputSignal<boolean>;
    protected readonly gapVar: _angular_core.Signal<string>;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiStack, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiStack, "ui-stack", never, { "direction": { "alias": "direction"; "required": false; "isSignal": true; }; "gap": { "alias": "gap"; "required": false; "isSignal": true; }; "align": { "alias": "align"; "required": false; "isSignal": true; }; "justify": { "alias": "justify"; "required": false; "isSignal": true; }; "wrap": { "alias": "wrap"; "required": false; "isSignal": true; }; }, {}, never, ["*"], true, never>;
}

/** `ui-spacer` — flexible gap that pushes siblings apart inside a flex layout. */
declare class UiSpacer {
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiSpacer, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiSpacer, "ui-spacer", never, {}, {}, never, never, true, never>;
}

/** `ui-aspect-ratio` — constrains projected content to a fixed width:height ratio. */
declare class UiAspectRatio {
    /** e.g. '16 / 9', '4 / 3', '1 / 1'. */
    ratio: _angular_core.InputSignal<string>;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiAspectRatio, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiAspectRatio, "ui-aspect-ratio", never, { "ratio": { "alias": "ratio"; "required": false; "isSignal": true; }; }, {}, never, ["*"], true, never>;
}

/** `ui-scroll-area` — themed, thin-scrollbar scroll container with a fixed max height. */
declare class UiScrollArea {
    maxHeight: _angular_core.InputSignal<string>;
    axis: _angular_core.InputSignal<"y" | "x" | "both">;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiScrollArea, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiScrollArea, "ui-scroll-area", never, { "maxHeight": { "alias": "maxHeight"; "required": false; "isSignal": true; }; "axis": { "alias": "axis"; "required": false; "isSignal": true; }; }, {}, never, ["*"], true, never>;
}

/**
 * `ui-splitter` — two resizable panes with a draggable divider. Project two
 * elements with `[split-a]` and `[split-b]`.
 */
declare class UiSplitter implements OnDestroy {
    private root;
    private zone;
    orientation: _angular_core.InputSignal<"horizontal" | "vertical">;
    /** Size of the first pane as a percentage (0–100). */
    ratio: _angular_core.WritableSignal<number>;
    private dragging;
    private readonly move;
    private readonly up;
    protected start(e: PointerEvent): void;
    private onMove;
    private end;
    protected onKey(e: KeyboardEvent): void;
    ngOnDestroy(): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiSplitter, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiSplitter, "ui-splitter", never, { "orientation": { "alias": "orientation"; "required": false; "isSignal": true; }; }, {}, never, ["[split-a]", "[split-b]"], true, never>;
}

export { UiAspectRatio, UiContainer, UiGrid, UiScrollArea, UiSpacer, UiSplitter, UiStack };
