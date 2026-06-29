import { NgTemplateOutlet } from '@angular/common';
import * as i0 from '@angular/core';
import { input, Component, output } from '@angular/core';

/** `ui-list` — semantic list container. Project `ui-list-item` children. */
class UiList {
    bordered = input(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "bordered" }] : /* istanbul ignore next */ []));
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiList, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.1.0", version: "22.0.4", type: UiList, isStandalone: true, selector: "ui-list", inputs: { bordered: { classPropertyName: "bordered", publicName: "bordered", isSignal: true, isRequired: false, transformFunction: null } }, ngImport: i0, template: `<div class="ui-list" [class.bordered]="bordered()" role="list"><ng-content /></div>`, isInline: true, styles: [":host{display:block}.ui-list{display:flex;flex-direction:column;font-family:var(--ui-font-default)}.ui-list.bordered{border:1px solid var(--ui-color-border);border-radius:var(--ui-radius);overflow:hidden}.ui-list.bordered ::ng-deep ui-list-item:not(:last-child) .ui-list-item{border-bottom:1px solid var(--ui-color-border)}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiList, decorators: [{
            type: Component,
            args: [{ selector: 'ui-list', template: `<div class="ui-list" [class.bordered]="bordered()" role="list"><ng-content /></div>`, styles: [":host{display:block}.ui-list{display:flex;flex-direction:column;font-family:var(--ui-font-default)}.ui-list.bordered{border:1px solid var(--ui-color-border);border-radius:var(--ui-radius);overflow:hidden}.ui-list.bordered ::ng-deep ui-list-item:not(:last-child) .ui-list-item{border-bottom:1px solid var(--ui-color-border)}\n"] }]
        }], propDecorators: { bordered: [{ type: i0.Input, args: [{ isSignal: true, alias: "bordered", required: false }] }] } });
/** `ui-list-item` — a row in `ui-list`. Optional `[item-leading]` / `[item-trailing]` slots. */
class UiListItem {
    interactive = input(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "interactive" }] : /* istanbul ignore next */ []));
    selected = input(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "selected" }] : /* istanbul ignore next */ []));
    disabled = input(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "disabled" }] : /* istanbul ignore next */ []));
    activate = output();
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiListItem, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "22.0.4", type: UiListItem, isStandalone: true, selector: "ui-list-item", inputs: { interactive: { classPropertyName: "interactive", publicName: "interactive", isSignal: true, isRequired: false, transformFunction: null }, selected: { classPropertyName: "selected", publicName: "selected", isSignal: true, isRequired: false, transformFunction: null }, disabled: { classPropertyName: "disabled", publicName: "disabled", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { activate: "activate" }, ngImport: i0, template: `
    @if (interactive()) {
      <button
        type="button"
        class="ui-list-item interactive"
        role="listitem"
        [class.selected]="selected()"
        [disabled]="disabled()"
        (click)="activate.emit()">
        <ng-container [ngTemplateOutlet]="body" />
      </button>
    } @else {
      <div class="ui-list-item" role="listitem">
        <ng-container [ngTemplateOutlet]="body" />
      </div>
    }
    <!-- Single set of projection slots, stamped into whichever wrapper is active. -->
    <ng-template #body>
      <span class="lead"><ng-content select="[item-leading]" /></span>
      <span class="main"><ng-content /></span>
      <span class="trail"><ng-content select="[item-trailing]" /></span>
    </ng-template>
  `, isInline: true, styles: [":host{display:block}.ui-list-item{display:flex;align-items:center;gap:var(--ui-space-3);width:100%;padding:var(--ui-space-2) var(--ui-space-4);box-sizing:border-box;color:var(--ui-color-text);font-family:var(--ui-font-default);font-size:var(--ui-font-size-md);text-align:left;background:transparent}.ui-list-item.interactive{border:none;cursor:pointer;transition:background var(--ui-motion-fast) var(--ui-ease-standard)}.ui-list-item.interactive:hover:not(:disabled){background:color-mix(in srgb,var(--ui-color-primary) 12%,transparent)}.ui-list-item.interactive:focus-visible{outline:none;box-shadow:var(--ui-focus-ring)}.ui-list-item.selected{background:color-mix(in srgb,var(--ui-color-primary) 20%,transparent)}.ui-list-item:disabled{opacity:.5;cursor:not-allowed}.lead:empty,.trail:empty{display:none}.main{flex:1;min-width:0}.trail{color:var(--ui-color-text-muted)}\n"], dependencies: [{ kind: "directive", type: NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiListItem, decorators: [{
            type: Component,
            args: [{ selector: 'ui-list-item', imports: [NgTemplateOutlet], template: `
    @if (interactive()) {
      <button
        type="button"
        class="ui-list-item interactive"
        role="listitem"
        [class.selected]="selected()"
        [disabled]="disabled()"
        (click)="activate.emit()">
        <ng-container [ngTemplateOutlet]="body" />
      </button>
    } @else {
      <div class="ui-list-item" role="listitem">
        <ng-container [ngTemplateOutlet]="body" />
      </div>
    }
    <!-- Single set of projection slots, stamped into whichever wrapper is active. -->
    <ng-template #body>
      <span class="lead"><ng-content select="[item-leading]" /></span>
      <span class="main"><ng-content /></span>
      <span class="trail"><ng-content select="[item-trailing]" /></span>
    </ng-template>
  `, styles: [":host{display:block}.ui-list-item{display:flex;align-items:center;gap:var(--ui-space-3);width:100%;padding:var(--ui-space-2) var(--ui-space-4);box-sizing:border-box;color:var(--ui-color-text);font-family:var(--ui-font-default);font-size:var(--ui-font-size-md);text-align:left;background:transparent}.ui-list-item.interactive{border:none;cursor:pointer;transition:background var(--ui-motion-fast) var(--ui-ease-standard)}.ui-list-item.interactive:hover:not(:disabled){background:color-mix(in srgb,var(--ui-color-primary) 12%,transparent)}.ui-list-item.interactive:focus-visible{outline:none;box-shadow:var(--ui-focus-ring)}.ui-list-item.selected{background:color-mix(in srgb,var(--ui-color-primary) 20%,transparent)}.ui-list-item:disabled{opacity:.5;cursor:not-allowed}.lead:empty,.trail:empty{display:none}.main{flex:1;min-width:0}.trail{color:var(--ui-color-text-muted)}\n"] }]
        }], propDecorators: { interactive: [{ type: i0.Input, args: [{ isSignal: true, alias: "interactive", required: false }] }], selected: [{ type: i0.Input, args: [{ isSignal: true, alias: "selected", required: false }] }], disabled: [{ type: i0.Input, args: [{ isSignal: true, alias: "disabled", required: false }] }], activate: [{ type: i0.Output, args: ["activate"] }] } });

/**
 * Generated bundle index. Do not edit.
 */

export { UiList, UiListItem };
//# sourceMappingURL=ui-list.mjs.map
