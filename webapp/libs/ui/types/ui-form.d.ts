import * as _angular_core from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { UiSize } from 'ui';

/**
 * `ui-form-field` — label + hint + error wrapper for any control. The projected
 * control is wrapped by a `<label>`, giving implicit accessible-name
 * association without manual id wiring.
 */
declare class UiFormField {
    label: _angular_core.InputSignal<string | undefined>;
    hint: _angular_core.InputSignal<string | undefined>;
    error: _angular_core.InputSignal<string | undefined>;
    required: _angular_core.InputSignal<boolean>;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiFormField, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiFormField, "ui-form-field", never, { "label": { "alias": "label"; "required": false; "isSignal": true; }; "hint": { "alias": "hint"; "required": false; "isSignal": true; }; "error": { "alias": "error"; "required": false; "isSignal": true; }; "required": { "alias": "required"; "required": false; "isSignal": true; }; }, {}, never, ["*"], true, never>;
}

/**
 * `ui-input` — single-line text field. Implements ControlValueAccessor so it
 * works with template-driven, reactive, and Signal Forms.
 */
declare class UiInput implements ControlValueAccessor {
    private config;
    type: _angular_core.InputSignal<"text" | "email" | "url" | "tel" | "password" | "search">;
    placeholder: _angular_core.InputSignal<string>;
    inputmode: _angular_core.InputSignal<string | undefined>;
    size: _angular_core.InputSignal<UiSize>;
    invalid: _angular_core.InputSignal<boolean>;
    radius: _angular_core.InputSignal<boolean>;
    protected readonly value: _angular_core.WritableSignal<string>;
    protected readonly disabled: _angular_core.WritableSignal<boolean>;
    private onChange;
    protected onTouched: () => void;
    writeValue(v: string): void;
    registerOnChange(fn: (v: string) => void): void;
    registerOnTouched(fn: () => void): void;
    setDisabledState(d: boolean): void;
    protected handleInput(e: Event): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiInput, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiInput, "ui-input", never, { "type": { "alias": "type"; "required": false; "isSignal": true; }; "placeholder": { "alias": "placeholder"; "required": false; "isSignal": true; }; "inputmode": { "alias": "inputmode"; "required": false; "isSignal": true; }; "size": { "alias": "size"; "required": false; "isSignal": true; }; "invalid": { "alias": "invalid"; "required": false; "isSignal": true; }; "radius": { "alias": "radius"; "required": false; "isSignal": true; }; }, {}, never, never, true, never>;
}

/** `ui-textarea` — multi-line text field (CVA). */
declare class UiTextarea implements ControlValueAccessor {
    private config;
    placeholder: _angular_core.InputSignal<string>;
    rows: _angular_core.InputSignal<number>;
    invalid: _angular_core.InputSignal<boolean>;
    radius: _angular_core.InputSignal<boolean>;
    protected readonly value: _angular_core.WritableSignal<string>;
    protected readonly disabled: _angular_core.WritableSignal<boolean>;
    private onChange;
    protected onTouched: () => void;
    writeValue(v: string): void;
    registerOnChange(fn: (v: string) => void): void;
    registerOnTouched(fn: () => void): void;
    setDisabledState(d: boolean): void;
    protected handleInput(e: Event): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiTextarea, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiTextarea, "ui-textarea", never, { "placeholder": { "alias": "placeholder"; "required": false; "isSignal": true; }; "rows": { "alias": "rows"; "required": false; "isSignal": true; }; "invalid": { "alias": "invalid"; "required": false; "isSignal": true; }; "radius": { "alias": "radius"; "required": false; "isSignal": true; }; }, {}, never, never, true, never>;
}

/** `ui-checkbox` — boolean control (CVA) built on a native checkbox for a11y. */
declare class UiCheckbox implements ControlValueAccessor {
    invalid: _angular_core.InputSignal<boolean>;
    protected readonly checked: _angular_core.WritableSignal<boolean>;
    protected readonly disabled: _angular_core.WritableSignal<boolean>;
    private onChange;
    protected onTouched: () => void;
    writeValue(v: boolean): void;
    registerOnChange(fn: (v: boolean) => void): void;
    registerOnTouched(fn: () => void): void;
    setDisabledState(d: boolean): void;
    protected toggle(e: Event): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiCheckbox, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiCheckbox, "ui-checkbox", never, { "invalid": { "alias": "invalid"; "required": false; "isSignal": true; }; }, {}, never, ["*"], true, never>;
}

/** `ui-switch` — on/off toggle (CVA). Uses role="switch" on a native checkbox. */
declare class UiSwitch implements ControlValueAccessor {
    protected readonly checked: _angular_core.WritableSignal<boolean>;
    protected readonly disabled: _angular_core.WritableSignal<boolean>;
    private onChange;
    protected onTouched: () => void;
    writeValue(v: boolean): void;
    registerOnChange(fn: (v: boolean) => void): void;
    registerOnTouched(fn: () => void): void;
    setDisabledState(d: boolean): void;
    protected toggle(e: Event): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiSwitch, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiSwitch, "ui-switch", never, {}, {}, never, ["*"], true, never>;
}

interface UiRadioOption {
    label: string;
    value: string;
    disabled?: boolean;
}
/**
 * `ui-radio-group` — single-choice control (CVA). Built on native radio inputs
 * so keyboard interaction and group semantics are handled by the platform.
 */
declare class UiRadioGroup implements ControlValueAccessor {
    options: _angular_core.InputSignal<UiRadioOption[]>;
    label: _angular_core.InputSignal<string | undefined>;
    orientation: _angular_core.InputSignal<"vertical" | "horizontal">;
    protected readonly name: string;
    protected readonly value: _angular_core.WritableSignal<string | null>;
    protected readonly disabled: _angular_core.WritableSignal<boolean>;
    private onChange;
    protected onTouched: () => void;
    writeValue(v: string | null): void;
    registerOnChange(fn: (v: string | null) => void): void;
    registerOnTouched(fn: () => void): void;
    setDisabledState(d: boolean): void;
    protected select(v: string): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiRadioGroup, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiRadioGroup, "ui-radio-group", never, { "options": { "alias": "options"; "required": false; "isSignal": true; }; "label": { "alias": "label"; "required": false; "isSignal": true; }; "orientation": { "alias": "orientation"; "required": false; "isSignal": true; }; }, {}, never, never, true, never>;
}

interface UiSelectOption {
    label: string;
    value: string;
    disabled?: boolean;
}
/**
 * `ui-select` — single-choice dropdown (CVA) built on a native `<select>` for
 * full keyboard/screen-reader support. For rich filtering use combobox instead.
 */
declare class UiSelect implements ControlValueAccessor {
    private config;
    options: _angular_core.InputSignal<UiSelectOption[]>;
    placeholder: _angular_core.InputSignal<string | undefined>;
    label: _angular_core.InputSignal<string | undefined>;
    size: _angular_core.InputSignal<UiSize>;
    invalid: _angular_core.InputSignal<boolean>;
    radius: _angular_core.InputSignal<boolean>;
    protected readonly value: _angular_core.WritableSignal<string>;
    protected readonly disabled: _angular_core.WritableSignal<boolean>;
    private onChange;
    protected onTouched: () => void;
    writeValue(v: string): void;
    registerOnChange(fn: (v: string) => void): void;
    registerOnTouched(fn: () => void): void;
    setDisabledState(d: boolean): void;
    protected handleChange(e: Event): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiSelect, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiSelect, "ui-select", never, { "options": { "alias": "options"; "required": false; "isSignal": true; }; "placeholder": { "alias": "placeholder"; "required": false; "isSignal": true; }; "label": { "alias": "label"; "required": false; "isSignal": true; }; "size": { "alias": "size"; "required": false; "isSignal": true; }; "invalid": { "alias": "invalid"; "required": false; "isSignal": true; }; "radius": { "alias": "radius"; "required": false; "isSignal": true; }; }, {}, never, never, true, never>;
}

/** `ui-number-input` — numeric field with stepper buttons (CVA). */
declare class UiNumberInput implements ControlValueAccessor {
    private config;
    min: _angular_core.InputSignal<number | undefined>;
    max: _angular_core.InputSignal<number | undefined>;
    step: _angular_core.InputSignal<number>;
    placeholder: _angular_core.InputSignal<string>;
    size: _angular_core.InputSignal<UiSize>;
    invalid: _angular_core.InputSignal<boolean>;
    radius: _angular_core.InputSignal<boolean>;
    protected readonly value: _angular_core.WritableSignal<number | null>;
    protected readonly disabled: _angular_core.WritableSignal<boolean>;
    private onChange;
    protected onTouched: () => void;
    writeValue(v: number | null): void;
    registerOnChange(fn: (v: number | null) => void): void;
    registerOnTouched(fn: () => void): void;
    setDisabledState(d: boolean): void;
    protected handleInput(e: Event): void;
    protected bump(delta: number): void;
    private commit;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiNumberInput, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiNumberInput, "ui-number-input", never, { "min": { "alias": "min"; "required": false; "isSignal": true; }; "max": { "alias": "max"; "required": false; "isSignal": true; }; "step": { "alias": "step"; "required": false; "isSignal": true; }; "placeholder": { "alias": "placeholder"; "required": false; "isSignal": true; }; "size": { "alias": "size"; "required": false; "isSignal": true; }; "invalid": { "alias": "invalid"; "required": false; "isSignal": true; }; "radius": { "alias": "radius"; "required": false; "isSignal": true; }; }, {}, never, never, true, never>;
}

/** `ui-password-input` — password field with show/hide toggle (CVA). */
declare class UiPasswordInput implements ControlValueAccessor {
    private config;
    placeholder: _angular_core.InputSignal<string>;
    size: _angular_core.InputSignal<UiSize>;
    invalid: _angular_core.InputSignal<boolean>;
    radius: _angular_core.InputSignal<boolean>;
    protected readonly value: _angular_core.WritableSignal<string>;
    protected readonly disabled: _angular_core.WritableSignal<boolean>;
    protected readonly reveal: _angular_core.WritableSignal<boolean>;
    private onChange;
    protected onTouched: () => void;
    writeValue(v: string): void;
    registerOnChange(fn: (v: string) => void): void;
    registerOnTouched(fn: () => void): void;
    setDisabledState(d: boolean): void;
    protected handleInput(e: Event): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiPasswordInput, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiPasswordInput, "ui-password-input", never, { "placeholder": { "alias": "placeholder"; "required": false; "isSignal": true; }; "size": { "alias": "size"; "required": false; "isSignal": true; }; "invalid": { "alias": "invalid"; "required": false; "isSignal": true; }; "radius": { "alias": "radius"; "required": false; "isSignal": true; }; }, {}, never, never, true, never>;
}

/** `ui-search-input` — search field with icon and clear button (CVA). */
declare class UiSearchInput implements ControlValueAccessor {
    private config;
    placeholder: _angular_core.InputSignal<string>;
    size: _angular_core.InputSignal<UiSize>;
    radius: _angular_core.InputSignal<boolean>;
    protected readonly value: _angular_core.WritableSignal<string>;
    protected readonly disabled: _angular_core.WritableSignal<boolean>;
    private onChange;
    protected onTouched: () => void;
    writeValue(v: string): void;
    registerOnChange(fn: (v: string) => void): void;
    registerOnTouched(fn: () => void): void;
    setDisabledState(d: boolean): void;
    protected handleInput(e: Event): void;
    protected clear(): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiSearchInput, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiSearchInput, "ui-search-input", never, { "placeholder": { "alias": "placeholder"; "required": false; "isSignal": true; }; "size": { "alias": "size"; "required": false; "isSignal": true; }; "radius": { "alias": "radius"; "required": false; "isSignal": true; }; }, {}, never, never, true, never>;
}

/** `ui-slider` — themed range slider (CVA). */
declare class UiSlider implements ControlValueAccessor {
    min: _angular_core.InputSignal<number>;
    max: _angular_core.InputSignal<number>;
    step: _angular_core.InputSignal<number>;
    label: _angular_core.InputSignal<string>;
    showValue: _angular_core.InputSignal<boolean>;
    protected readonly value: _angular_core.WritableSignal<number>;
    protected readonly disabled: _angular_core.WritableSignal<boolean>;
    private onChange;
    protected onTouched: () => void;
    protected readonly fillPct: _angular_core.Signal<number>;
    writeValue(v: number): void;
    registerOnChange(fn: (v: number) => void): void;
    registerOnTouched(fn: () => void): void;
    setDisabledState(d: boolean): void;
    protected handleInput(e: Event): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiSlider, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiSlider, "ui-slider", never, { "min": { "alias": "min"; "required": false; "isSignal": true; }; "max": { "alias": "max"; "required": false; "isSignal": true; }; "step": { "alias": "step"; "required": false; "isSignal": true; }; "label": { "alias": "label"; "required": false; "isSignal": true; }; "showValue": { "alias": "showValue"; "required": false; "isSignal": true; }; }, {}, never, never, true, never>;
}

interface UiCheckboxOption {
    label: string;
    value: string;
    disabled?: boolean;
}
/** `ui-checkbox-group` — multi-select checkbox set (CVA; value is string[]). */
declare class UiCheckboxGroup implements ControlValueAccessor {
    options: _angular_core.InputSignal<UiCheckboxOption[]>;
    label: _angular_core.InputSignal<string | undefined>;
    orientation: _angular_core.InputSignal<"vertical" | "horizontal">;
    protected readonly selected: _angular_core.WritableSignal<Set<string>>;
    protected readonly disabled: _angular_core.WritableSignal<boolean>;
    private onChange;
    protected onTouched: () => void;
    writeValue(v: string[]): void;
    registerOnChange(fn: (v: string[]) => void): void;
    registerOnTouched(fn: () => void): void;
    setDisabledState(d: boolean): void;
    protected toggle(value: string): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiCheckboxGroup, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiCheckboxGroup, "ui-checkbox-group", never, { "options": { "alias": "options"; "required": false; "isSignal": true; }; "label": { "alias": "label"; "required": false; "isSignal": true; }; "orientation": { "alias": "orientation"; "required": false; "isSignal": true; }; }, {}, never, never, true, never>;
}

/** `ui-rating` — star rating (CVA). */
declare class UiRating implements ControlValueAccessor {
    max: _angular_core.InputSignal<number>;
    label: _angular_core.InputSignal<string>;
    protected readonly value: _angular_core.WritableSignal<number>;
    protected readonly hover: _angular_core.WritableSignal<number>;
    protected readonly disabled: _angular_core.WritableSignal<boolean>;
    private onChange;
    protected onTouched: () => void;
    protected stars(): number[];
    writeValue(v: number): void;
    registerOnChange(fn: (v: number) => void): void;
    registerOnTouched(fn: () => void): void;
    setDisabledState(d: boolean): void;
    protected set(v: number): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiRating, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiRating, "ui-rating", never, { "max": { "alias": "max"; "required": false; "isSignal": true; }; "label": { "alias": "label"; "required": false; "isSignal": true; }; }, {}, never, never, true, never>;
}

/** `ui-otp-input` — fixed-length one-time-code entry (CVA; value is the joined string). */
declare class UiOtpInput implements ControlValueAccessor {
    private host;
    length: _angular_core.InputSignal<number>;
    numeric: _angular_core.InputSignal<boolean>;
    protected readonly chars: _angular_core.WritableSignal<string[]>;
    protected readonly disabled: _angular_core.WritableSignal<boolean>;
    private onChange;
    protected onTouched: () => void;
    protected slots(): number[];
    writeValue(v: string): void;
    registerOnChange(fn: (v: string) => void): void;
    registerOnTouched(fn: () => void): void;
    setDisabledState(d: boolean): void;
    protected onInput(e: Event, index: number): void;
    protected onKeydown(e: KeyboardEvent, index: number): void;
    protected select(e: Event): void;
    private emit;
    private focusCell;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiOtpInput, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiOtpInput, "ui-otp-input", never, { "length": { "alias": "length"; "required": false; "isSignal": true; }; "numeric": { "alias": "numeric"; "required": false; "isSignal": true; }; }, {}, never, never, true, never>;
}

/** `ui-chip-input` — tokenized text entry (CVA; value is string[]). Enter adds, Backspace removes. */
declare class UiChipInput implements ControlValueAccessor {
    private config;
    placeholder: _angular_core.InputSignal<string>;
    radius: _angular_core.InputSignal<boolean>;
    protected readonly chips: _angular_core.WritableSignal<string[]>;
    protected readonly disabled: _angular_core.WritableSignal<boolean>;
    private onChange;
    protected onTouched: () => void;
    writeValue(v: string[]): void;
    registerOnChange(fn: (v: string[]) => void): void;
    registerOnTouched(fn: () => void): void;
    setDisabledState(d: boolean): void;
    protected onKey(e: KeyboardEvent): void;
    protected removeAt(i: number, e: Event): void;
    protected focusInput(): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiChipInput, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiChipInput, "ui-chip-input", never, { "placeholder": { "alias": "placeholder"; "required": false; "isSignal": true; }; "radius": { "alias": "radius"; "required": false; "isSignal": true; }; }, {}, never, never, true, never>;
}

/** `ui-editable-text` — click-to-edit inline text (CVA). Enter commits, Escape cancels. */
declare class UiEditableText implements ControlValueAccessor {
    placeholder: _angular_core.InputSignal<string>;
    private inp;
    protected readonly value: _angular_core.WritableSignal<string>;
    protected readonly draft: _angular_core.WritableSignal<string>;
    protected readonly editing: _angular_core.WritableSignal<boolean>;
    protected readonly disabled: _angular_core.WritableSignal<boolean>;
    private onChange;
    protected onTouched: () => void;
    writeValue(v: string): void;
    registerOnChange(fn: (v: string) => void): void;
    registerOnTouched(fn: () => void): void;
    setDisabledState(d: boolean): void;
    protected edit(): void;
    protected commit(): void;
    protected cancel(): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiEditableText, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiEditableText, "ui-editable-text", never, { "placeholder": { "alias": "placeholder"; "required": false; "isSignal": true; }; }, {}, never, never, true, never>;
}

/** `ui-color-picker` — native color well + hex field + preset swatches (CVA; value is hex). */
declare class UiColorPicker implements ControlValueAccessor {
    private config;
    radius: _angular_core.InputSignal<boolean>;
    swatches: _angular_core.InputSignal<string[]>;
    protected readonly value: _angular_core.WritableSignal<string>;
    protected readonly disabled: _angular_core.WritableSignal<boolean>;
    private onChange;
    protected onTouched: () => void;
    writeValue(v: string): void;
    registerOnChange(fn: (v: string) => void): void;
    registerOnTouched(fn: () => void): void;
    setDisabledState(d: boolean): void;
    protected set(v: string): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiColorPicker, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiColorPicker, "ui-color-picker", never, { "radius": { "alias": "radius"; "required": false; "isSignal": true; }; "swatches": { "alias": "swatches"; "required": false; "isSignal": true; }; }, {}, never, never, true, never>;
}

/** `ui-file-upload` — drag-and-drop / click dropzone. Emits `(filesSelected)`. */
declare class UiFileUpload {
    multiple: _angular_core.InputSignal<boolean>;
    accept: _angular_core.InputSignal<string | undefined>;
    radius: _angular_core.InputSignal<boolean>;
    filesSelected: _angular_core.OutputEmitterRef<File[]>;
    protected readonly files: _angular_core.WritableSignal<File[]>;
    protected readonly dragOver: _angular_core.WritableSignal<boolean>;
    protected onDragOver(e: DragEvent): void;
    protected onDrop(e: DragEvent): void;
    protected onPick(e: Event): void;
    private commit;
    protected size(bytes: number): string;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiFileUpload, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiFileUpload, "ui-file-upload", never, { "multiple": { "alias": "multiple"; "required": false; "isSignal": true; }; "accept": { "alias": "accept"; "required": false; "isSignal": true; }; "radius": { "alias": "radius"; "required": false; "isSignal": true; }; }, { "filesSelected": "filesSelected"; }, never, never, true, never>;
}

/** `ui-time-picker` — time field (CVA; value is `HH:MM`), built on a native time input. */
declare class UiTimePicker implements ControlValueAccessor {
    private config;
    size: _angular_core.InputSignal<UiSize>;
    /** Seconds granularity: 60 = minutes (default), 1 = show seconds. */
    step: _angular_core.InputSignal<number>;
    radius: _angular_core.InputSignal<boolean>;
    protected readonly value: _angular_core.WritableSignal<string>;
    protected readonly disabled: _angular_core.WritableSignal<boolean>;
    private onChange;
    protected onTouched: () => void;
    writeValue(v: string): void;
    registerOnChange(fn: (v: string) => void): void;
    registerOnTouched(fn: () => void): void;
    setDisabledState(d: boolean): void;
    protected set(v: string): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiTimePicker, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiTimePicker, "ui-time-picker", never, { "size": { "alias": "size"; "required": false; "isSignal": true; }; "step": { "alias": "step"; "required": false; "isSignal": true; }; "radius": { "alias": "radius"; "required": false; "isSignal": true; }; }, {}, never, never, true, never>;
}

export { UiCheckbox, UiCheckboxGroup, UiChipInput, UiColorPicker, UiEditableText, UiFileUpload, UiFormField, UiInput, UiNumberInput, UiOtpInput, UiPasswordInput, UiRadioGroup, UiRating, UiSearchInput, UiSelect, UiSlider, UiSwitch, UiTextarea, UiTimePicker };
export type { UiCheckboxOption, UiRadioOption, UiSelectOption };
