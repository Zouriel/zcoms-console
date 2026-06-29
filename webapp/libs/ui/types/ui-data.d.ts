import * as _angular_core from '@angular/core';
import { UiStatus } from 'ui';

interface UiDescriptionItem {
    term: string;
    detail: string;
}
/** `ui-description-list` — key/value pairs (a semantic `<dl>`). */
declare class UiDescriptionList {
    items: _angular_core.InputSignal<UiDescriptionItem[]>;
    layout: _angular_core.InputSignal<"stacked" | "row">;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiDescriptionList, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiDescriptionList, "ui-description-list", never, { "items": { "alias": "items"; "required": false; "isSignal": true; }; "layout": { "alias": "layout"; "required": false; "isSignal": true; }; }, {}, never, never, true, never>;
}

interface UiTimelineItem {
    title: string;
    description?: string;
    meta?: string;
    tone?: UiStatus;
}
/** `ui-timeline` — vertical sequence of events with connector line. */
declare class UiTimeline {
    items: _angular_core.InputSignal<UiTimelineItem[]>;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiTimeline, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiTimeline, "ui-timeline", never, { "items": { "alias": "items"; "required": false; "isSignal": true; }; }, {}, never, never, true, never>;
}

/** `ui-code-block` — monospace code panel with language label and copy button. */
declare class UiCodeBlock {
    private doc;
    code: _angular_core.InputSignal<string>;
    language: _angular_core.InputSignal<string>;
    radius: _angular_core.InputSignal<boolean>;
    protected readonly copied: _angular_core.WritableSignal<boolean>;
    protected copy(): Promise<void>;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiCodeBlock, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiCodeBlock, "ui-code-block", never, { "code": { "alias": "code"; "required": false; "isSignal": true; }; "language": { "alias": "language"; "required": false; "isSignal": true; }; "radius": { "alias": "radius"; "required": false; "isSignal": true; }; }, {}, never, never, true, never>;
}

interface UiTreeNode {
    label: string;
    value: string;
    icon?: string;
    children?: UiTreeNode[];
}
/** `ui-tree` — expandable hierarchy with selection (recursive, WAI-ARIA tree). */
declare class UiTree {
    nodes: _angular_core.InputSignal<UiTreeNode[]>;
    selected: _angular_core.ModelSignal<string | null>;
    nodeSelect: _angular_core.OutputEmitterRef<UiTreeNode>;
    protected readonly expanded: _angular_core.WritableSignal<Set<string>>;
    protected toggle(n: UiTreeNode, e: Event): void;
    protected choose(n: UiTreeNode): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiTree, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiTree, "ui-tree", never, { "nodes": { "alias": "nodes"; "required": false; "isSignal": true; }; "selected": { "alias": "selected"; "required": false; "isSignal": true; }; }, { "selected": "selectedChange"; "nodeSelect": "nodeSelect"; }, never, never, true, never>;
}

interface UiTreeTableColumn {
    key: string;
    header: string;
    align?: 'left' | 'right' | 'center';
}
interface UiTreeTableRow {
    label: string;
    value: string;
    data?: Record<string, unknown>;
    children?: UiTreeTableRow[];
}
interface FlatRow {
    row: UiTreeTableRow;
    depth: number;
}
/** `ui-tree-table` — hierarchical table; the first column is an expandable tree. */
declare class UiTreeTable {
    rows: _angular_core.InputSignal<UiTreeTableRow[]>;
    columns: _angular_core.InputSignal<UiTreeTableColumn[]>;
    firstHeader: _angular_core.InputSignal<string>;
    protected readonly expanded: _angular_core.WritableSignal<Set<string>>;
    protected readonly visible: _angular_core.Signal<FlatRow[]>;
    protected toggle(row: UiTreeTableRow): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiTreeTable, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiTreeTable, "ui-tree-table", never, { "rows": { "alias": "rows"; "required": false; "isSignal": true; }; "columns": { "alias": "columns"; "required": false; "isSignal": true; }; "firstHeader": { "alias": "firstHeader"; "required": false; "isSignal": true; }; }, {}, never, never, true, never>;
}

export { UiCodeBlock, UiDescriptionList, UiTimeline, UiTree, UiTreeTable };
export type { UiDescriptionItem, UiTimelineItem, UiTreeNode, UiTreeTableColumn, UiTreeTableRow };
