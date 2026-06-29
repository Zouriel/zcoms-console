import * as i0 from '@angular/core';
import { inject, forwardRef, input, signal, Component, contentChildren } from '@angular/core';

let accSeq = 0;
/** `ui-accordion-item` — a titled, collapsible panel. Use inside `ui-accordion`. */
class UiAccordionItem {
    parent = inject(forwardRef(() => UiAccordion), { optional: true });
    title = input.required(/* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "title" }] : /* istanbul ignore next */ []));
    open = signal(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "open" }] : /* istanbul ignore next */ []));
    seq = accSeq++;
    btnId = `ui-acc-btn-${this.seq}`;
    panelId = `ui-acc-panel-${this.seq}`;
    toggle() {
        if (this.parent)
            this.parent.toggle(this);
        else
            this.open.update((v) => !v);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiAccordionItem, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.1.0", version: "22.0.4", type: UiAccordionItem, isStandalone: true, selector: "ui-accordion-item", inputs: { title: { classPropertyName: "title", publicName: "title", isSignal: true, isRequired: true, transformFunction: null } }, ngImport: i0, template: `
    <div class="item">
      <h3 class="head">
        <button
          type="button"
          class="trigger"
          [id]="btnId"
          [attr.aria-expanded]="open()"
          [attr.aria-controls]="panelId"
          (click)="toggle()">
          <span class="title">{{ title() }}</span>
          <span class="chevron" [class.open]="open()" aria-hidden="true">›</span>
        </button>
      </h3>
      <div class="panel" [class.open]="open()" role="region" [id]="panelId" [attr.aria-labelledby]="btnId">
        <div class="panel-inner"><div class="pad"><ng-content /></div></div>
      </div>
    </div>
  `, isInline: true, styles: [":host{display:block;border-bottom:1px solid var(--ui-color-border)}.head{margin:0}.trigger{display:flex;align-items:center;justify-content:space-between;gap:var(--ui-space-3);width:100%;padding:var(--ui-space-3) var(--ui-space-2);background:none;border:none;cursor:pointer;font-family:var(--ui-font-default);font-size:var(--ui-font-size-md);font-weight:500;color:var(--ui-color-text);text-align:left}.trigger:hover{color:var(--ui-color-text)}.trigger:focus-visible{outline:none;box-shadow:var(--ui-focus-ring);border-radius:6px}.chevron{transition:transform var(--ui-motion-base) var(--ui-ease-standard);color:var(--ui-color-text-muted);transform:rotate(90deg)}.chevron.open{transform:rotate(-90deg)}.panel{display:grid;grid-template-rows:0fr;transition:grid-template-rows var(--ui-motion-base) var(--ui-ease-standard)}.panel.open{grid-template-rows:1fr}.panel-inner{overflow:hidden}.pad{padding:0 var(--ui-space-2) var(--ui-space-3);color:var(--ui-color-text-muted);font-family:var(--ui-font-default)}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiAccordionItem, decorators: [{
            type: Component,
            args: [{ selector: 'ui-accordion-item', template: `
    <div class="item">
      <h3 class="head">
        <button
          type="button"
          class="trigger"
          [id]="btnId"
          [attr.aria-expanded]="open()"
          [attr.aria-controls]="panelId"
          (click)="toggle()">
          <span class="title">{{ title() }}</span>
          <span class="chevron" [class.open]="open()" aria-hidden="true">›</span>
        </button>
      </h3>
      <div class="panel" [class.open]="open()" role="region" [id]="panelId" [attr.aria-labelledby]="btnId">
        <div class="panel-inner"><div class="pad"><ng-content /></div></div>
      </div>
    </div>
  `, styles: [":host{display:block;border-bottom:1px solid var(--ui-color-border)}.head{margin:0}.trigger{display:flex;align-items:center;justify-content:space-between;gap:var(--ui-space-3);width:100%;padding:var(--ui-space-3) var(--ui-space-2);background:none;border:none;cursor:pointer;font-family:var(--ui-font-default);font-size:var(--ui-font-size-md);font-weight:500;color:var(--ui-color-text);text-align:left}.trigger:hover{color:var(--ui-color-text)}.trigger:focus-visible{outline:none;box-shadow:var(--ui-focus-ring);border-radius:6px}.chevron{transition:transform var(--ui-motion-base) var(--ui-ease-standard);color:var(--ui-color-text-muted);transform:rotate(90deg)}.chevron.open{transform:rotate(-90deg)}.panel{display:grid;grid-template-rows:0fr;transition:grid-template-rows var(--ui-motion-base) var(--ui-ease-standard)}.panel.open{grid-template-rows:1fr}.panel-inner{overflow:hidden}.pad{padding:0 var(--ui-space-2) var(--ui-space-3);color:var(--ui-color-text-muted);font-family:var(--ui-font-default)}\n"] }]
        }], propDecorators: { title: [{ type: i0.Input, args: [{ isSignal: true, alias: "title", required: true }] }] } });
/** `ui-accordion` — groups `ui-accordion-item`s. Single-open unless `multiple`. */
class UiAccordion {
    multiple = input(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "multiple" }] : /* istanbul ignore next */ []));
    items = contentChildren(UiAccordionItem, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "items" }] : /* istanbul ignore next */ []));
    toggle(item) {
        const willOpen = !item.open();
        if (willOpen && !this.multiple()) {
            for (const other of this.items())
                if (other !== item)
                    other.open.set(false);
        }
        item.open.set(willOpen);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiAccordion, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.2.0", version: "22.0.4", type: UiAccordion, isStandalone: true, selector: "ui-accordion", inputs: { multiple: { classPropertyName: "multiple", publicName: "multiple", isSignal: true, isRequired: false, transformFunction: null } }, queries: [{ propertyName: "items", predicate: UiAccordionItem, isSignal: true }], ngImport: i0, template: `<div class="ui-accordion"><ng-content /></div>`, isInline: true, styles: [":host{display:block}.ui-accordion{border-top:1px solid var(--ui-color-border)}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiAccordion, decorators: [{
            type: Component,
            args: [{ selector: 'ui-accordion', template: `<div class="ui-accordion"><ng-content /></div>`, styles: [":host{display:block}.ui-accordion{border-top:1px solid var(--ui-color-border)}\n"] }]
        }], propDecorators: { multiple: [{ type: i0.Input, args: [{ isSignal: true, alias: "multiple", required: false }] }], items: [{ type: i0.ContentChildren, args: [i0.forwardRef(() => UiAccordionItem), { isSignal: true }] }] } });

/**
 * Generated bundle index. Do not edit.
 */

export { UiAccordion, UiAccordionItem };
//# sourceMappingURL=ui-accordion.mjs.map
