import * as i0 from '@angular/core';
import { inject, input, output, signal, computed, Component } from '@angular/core';
import { UI_CONFIG } from 'ui';

/**
 * `ui-table` — accessible data table with click-to-sort headers and optional
 * row selection. Pass `columns` + `data`; listen to `(selectionChange)`.
 * (Virtual scroll / CDK table integration is a planned extension.)
 */
class UiTable {
    config = inject(UI_CONFIG);
    columns = input([], /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "columns" }] : /* istanbul ignore next */ []));
    data = input([], /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "data" }] : /* istanbul ignore next */ []));
    selectable = input(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "selectable" }] : /* istanbul ignore next */ []));
    emptyText = input('No data', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "emptyText" }] : /* istanbul ignore next */ []));
    radius = input(this.config.radius, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "radius" }] : /* istanbul ignore next */ []));
    selectionChange = output();
    sortKey = signal(null, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "sortKey" }] : /* istanbul ignore next */ []));
    sortDir = signal(null, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "sortDir" }] : /* istanbul ignore next */ []));
    selected = signal(new Set(), /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "selected" }] : /* istanbul ignore next */ []));
    sorted = computed(() => {
        const rows = this.data();
        const key = this.sortKey();
        const dir = this.sortDir();
        if (!key || !dir)
            return rows;
        const copy = [...rows];
        copy.sort((a, b) => {
            const av = a[key], bv = b[key];
            if (av == null)
                return 1;
            if (bv == null)
                return -1;
            const cmp = av < bv ? -1 : av > bv ? 1 : 0;
            return dir === 'asc' ? cmp : -cmp;
        });
        return copy;
    }, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "sorted" }] : /* istanbul ignore next */ []));
    colspan = computed(() => this.columns().length + (this.selectable() ? 1 : 0), /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "colspan" }] : /* istanbul ignore next */ []));
    allSelected = computed(() => this.data().length > 0 && this.selected().size === this.data().length, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "allSelected" }] : /* istanbul ignore next */ []));
    someSelected = computed(() => this.selected().size > 0 && !this.allSelected(), /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "someSelected" }] : /* istanbul ignore next */ []));
    cell(row, col) {
        const value = row[col.key];
        if (col.format)
            return col.format(value, row);
        return value == null ? '' : String(value);
    }
    sortBy(key) {
        if (this.sortKey() !== key) {
            this.sortKey.set(key);
            this.sortDir.set('asc');
        }
        else {
            const next = this.sortDir() === 'asc' ? 'desc' : this.sortDir() === 'desc' ? null : 'asc';
            this.sortDir.set(next);
            if (!next)
                this.sortKey.set(null);
        }
    }
    ariaSort(key) {
        if (this.sortKey() !== key || !this.sortDir())
            return null;
        return this.sortDir() === 'asc' ? 'ascending' : 'descending';
    }
    sortGlyph(key) {
        if (this.sortKey() !== key)
            return '↕';
        return this.sortDir() === 'asc' ? '↑' : this.sortDir() === 'desc' ? '↓' : '↕';
    }
    toggleRow(row) {
        const next = new Set(this.selected());
        next.has(row) ? next.delete(row) : next.add(row);
        this.selected.set(next);
        this.selectionChange.emit([...next]);
    }
    toggleAll(e) {
        const checked = e.target.checked;
        const next = checked ? new Set(this.data()) : new Set();
        this.selected.set(next);
        this.selectionChange.emit([...next]);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiTable, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "22.0.4", type: UiTable, isStandalone: true, selector: "ui-table", inputs: { columns: { classPropertyName: "columns", publicName: "columns", isSignal: true, isRequired: false, transformFunction: null }, data: { classPropertyName: "data", publicName: "data", isSignal: true, isRequired: false, transformFunction: null }, selectable: { classPropertyName: "selectable", publicName: "selectable", isSignal: true, isRequired: false, transformFunction: null }, emptyText: { classPropertyName: "emptyText", publicName: "emptyText", isSignal: true, isRequired: false, transformFunction: null }, radius: { classPropertyName: "radius", publicName: "radius", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { selectionChange: "selectionChange" }, ngImport: i0, template: `
    <div class="wrap" [class.no-radius]="!radius()">
      <table class="ui-table">
        <thead>
          <tr>
            @if (selectable()) {
              <th class="sel" scope="col">
                <input type="checkbox" [checked]="allSelected()" [indeterminate]="someSelected()"
                       aria-label="Select all rows" (change)="toggleAll($event)" />
              </th>
            }
            @for (col of columns(); track col.key) {
              <th
                scope="col"
                [attr.data-align]="col.align || 'left'"
                [class.sortable]="col.sortable"
                [attr.aria-sort]="ariaSort(col.key)">
                @if (col.sortable) {
                  <button type="button" class="sort" (click)="sortBy(col.key)">
                    {{ col.header }}
                    <span class="arrow" aria-hidden="true">{{ sortGlyph(col.key) }}</span>
                  </button>
                } @else {
                  {{ col.header }}
                }
              </th>
            }
          </tr>
        </thead>
        <tbody>
          @for (row of sorted(); track $index) {
            <tr [class.selected]="selected().has(row)">
              @if (selectable()) {
                <td class="sel">
                  <input type="checkbox" [checked]="selected().has(row)"
                         [attr.aria-label]="'Select row ' + ($index + 1)" (change)="toggleRow(row)" />
                </td>
              }
              @for (col of columns(); track col.key) {
                <td [attr.data-align]="col.align || 'left'">{{ cell(row, col) }}</td>
              }
            </tr>
          } @empty {
            <tr><td class="empty" [attr.colspan]="colspan()">{{ emptyText() }}</td></tr>
          }
        </tbody>
      </table>
    </div>
  `, isInline: true, styles: [":host{display:block}.wrap{border:1px solid var(--ui-color-border);border-radius:var(--ui-radius);overflow:auto}.wrap.no-radius{border-radius:0}.ui-table{width:100%;border-collapse:collapse;font-family:var(--ui-font-default);font-size:var(--ui-font-size-md);color:var(--ui-color-text)}th,td{padding:var(--ui-space-2) var(--ui-space-4);text-align:left}th[data-align=right],td[data-align=right]{text-align:right}th[data-align=center],td[data-align=center]{text-align:center}thead th{background:var(--ui-color-surface-raised);border-bottom:1px solid var(--ui-color-border);font-weight:600;font-size:var(--ui-font-size-sm);color:var(--ui-color-text-muted);white-space:nowrap}tbody tr{border-bottom:1px solid var(--ui-color-border);transition:background var(--ui-motion-fast) var(--ui-ease-standard)}tbody tr:last-child{border-bottom:none}tbody tr:hover{background:color-mix(in srgb,var(--ui-color-primary) 8%,transparent)}tbody tr.selected{background:color-mix(in srgb,var(--ui-color-primary) 16%,transparent)}.sort{display:inline-flex;align-items:center;gap:var(--ui-space-1);background:none;border:none;color:inherit;font:inherit;cursor:pointer;padding:0}.sort:focus-visible{outline:none;box-shadow:var(--ui-focus-ring);border-radius:4px}.arrow{width:1em;display:inline-block}.sel{width:1px;white-space:nowrap}.empty{text-align:center;color:var(--ui-color-text-muted);padding:var(--ui-space-6)}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiTable, decorators: [{
            type: Component,
            args: [{ selector: 'ui-table', template: `
    <div class="wrap" [class.no-radius]="!radius()">
      <table class="ui-table">
        <thead>
          <tr>
            @if (selectable()) {
              <th class="sel" scope="col">
                <input type="checkbox" [checked]="allSelected()" [indeterminate]="someSelected()"
                       aria-label="Select all rows" (change)="toggleAll($event)" />
              </th>
            }
            @for (col of columns(); track col.key) {
              <th
                scope="col"
                [attr.data-align]="col.align || 'left'"
                [class.sortable]="col.sortable"
                [attr.aria-sort]="ariaSort(col.key)">
                @if (col.sortable) {
                  <button type="button" class="sort" (click)="sortBy(col.key)">
                    {{ col.header }}
                    <span class="arrow" aria-hidden="true">{{ sortGlyph(col.key) }}</span>
                  </button>
                } @else {
                  {{ col.header }}
                }
              </th>
            }
          </tr>
        </thead>
        <tbody>
          @for (row of sorted(); track $index) {
            <tr [class.selected]="selected().has(row)">
              @if (selectable()) {
                <td class="sel">
                  <input type="checkbox" [checked]="selected().has(row)"
                         [attr.aria-label]="'Select row ' + ($index + 1)" (change)="toggleRow(row)" />
                </td>
              }
              @for (col of columns(); track col.key) {
                <td [attr.data-align]="col.align || 'left'">{{ cell(row, col) }}</td>
              }
            </tr>
          } @empty {
            <tr><td class="empty" [attr.colspan]="colspan()">{{ emptyText() }}</td></tr>
          }
        </tbody>
      </table>
    </div>
  `, styles: [":host{display:block}.wrap{border:1px solid var(--ui-color-border);border-radius:var(--ui-radius);overflow:auto}.wrap.no-radius{border-radius:0}.ui-table{width:100%;border-collapse:collapse;font-family:var(--ui-font-default);font-size:var(--ui-font-size-md);color:var(--ui-color-text)}th,td{padding:var(--ui-space-2) var(--ui-space-4);text-align:left}th[data-align=right],td[data-align=right]{text-align:right}th[data-align=center],td[data-align=center]{text-align:center}thead th{background:var(--ui-color-surface-raised);border-bottom:1px solid var(--ui-color-border);font-weight:600;font-size:var(--ui-font-size-sm);color:var(--ui-color-text-muted);white-space:nowrap}tbody tr{border-bottom:1px solid var(--ui-color-border);transition:background var(--ui-motion-fast) var(--ui-ease-standard)}tbody tr:last-child{border-bottom:none}tbody tr:hover{background:color-mix(in srgb,var(--ui-color-primary) 8%,transparent)}tbody tr.selected{background:color-mix(in srgb,var(--ui-color-primary) 16%,transparent)}.sort{display:inline-flex;align-items:center;gap:var(--ui-space-1);background:none;border:none;color:inherit;font:inherit;cursor:pointer;padding:0}.sort:focus-visible{outline:none;box-shadow:var(--ui-focus-ring);border-radius:4px}.arrow{width:1em;display:inline-block}.sel{width:1px;white-space:nowrap}.empty{text-align:center;color:var(--ui-color-text-muted);padding:var(--ui-space-6)}\n"] }]
        }], propDecorators: { columns: [{ type: i0.Input, args: [{ isSignal: true, alias: "columns", required: false }] }], data: [{ type: i0.Input, args: [{ isSignal: true, alias: "data", required: false }] }], selectable: [{ type: i0.Input, args: [{ isSignal: true, alias: "selectable", required: false }] }], emptyText: [{ type: i0.Input, args: [{ isSignal: true, alias: "emptyText", required: false }] }], radius: [{ type: i0.Input, args: [{ isSignal: true, alias: "radius", required: false }] }], selectionChange: [{ type: i0.Output, args: ["selectionChange"] }] } });

/**
 * Generated bundle index. Do not edit.
 */

export { UiTable };
//# sourceMappingURL=ui-table.mjs.map
