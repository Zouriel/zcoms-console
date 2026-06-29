import * as _angular_core from '@angular/core';

interface UiColumn<T = Record<string, unknown>> {
    key: string;
    header: string;
    sortable?: boolean;
    align?: 'left' | 'right' | 'center';
    /** Optional cell formatter; receives the raw cell value and the full row. */
    format?: (value: unknown, row: T) => string;
}
type SortDir = 'asc' | 'desc' | null;
/**
 * `ui-table` — accessible data table with click-to-sort headers and optional
 * row selection. Pass `columns` + `data`; listen to `(selectionChange)`.
 * (Virtual scroll / CDK table integration is a planned extension.)
 */
declare class UiTable<T extends Record<string, unknown> = Record<string, unknown>> {
    private config;
    columns: _angular_core.InputSignal<UiColumn<T>[]>;
    data: _angular_core.InputSignal<T[]>;
    selectable: _angular_core.InputSignal<boolean>;
    emptyText: _angular_core.InputSignal<string>;
    radius: _angular_core.InputSignal<boolean>;
    selectionChange: _angular_core.OutputEmitterRef<T[]>;
    protected readonly sortKey: _angular_core.WritableSignal<string | null>;
    protected readonly sortDir: _angular_core.WritableSignal<SortDir>;
    protected readonly selected: _angular_core.WritableSignal<Set<T>>;
    protected readonly sorted: _angular_core.Signal<T[]>;
    protected readonly colspan: _angular_core.Signal<number>;
    protected readonly allSelected: _angular_core.Signal<boolean>;
    protected readonly someSelected: _angular_core.Signal<boolean>;
    protected cell(row: T, col: UiColumn<T>): string;
    protected sortBy(key: string): void;
    protected ariaSort(key: string): string | null;
    protected sortGlyph(key: string): string;
    protected toggleRow(row: T): void;
    protected toggleAll(e: Event): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiTable<any>, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiTable<any>, "ui-table", never, { "columns": { "alias": "columns"; "required": false; "isSignal": true; }; "data": { "alias": "data"; "required": false; "isSignal": true; }; "selectable": { "alias": "selectable"; "required": false; "isSignal": true; }; "emptyText": { "alias": "emptyText"; "required": false; "isSignal": true; }; "radius": { "alias": "radius"; "required": false; "isSignal": true; }; }, { "selectionChange": "selectionChange"; }, never, never, true, never>;
}

export { UiTable };
export type { UiColumn };
