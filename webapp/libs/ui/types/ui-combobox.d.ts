import * as _angular_core from '@angular/core';
import { ConnectedPosition } from '@angular/cdk/overlay';
import { ControlValueAccessor } from '@angular/forms';
import { UiSize } from 'ui';

interface UiComboboxOption {
    label: string;
    value: string;
}
/**
 * `ui-combobox` — filterable autocomplete (CVA). Type to filter; Arrow keys +
 * Enter to choose; Escape to close. Backed by the CDK Overlay (WAI-ARIA combobox).
 */
declare class UiCombobox implements ControlValueAccessor {
    private config;
    options: _angular_core.InputSignal<UiComboboxOption[]>;
    placeholder: _angular_core.InputSignal<string>;
    size: _angular_core.InputSignal<UiSize>;
    radius: _angular_core.InputSignal<boolean>;
    protected readonly query: _angular_core.WritableSignal<string>;
    protected readonly value: _angular_core.WritableSignal<string | null>;
    protected readonly open: _angular_core.WritableSignal<boolean>;
    protected readonly activeIndex: _angular_core.WritableSignal<number>;
    protected readonly disabled: _angular_core.WritableSignal<boolean>;
    protected readonly triggerWidth: _angular_core.WritableSignal<string | number>;
    protected readonly positions: ConnectedPosition[];
    protected readonly filtered: _angular_core.Signal<UiComboboxOption[]>;
    private onChange;
    protected onTouched: () => void;
    writeValue(v: string | null): void;
    registerOnChange(fn: (v: string | null) => void): void;
    registerOnTouched(fn: () => void): void;
    setDisabledState(d: boolean): void;
    protected onInput(e: Event): void;
    protected onKeydown(e: KeyboardEvent): void;
    protected select(opt: UiComboboxOption): void;
    protected onBlur(): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiCombobox, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiCombobox, "ui-combobox", never, { "options": { "alias": "options"; "required": false; "isSignal": true; }; "placeholder": { "alias": "placeholder"; "required": false; "isSignal": true; }; "size": { "alias": "size"; "required": false; "isSignal": true; }; "radius": { "alias": "radius"; "required": false; "isSignal": true; }; }, {}, never, never, true, never>;
}

/** `ui-multi-select` — choose several options; selections shown as chips (CVA; value is string[]). */
declare class UiMultiSelect implements ControlValueAccessor {
    private config;
    options: _angular_core.InputSignal<UiComboboxOption[]>;
    placeholder: _angular_core.InputSignal<string>;
    radius: _angular_core.InputSignal<boolean>;
    protected readonly value: _angular_core.WritableSignal<string[]>;
    protected readonly query: _angular_core.WritableSignal<string>;
    protected readonly open: _angular_core.WritableSignal<boolean>;
    protected readonly disabled: _angular_core.WritableSignal<boolean>;
    protected readonly width: _angular_core.WritableSignal<string | number>;
    protected readonly positions: ConnectedPosition[];
    protected readonly filtered: _angular_core.Signal<UiComboboxOption[]>;
    private onChange;
    protected onTouched: () => void;
    writeValue(v: string[]): void;
    registerOnChange(fn: (v: string[]) => void): void;
    registerOnTouched(fn: () => void): void;
    setDisabledState(d: boolean): void;
    protected labelOf(v: string): string;
    protected onInput(e: Event): void;
    protected toggle(v: string, e?: Event): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiMultiSelect, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiMultiSelect, "ui-multi-select", never, { "options": { "alias": "options"; "required": false; "isSignal": true; }; "placeholder": { "alias": "placeholder"; "required": false; "isSignal": true; }; "radius": { "alias": "radius"; "required": false; "isSignal": true; }; }, {}, never, never, true, never>;
}

export { UiCombobox, UiMultiSelect };
export type { UiComboboxOption };
