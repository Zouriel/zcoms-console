import * as i0 from '@angular/core';
import { input, signal, Component, inject, ElementRef, model, contentChildren, effect } from '@angular/core';

let tabSeq = 0;
/**
 * `ui-tab` — a single tab + its panel. Provide a `label` and project the panel
 * content. Inactive panels stay in the DOM but are hidden (`[hidden]`).
 */
class UiTab {
    label = input.required(/* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "label" }] : /* istanbul ignore next */ []));
    disabled = input(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "disabled" }] : /* istanbul ignore next */ []));
    active = signal(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "active" }] : /* istanbul ignore next */ []));
    tabId = `ui-tab-${tabSeq}`;
    panelId = `ui-tabpanel-${tabSeq++}`;
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiTab, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.1.0", version: "22.0.4", type: UiTab, isStandalone: true, selector: "ui-tab", inputs: { label: { classPropertyName: "label", publicName: "label", isSignal: true, isRequired: true, transformFunction: null }, disabled: { classPropertyName: "disabled", publicName: "disabled", isSignal: true, isRequired: false, transformFunction: null } }, ngImport: i0, template: `
    <div
      role="tabpanel"
      [id]="panelId"
      [attr.aria-labelledby]="tabId"
      [hidden]="!active()"
      tabindex="0">
      <ng-content />
    </div>
  `, isInline: true, styles: [":host{display:block}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiTab, decorators: [{
            type: Component,
            args: [{ selector: 'ui-tab', template: `
    <div
      role="tabpanel"
      [id]="panelId"
      [attr.aria-labelledby]="tabId"
      [hidden]="!active()"
      tabindex="0">
      <ng-content />
    </div>
  `, styles: [":host{display:block}\n"] }]
        }], propDecorators: { label: [{ type: i0.Input, args: [{ isSignal: true, alias: "label", required: true }] }], disabled: [{ type: i0.Input, args: [{ isSignal: true, alias: "disabled", required: false }] }] } });
/**
 * `ui-tabs` — WAI-ARIA tabs. Wraps `ui-tab` children; renders a tablist with
 * roving tabindex and Arrow/Home/End keyboard navigation.
 */
class UiTabs {
    host = inject(ElementRef);
    selectedIndex = model(0, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "selectedIndex" }] : /* istanbul ignore next */ []));
    label = input('Tabs', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "label" }] : /* istanbul ignore next */ []));
    tabs = contentChildren(UiTab, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "tabs" }] : /* istanbul ignore next */ []));
    constructor() {
        effect(() => {
            const tabs = this.tabs();
            const sel = this.selectedIndex();
            tabs.forEach((t, i) => t.active.set(i === sel));
        });
    }
    select(i) {
        if (this.tabs()[i]?.disabled())
            return;
        this.selectedIndex.set(i);
    }
    onKeydown(e, i) {
        const count = this.tabs().length;
        let next = i;
        if (e.key === 'ArrowRight')
            next = (i + 1) % count;
        else if (e.key === 'ArrowLeft')
            next = (i - 1 + count) % count;
        else if (e.key === 'Home')
            next = 0;
        else if (e.key === 'End')
            next = count - 1;
        else
            return;
        e.preventDefault();
        this.select(next);
        const buttons = this.host.nativeElement.querySelectorAll('.tab');
        buttons[next]?.focus();
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiTabs, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "22.0.4", type: UiTabs, isStandalone: true, selector: "ui-tabs", inputs: { selectedIndex: { classPropertyName: "selectedIndex", publicName: "selectedIndex", isSignal: true, isRequired: false, transformFunction: null }, label: { classPropertyName: "label", publicName: "label", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { selectedIndex: "selectedIndexChange" }, queries: [{ propertyName: "tabs", predicate: UiTab, isSignal: true }], ngImport: i0, template: `
    <div class="tablist" role="tablist" [attr.aria-label]="label()">
      @for (tab of tabs(); track tab.tabId; let i = $index) {
        <button
          type="button"
          role="tab"
          class="tab"
          [id]="tab.tabId"
          [attr.aria-controls]="tab.panelId"
          [attr.aria-selected]="selectedIndex() === i"
          [attr.tabindex]="selectedIndex() === i ? 0 : -1"
          [disabled]="tab.disabled()"
          (click)="select(i)"
          (keydown)="onKeydown($event, i)">
          {{ tab.label() }}
        </button>
      }
    </div>
    <ng-content />
  `, isInline: true, styles: [":host{display:block}.tablist{display:flex;gap:var(--ui-space-1);border-bottom:1px solid var(--ui-color-border);margin-bottom:var(--ui-space-4)}.tab{position:relative;appearance:none;border:none;background:transparent;padding:var(--ui-space-2) var(--ui-space-3);margin-bottom:-1px;color:var(--ui-color-text-muted);font-family:var(--ui-font-default);font-size:var(--ui-font-size-md);cursor:pointer;border-bottom:2px solid transparent;transition:color var(--ui-motion-base) var(--ui-ease-standard),border-color var(--ui-motion-base) var(--ui-ease-standard)}.tab:hover:not(:disabled){color:var(--ui-color-text)}.tab[aria-selected=true]{color:var(--ui-color-text);border-bottom-color:var(--ui-color-primary)}.tab:focus-visible{outline:none;box-shadow:var(--ui-focus-ring);border-radius:6px}.tab:disabled{opacity:.5;cursor:not-allowed}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiTabs, decorators: [{
            type: Component,
            args: [{ selector: 'ui-tabs', template: `
    <div class="tablist" role="tablist" [attr.aria-label]="label()">
      @for (tab of tabs(); track tab.tabId; let i = $index) {
        <button
          type="button"
          role="tab"
          class="tab"
          [id]="tab.tabId"
          [attr.aria-controls]="tab.panelId"
          [attr.aria-selected]="selectedIndex() === i"
          [attr.tabindex]="selectedIndex() === i ? 0 : -1"
          [disabled]="tab.disabled()"
          (click)="select(i)"
          (keydown)="onKeydown($event, i)">
          {{ tab.label() }}
        </button>
      }
    </div>
    <ng-content />
  `, styles: [":host{display:block}.tablist{display:flex;gap:var(--ui-space-1);border-bottom:1px solid var(--ui-color-border);margin-bottom:var(--ui-space-4)}.tab{position:relative;appearance:none;border:none;background:transparent;padding:var(--ui-space-2) var(--ui-space-3);margin-bottom:-1px;color:var(--ui-color-text-muted);font-family:var(--ui-font-default);font-size:var(--ui-font-size-md);cursor:pointer;border-bottom:2px solid transparent;transition:color var(--ui-motion-base) var(--ui-ease-standard),border-color var(--ui-motion-base) var(--ui-ease-standard)}.tab:hover:not(:disabled){color:var(--ui-color-text)}.tab[aria-selected=true]{color:var(--ui-color-text);border-bottom-color:var(--ui-color-primary)}.tab:focus-visible{outline:none;box-shadow:var(--ui-focus-ring);border-radius:6px}.tab:disabled{opacity:.5;cursor:not-allowed}\n"] }]
        }], ctorParameters: () => [], propDecorators: { selectedIndex: [{ type: i0.Input, args: [{ isSignal: true, alias: "selectedIndex", required: false }] }, { type: i0.Output, args: ["selectedIndexChange"] }], label: [{ type: i0.Input, args: [{ isSignal: true, alias: "label", required: false }] }], tabs: [{ type: i0.ContentChildren, args: [i0.forwardRef(() => UiTab), { isSignal: true }] }] } });

/**
 * Generated bundle index. Do not edit.
 */

export { UiTab, UiTabs };
//# sourceMappingURL=ui-tabs.mjs.map
