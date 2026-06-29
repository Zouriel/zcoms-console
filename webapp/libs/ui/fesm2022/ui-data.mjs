import * as i0 from '@angular/core';
import { input, Component, inject, signal, model, output, computed } from '@angular/core';
import { DOCUMENT, NgTemplateOutlet } from '@angular/common';

/** `ui-description-list` — key/value pairs (a semantic `<dl>`). */
class UiDescriptionList {
    items = input([], /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "items" }] : /* istanbul ignore next */ []));
    layout = input('row', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "layout" }] : /* istanbul ignore next */ []));
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiDescriptionList, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "22.0.4", type: UiDescriptionList, isStandalone: true, selector: "ui-description-list", inputs: { items: { classPropertyName: "items", publicName: "items", isSignal: true, isRequired: false, transformFunction: null }, layout: { classPropertyName: "layout", publicName: "layout", isSignal: true, isRequired: false, transformFunction: null } }, ngImport: i0, template: `
    <dl class="ui-dl" [class.row]="layout() === 'row'">
      @for (item of items(); track $index) {
        <div class="pair">
          <dt>{{ item.term }}</dt>
          <dd>{{ item.detail }}</dd>
        </div>
      }
    </dl>
  `, isInline: true, styles: [":host{display:block}.ui-dl{margin:0;display:flex;flex-direction:column;gap:var(--ui-space-2);font-family:var(--ui-font-default)}.pair{display:flex;flex-direction:column;gap:2px}.ui-dl.row .pair{flex-direction:row;gap:var(--ui-space-4)}.ui-dl.row dt{min-width:140px}dt{font-size:var(--ui-font-size-sm);color:var(--ui-color-text-muted);margin:0}dd{margin:0;font-size:var(--ui-font-size-md);color:var(--ui-color-text)}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiDescriptionList, decorators: [{
            type: Component,
            args: [{ selector: 'ui-description-list', template: `
    <dl class="ui-dl" [class.row]="layout() === 'row'">
      @for (item of items(); track $index) {
        <div class="pair">
          <dt>{{ item.term }}</dt>
          <dd>{{ item.detail }}</dd>
        </div>
      }
    </dl>
  `, styles: [":host{display:block}.ui-dl{margin:0;display:flex;flex-direction:column;gap:var(--ui-space-2);font-family:var(--ui-font-default)}.pair{display:flex;flex-direction:column;gap:2px}.ui-dl.row .pair{flex-direction:row;gap:var(--ui-space-4)}.ui-dl.row dt{min-width:140px}dt{font-size:var(--ui-font-size-sm);color:var(--ui-color-text-muted);margin:0}dd{margin:0;font-size:var(--ui-font-size-md);color:var(--ui-color-text)}\n"] }]
        }], propDecorators: { items: [{ type: i0.Input, args: [{ isSignal: true, alias: "items", required: false }] }], layout: [{ type: i0.Input, args: [{ isSignal: true, alias: "layout", required: false }] }] } });

/** `ui-timeline` — vertical sequence of events with connector line. */
class UiTimeline {
    items = input([], /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "items" }] : /* istanbul ignore next */ []));
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiTimeline, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "22.0.4", type: UiTimeline, isStandalone: true, selector: "ui-timeline", inputs: { items: { classPropertyName: "items", publicName: "items", isSignal: true, isRequired: false, transformFunction: null } }, ngImport: i0, template: `
    <ol class="ui-timeline">
      @for (item of items(); track $index) {
        <li class="event">
          <span class="dot" [attr.data-tone]="item.tone || 'primary'" aria-hidden="true"></span>
          <div class="body">
            <div class="row">
              <span class="title">{{ item.title }}</span>
              @if (item.meta) { <span class="meta">{{ item.meta }}</span> }
            </div>
            @if (item.description) { <div class="desc">{{ item.description }}</div> }
          </div>
        </li>
      }
    </ol>
  `, isInline: true, styles: [":host{display:block}.ui-timeline{margin:0;padding:0;list-style:none;font-family:var(--ui-font-default)}.event{position:relative;display:flex;gap:var(--ui-space-3);padding-bottom:var(--ui-space-4)}.event:last-child{padding-bottom:0}.event:before{content:\"\";position:absolute;left:5px;top:14px;bottom:0;width:1px;background:var(--ui-color-border)}.event:last-child:before{display:none}.dot{width:11px;height:11px;border-radius:50%;flex:none;margin-top:3px;background:var(--ui-color-primary);box-shadow:0 0 0 2px var(--ui-color-bg);z-index:1}.dot[data-tone=success]{background:var(--ui-color-success)}.dot[data-tone=warning]{background:var(--ui-color-warning)}.dot[data-tone=danger]{background:var(--ui-color-danger)}.dot[data-tone=neutral]{background:var(--ui-color-secondary)}.row{display:flex;align-items:baseline;gap:var(--ui-space-2)}.title{font-size:var(--ui-font-size-md);color:var(--ui-color-text);font-weight:500}.meta{font-size:12px;color:var(--ui-color-text-muted)}.desc{font-size:var(--ui-font-size-sm);color:var(--ui-color-text-muted);margin-top:2px}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiTimeline, decorators: [{
            type: Component,
            args: [{ selector: 'ui-timeline', template: `
    <ol class="ui-timeline">
      @for (item of items(); track $index) {
        <li class="event">
          <span class="dot" [attr.data-tone]="item.tone || 'primary'" aria-hidden="true"></span>
          <div class="body">
            <div class="row">
              <span class="title">{{ item.title }}</span>
              @if (item.meta) { <span class="meta">{{ item.meta }}</span> }
            </div>
            @if (item.description) { <div class="desc">{{ item.description }}</div> }
          </div>
        </li>
      }
    </ol>
  `, styles: [":host{display:block}.ui-timeline{margin:0;padding:0;list-style:none;font-family:var(--ui-font-default)}.event{position:relative;display:flex;gap:var(--ui-space-3);padding-bottom:var(--ui-space-4)}.event:last-child{padding-bottom:0}.event:before{content:\"\";position:absolute;left:5px;top:14px;bottom:0;width:1px;background:var(--ui-color-border)}.event:last-child:before{display:none}.dot{width:11px;height:11px;border-radius:50%;flex:none;margin-top:3px;background:var(--ui-color-primary);box-shadow:0 0 0 2px var(--ui-color-bg);z-index:1}.dot[data-tone=success]{background:var(--ui-color-success)}.dot[data-tone=warning]{background:var(--ui-color-warning)}.dot[data-tone=danger]{background:var(--ui-color-danger)}.dot[data-tone=neutral]{background:var(--ui-color-secondary)}.row{display:flex;align-items:baseline;gap:var(--ui-space-2)}.title{font-size:var(--ui-font-size-md);color:var(--ui-color-text);font-weight:500}.meta{font-size:12px;color:var(--ui-color-text-muted)}.desc{font-size:var(--ui-font-size-sm);color:var(--ui-color-text-muted);margin-top:2px}\n"] }]
        }], propDecorators: { items: [{ type: i0.Input, args: [{ isSignal: true, alias: "items", required: false }] }] } });

/** `ui-code-block` — monospace code panel with language label and copy button. */
class UiCodeBlock {
    doc = inject(DOCUMENT);
    code = input('', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "code" }] : /* istanbul ignore next */ []));
    language = input('text', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "language" }] : /* istanbul ignore next */ []));
    radius = input(true, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "radius" }] : /* istanbul ignore next */ []));
    copied = signal(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "copied" }] : /* istanbul ignore next */ []));
    async copy() {
        const text = this.code();
        try {
            await this.doc.defaultView?.navigator.clipboard.writeText(text);
        }
        catch {
            /* clipboard unavailable; ignore */
        }
        this.copied.set(true);
        setTimeout(() => this.copied.set(false), 1500);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiCodeBlock, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.1.0", version: "22.0.4", type: UiCodeBlock, isStandalone: true, selector: "ui-code-block", inputs: { code: { classPropertyName: "code", publicName: "code", isSignal: true, isRequired: false, transformFunction: null }, language: { classPropertyName: "language", publicName: "language", isSignal: true, isRequired: false, transformFunction: null }, radius: { classPropertyName: "radius", publicName: "radius", isSignal: true, isRequired: false, transformFunction: null } }, ngImport: i0, template: `
    <div class="cb" [class.no-radius]="!radius()">
      <div class="bar">
        <span class="lang">{{ language() }}</span>
        <button type="button" class="copy" (click)="copy()">{{ copied() ? 'Copied ✓' : 'Copy' }}</button>
      </div>
      <pre class="code"><code>{{ code() }}</code></pre>
    </div>
  `, isInline: true, styles: [":host{display:block}.cb{border:1px solid var(--ui-color-border);border-radius:var(--ui-radius);overflow:hidden;background:var(--ui-color-surface)}.cb.no-radius{border-radius:0}.bar{display:flex;align-items:center;justify-content:space-between;padding:var(--ui-space-1) var(--ui-space-3);background:var(--ui-color-surface-raised);border-bottom:1px solid var(--ui-color-border)}.lang{font-family:var(--ui-font-default);font-size:12px;color:var(--ui-color-text-muted);text-transform:uppercase;letter-spacing:.04em}.copy{border:none;background:transparent;color:var(--ui-color-text-muted);cursor:pointer;font-family:var(--ui-font-default);font-size:12px}.copy:hover{color:var(--ui-color-text)}.copy:focus-visible{outline:none;box-shadow:var(--ui-focus-ring);border-radius:4px}.code{margin:0;padding:var(--ui-space-3);overflow:auto}code{font-family:var(--ui-font-mono);font-size:var(--ui-font-size-sm);color:var(--ui-color-text);white-space:pre}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiCodeBlock, decorators: [{
            type: Component,
            args: [{ selector: 'ui-code-block', template: `
    <div class="cb" [class.no-radius]="!radius()">
      <div class="bar">
        <span class="lang">{{ language() }}</span>
        <button type="button" class="copy" (click)="copy()">{{ copied() ? 'Copied ✓' : 'Copy' }}</button>
      </div>
      <pre class="code"><code>{{ code() }}</code></pre>
    </div>
  `, styles: [":host{display:block}.cb{border:1px solid var(--ui-color-border);border-radius:var(--ui-radius);overflow:hidden;background:var(--ui-color-surface)}.cb.no-radius{border-radius:0}.bar{display:flex;align-items:center;justify-content:space-between;padding:var(--ui-space-1) var(--ui-space-3);background:var(--ui-color-surface-raised);border-bottom:1px solid var(--ui-color-border)}.lang{font-family:var(--ui-font-default);font-size:12px;color:var(--ui-color-text-muted);text-transform:uppercase;letter-spacing:.04em}.copy{border:none;background:transparent;color:var(--ui-color-text-muted);cursor:pointer;font-family:var(--ui-font-default);font-size:12px}.copy:hover{color:var(--ui-color-text)}.copy:focus-visible{outline:none;box-shadow:var(--ui-focus-ring);border-radius:4px}.code{margin:0;padding:var(--ui-space-3);overflow:auto}code{font-family:var(--ui-font-mono);font-size:var(--ui-font-size-sm);color:var(--ui-color-text);white-space:pre}\n"] }]
        }], propDecorators: { code: [{ type: i0.Input, args: [{ isSignal: true, alias: "code", required: false }] }], language: [{ type: i0.Input, args: [{ isSignal: true, alias: "language", required: false }] }], radius: [{ type: i0.Input, args: [{ isSignal: true, alias: "radius", required: false }] }] } });

/** `ui-tree` — expandable hierarchy with selection (recursive, WAI-ARIA tree). */
class UiTree {
    nodes = input([], /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "nodes" }] : /* istanbul ignore next */ []));
    selected = model(null, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "selected" }] : /* istanbul ignore next */ []));
    nodeSelect = output();
    expanded = signal(new Set(), /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "expanded" }] : /* istanbul ignore next */ []));
    toggle(n, e) {
        e.stopPropagation();
        const next = new Set(this.expanded());
        next.has(n.value) ? next.delete(n.value) : next.add(n.value);
        this.expanded.set(next);
    }
    choose(n) {
        this.selected.set(n.value);
        this.nodeSelect.emit(n);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiTree, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "22.0.4", type: UiTree, isStandalone: true, selector: "ui-tree", inputs: { nodes: { classPropertyName: "nodes", publicName: "nodes", isSignal: true, isRequired: false, transformFunction: null }, selected: { classPropertyName: "selected", publicName: "selected", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { selected: "selectedChange", nodeSelect: "nodeSelect" }, ngImport: i0, template: `
    <div class="tree" role="tree">
      @for (n of nodes(); track n.value) {
        <ng-container [ngTemplateOutlet]="node" [ngTemplateOutletContext]="{ $implicit: n, depth: 0 }" />
      }
    </div>
    <ng-template #node let-n let-depth="depth">
      <div class="row" role="treeitem" [attr.aria-expanded]="n.children?.length ? expanded().has(n.value) : null"
           [class.selected]="n.value === selected()" [style.padding-left.px]="8 + depth * 16" (click)="choose(n)">
        @if (n.children?.length) {
          <button type="button" class="chev" [class.open]="expanded().has(n.value)" (click)="toggle(n, $event)" aria-label="Toggle">›</button>
        } @else { <span class="chev spacer"></span> }
        @if (n.icon) { <span class="icon">{{ n.icon }}</span> }
        <span class="label">{{ n.label }}</span>
      </div>
      @if (n.children?.length && expanded().has(n.value)) {
        @for (c of n.children; track c.value) {
          <ng-container [ngTemplateOutlet]="node" [ngTemplateOutletContext]="{ $implicit: c, depth: depth + 1 }" />
        }
      }
    </ng-template>
  `, isInline: true, styles: [":host{display:block}.tree{font-family:var(--ui-font-default)}.row{display:flex;align-items:center;gap:var(--ui-space-1);padding:var(--ui-space-1) var(--ui-space-2);cursor:pointer;border-radius:6px;color:var(--ui-color-text);font-size:var(--ui-font-size-md)}.row:hover{background:var(--ui-color-surface-raised)}.row.selected{background:color-mix(in srgb,var(--ui-color-primary) 18%,transparent)}.chev{width:18px;height:18px;flex:none;border:none;background:none;color:var(--ui-color-text-muted);cursor:pointer;transition:transform var(--ui-motion-fast) var(--ui-ease-standard);transform:rotate(0)}.chev.open{transform:rotate(90deg)}.chev.spacer{cursor:default}.icon{font-size:14px}.label{flex:1}\n"], dependencies: [{ kind: "directive", type: NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiTree, decorators: [{
            type: Component,
            args: [{ selector: 'ui-tree', imports: [NgTemplateOutlet], template: `
    <div class="tree" role="tree">
      @for (n of nodes(); track n.value) {
        <ng-container [ngTemplateOutlet]="node" [ngTemplateOutletContext]="{ $implicit: n, depth: 0 }" />
      }
    </div>
    <ng-template #node let-n let-depth="depth">
      <div class="row" role="treeitem" [attr.aria-expanded]="n.children?.length ? expanded().has(n.value) : null"
           [class.selected]="n.value === selected()" [style.padding-left.px]="8 + depth * 16" (click)="choose(n)">
        @if (n.children?.length) {
          <button type="button" class="chev" [class.open]="expanded().has(n.value)" (click)="toggle(n, $event)" aria-label="Toggle">›</button>
        } @else { <span class="chev spacer"></span> }
        @if (n.icon) { <span class="icon">{{ n.icon }}</span> }
        <span class="label">{{ n.label }}</span>
      </div>
      @if (n.children?.length && expanded().has(n.value)) {
        @for (c of n.children; track c.value) {
          <ng-container [ngTemplateOutlet]="node" [ngTemplateOutletContext]="{ $implicit: c, depth: depth + 1 }" />
        }
      }
    </ng-template>
  `, styles: [":host{display:block}.tree{font-family:var(--ui-font-default)}.row{display:flex;align-items:center;gap:var(--ui-space-1);padding:var(--ui-space-1) var(--ui-space-2);cursor:pointer;border-radius:6px;color:var(--ui-color-text);font-size:var(--ui-font-size-md)}.row:hover{background:var(--ui-color-surface-raised)}.row.selected{background:color-mix(in srgb,var(--ui-color-primary) 18%,transparent)}.chev{width:18px;height:18px;flex:none;border:none;background:none;color:var(--ui-color-text-muted);cursor:pointer;transition:transform var(--ui-motion-fast) var(--ui-ease-standard);transform:rotate(0)}.chev.open{transform:rotate(90deg)}.chev.spacer{cursor:default}.icon{font-size:14px}.label{flex:1}\n"] }]
        }], propDecorators: { nodes: [{ type: i0.Input, args: [{ isSignal: true, alias: "nodes", required: false }] }], selected: [{ type: i0.Input, args: [{ isSignal: true, alias: "selected", required: false }] }, { type: i0.Output, args: ["selectedChange"] }], nodeSelect: [{ type: i0.Output, args: ["nodeSelect"] }] } });

/** `ui-tree-table` — hierarchical table; the first column is an expandable tree. */
class UiTreeTable {
    rows = input([], /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "rows" }] : /* istanbul ignore next */ []));
    columns = input([], /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "columns" }] : /* istanbul ignore next */ []));
    firstHeader = input('Name', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "firstHeader" }] : /* istanbul ignore next */ []));
    expanded = signal(new Set(), /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "expanded" }] : /* istanbul ignore next */ []));
    visible = computed(() => {
        const out = [];
        const walk = (rows, depth) => {
            for (const row of rows) {
                out.push({ row, depth });
                if (row.children?.length && this.expanded().has(row.value))
                    walk(row.children, depth + 1);
            }
        };
        walk(this.rows(), 0);
        return out;
    }, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "visible" }] : /* istanbul ignore next */ []));
    toggle(row) {
        const next = new Set(this.expanded());
        next.has(row.value) ? next.delete(row.value) : next.add(row.value);
        this.expanded.set(next);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiTreeTable, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "22.0.4", type: UiTreeTable, isStandalone: true, selector: "ui-tree-table", inputs: { rows: { classPropertyName: "rows", publicName: "rows", isSignal: true, isRequired: false, transformFunction: null }, columns: { classPropertyName: "columns", publicName: "columns", isSignal: true, isRequired: false, transformFunction: null }, firstHeader: { classPropertyName: "firstHeader", publicName: "firstHeader", isSignal: true, isRequired: false, transformFunction: null } }, ngImport: i0, template: `
    <div class="wrap">
      <table class="tt">
        <thead>
          <tr>
            <th scope="col">{{ firstHeader() }}</th>
            @for (col of columns(); track col.key) { <th scope="col" [attr.data-align]="col.align || 'left'">{{ col.header }}</th> }
          </tr>
        </thead>
        <tbody>
          @for (f of visible(); track f.row.value) {
            <tr>
              <td [style.padding-left.px]="12 + f.depth * 18">
                @if (f.row.children?.length) {
                  <button type="button" class="chev" [class.open]="expanded().has(f.row.value)" (click)="toggle(f.row)" aria-label="Toggle">›</button>
                } @else { <span class="chev spacer"></span> }
                {{ f.row.label }}
              </td>
              @for (col of columns(); track col.key) { <td [attr.data-align]="col.align || 'left'">{{ f.row.data?.[col.key] }}</td> }
            </tr>
          }
        </tbody>
      </table>
    </div>
  `, isInline: true, styles: [":host{display:block}.wrap{border:1px solid var(--ui-color-border);border-radius:var(--ui-radius);overflow:auto}.tt{width:100%;border-collapse:collapse;font-family:var(--ui-font-default);font-size:var(--ui-font-size-md);color:var(--ui-color-text)}th,td{padding:var(--ui-space-2) var(--ui-space-4);text-align:left}th[data-align=right],td[data-align=right]{text-align:right}thead th{background:var(--ui-color-surface-raised);border-bottom:1px solid var(--ui-color-border);font-weight:600;font-size:var(--ui-font-size-sm);color:var(--ui-color-text-muted)}tbody tr{border-bottom:1px solid var(--ui-color-border)}tbody tr:last-child{border-bottom:none}tbody tr:hover{background:color-mix(in srgb,var(--ui-color-primary) 8%,transparent)}.chev{width:16px;height:16px;border:none;background:none;color:var(--ui-color-text-muted);cursor:pointer;transition:transform var(--ui-motion-fast) var(--ui-ease-standard)}.chev.open{transform:rotate(90deg)}.chev.spacer{cursor:default;display:inline-block}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiTreeTable, decorators: [{
            type: Component,
            args: [{ selector: 'ui-tree-table', template: `
    <div class="wrap">
      <table class="tt">
        <thead>
          <tr>
            <th scope="col">{{ firstHeader() }}</th>
            @for (col of columns(); track col.key) { <th scope="col" [attr.data-align]="col.align || 'left'">{{ col.header }}</th> }
          </tr>
        </thead>
        <tbody>
          @for (f of visible(); track f.row.value) {
            <tr>
              <td [style.padding-left.px]="12 + f.depth * 18">
                @if (f.row.children?.length) {
                  <button type="button" class="chev" [class.open]="expanded().has(f.row.value)" (click)="toggle(f.row)" aria-label="Toggle">›</button>
                } @else { <span class="chev spacer"></span> }
                {{ f.row.label }}
              </td>
              @for (col of columns(); track col.key) { <td [attr.data-align]="col.align || 'left'">{{ f.row.data?.[col.key] }}</td> }
            </tr>
          }
        </tbody>
      </table>
    </div>
  `, styles: [":host{display:block}.wrap{border:1px solid var(--ui-color-border);border-radius:var(--ui-radius);overflow:auto}.tt{width:100%;border-collapse:collapse;font-family:var(--ui-font-default);font-size:var(--ui-font-size-md);color:var(--ui-color-text)}th,td{padding:var(--ui-space-2) var(--ui-space-4);text-align:left}th[data-align=right],td[data-align=right]{text-align:right}thead th{background:var(--ui-color-surface-raised);border-bottom:1px solid var(--ui-color-border);font-weight:600;font-size:var(--ui-font-size-sm);color:var(--ui-color-text-muted)}tbody tr{border-bottom:1px solid var(--ui-color-border)}tbody tr:last-child{border-bottom:none}tbody tr:hover{background:color-mix(in srgb,var(--ui-color-primary) 8%,transparent)}.chev{width:16px;height:16px;border:none;background:none;color:var(--ui-color-text-muted);cursor:pointer;transition:transform var(--ui-motion-fast) var(--ui-ease-standard)}.chev.open{transform:rotate(90deg)}.chev.spacer{cursor:default;display:inline-block}\n"] }]
        }], propDecorators: { rows: [{ type: i0.Input, args: [{ isSignal: true, alias: "rows", required: false }] }], columns: [{ type: i0.Input, args: [{ isSignal: true, alias: "columns", required: false }] }], firstHeader: [{ type: i0.Input, args: [{ isSignal: true, alias: "firstHeader", required: false }] }] } });

/**
 * Generated bundle index. Do not edit.
 */

export { UiCodeBlock, UiDescriptionList, UiTimeline, UiTree, UiTreeTable };
//# sourceMappingURL=ui-data.mjs.map
