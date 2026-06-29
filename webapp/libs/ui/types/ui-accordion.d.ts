import * as _angular_core from '@angular/core';

/** `ui-accordion-item` — a titled, collapsible panel. Use inside `ui-accordion`. */
declare class UiAccordionItem {
    private parent;
    title: _angular_core.InputSignal<string>;
    readonly open: _angular_core.WritableSignal<boolean>;
    private readonly seq;
    readonly btnId: string;
    readonly panelId: string;
    protected toggle(): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiAccordionItem, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiAccordionItem, "ui-accordion-item", never, { "title": { "alias": "title"; "required": true; "isSignal": true; }; }, {}, never, ["*"], true, never>;
}
/** `ui-accordion` — groups `ui-accordion-item`s. Single-open unless `multiple`. */
declare class UiAccordion {
    multiple: _angular_core.InputSignal<boolean>;
    readonly items: _angular_core.Signal<readonly UiAccordionItem[]>;
    toggle(item: UiAccordionItem): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiAccordion, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiAccordion, "ui-accordion", never, { "multiple": { "alias": "multiple"; "required": false; "isSignal": true; }; }, {}, ["items"], ["*"], true, never>;
}

export { UiAccordion, UiAccordionItem };
