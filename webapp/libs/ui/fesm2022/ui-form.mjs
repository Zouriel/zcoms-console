import * as i0 from '@angular/core';
import { input, Component, inject, signal, forwardRef, computed, ElementRef, viewChild, output } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { UI_CONFIG } from 'ui';

/**
 * `ui-form-field` — label + hint + error wrapper for any control. The projected
 * control is wrapped by a `<label>`, giving implicit accessible-name
 * association without manual id wiring.
 */
class UiFormField {
    label = input(/* @ts-ignore */
    ...(ngDevMode ? [undefined, { debugName: "label" }] : /* istanbul ignore next */ []));
    hint = input(/* @ts-ignore */
    ...(ngDevMode ? [undefined, { debugName: "hint" }] : /* istanbul ignore next */ []));
    error = input(/* @ts-ignore */
    ...(ngDevMode ? [undefined, { debugName: "error" }] : /* istanbul ignore next */ []));
    required = input(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "required" }] : /* istanbul ignore next */ []));
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiFormField, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "22.0.4", type: UiFormField, isStandalone: true, selector: "ui-form-field", inputs: { label: { classPropertyName: "label", publicName: "label", isSignal: true, isRequired: false, transformFunction: null }, hint: { classPropertyName: "hint", publicName: "hint", isSignal: true, isRequired: false, transformFunction: null }, error: { classPropertyName: "error", publicName: "error", isSignal: true, isRequired: false, transformFunction: null }, required: { classPropertyName: "required", publicName: "required", isSignal: true, isRequired: false, transformFunction: null } }, ngImport: i0, template: `
    <div class="ui-field" [class.invalid]="!!error()">
      <label class="field-label">
        @if (label()) {
          <span class="lbl">
            {{ label() }}
            @if (required()) { <span class="req" aria-hidden="true">*</span> }
          </span>
        }
        <ng-content />
      </label>
      @if (hint() && !error()) { <span class="hint">{{ hint() }}</span> }
      @if (error()) { <span class="error" role="alert">{{ error() }}</span> }
    </div>
  `, isInline: true, styles: [":host{display:block}.ui-field,.field-label{display:flex;flex-direction:column;gap:var(--ui-space-1)}.lbl{font-family:var(--ui-font-default);font-size:var(--ui-font-size-sm);font-weight:600;color:var(--ui-color-text)}.req{color:var(--ui-color-danger);margin-left:2px}.hint{font-family:var(--ui-font-default);font-size:var(--ui-font-size-sm);color:var(--ui-color-text-muted)}.error{font-family:var(--ui-font-default);font-size:var(--ui-font-size-sm);color:var(--ui-color-danger)}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiFormField, decorators: [{
            type: Component,
            args: [{ selector: 'ui-form-field', template: `
    <div class="ui-field" [class.invalid]="!!error()">
      <label class="field-label">
        @if (label()) {
          <span class="lbl">
            {{ label() }}
            @if (required()) { <span class="req" aria-hidden="true">*</span> }
          </span>
        }
        <ng-content />
      </label>
      @if (hint() && !error()) { <span class="hint">{{ hint() }}</span> }
      @if (error()) { <span class="error" role="alert">{{ error() }}</span> }
    </div>
  `, styles: [":host{display:block}.ui-field,.field-label{display:flex;flex-direction:column;gap:var(--ui-space-1)}.lbl{font-family:var(--ui-font-default);font-size:var(--ui-font-size-sm);font-weight:600;color:var(--ui-color-text)}.req{color:var(--ui-color-danger);margin-left:2px}.hint{font-family:var(--ui-font-default);font-size:var(--ui-font-size-sm);color:var(--ui-color-text-muted)}.error{font-family:var(--ui-font-default);font-size:var(--ui-font-size-sm);color:var(--ui-color-danger)}\n"] }]
        }], propDecorators: { label: [{ type: i0.Input, args: [{ isSignal: true, alias: "label", required: false }] }], hint: [{ type: i0.Input, args: [{ isSignal: true, alias: "hint", required: false }] }], error: [{ type: i0.Input, args: [{ isSignal: true, alias: "error", required: false }] }], required: [{ type: i0.Input, args: [{ isSignal: true, alias: "required", required: false }] }] } });

/**
 * `ui-input` — single-line text field. Implements ControlValueAccessor so it
 * works with template-driven, reactive, and Signal Forms.
 */
class UiInput {
    config = inject(UI_CONFIG);
    type = input('text', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "type" }] : /* istanbul ignore next */ []));
    placeholder = input('', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "placeholder" }] : /* istanbul ignore next */ []));
    inputmode = input(/* @ts-ignore */
    ...(ngDevMode ? [undefined, { debugName: "inputmode" }] : /* istanbul ignore next */ []));
    size = input('md', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "size" }] : /* istanbul ignore next */ []));
    invalid = input(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "invalid" }] : /* istanbul ignore next */ []));
    radius = input(this.config.radius, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "radius" }] : /* istanbul ignore next */ []));
    value = signal('', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "value" }] : /* istanbul ignore next */ []));
    disabled = signal(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "disabled" }] : /* istanbul ignore next */ []));
    onChange = () => { };
    onTouched = () => { };
    writeValue(v) { this.value.set(v ?? ''); }
    registerOnChange(fn) { this.onChange = fn; }
    registerOnTouched(fn) { this.onTouched = fn; }
    setDisabledState(d) { this.disabled.set(d); }
    handleInput(e) {
        const v = e.target.value;
        this.value.set(v);
        this.onChange(v);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiInput, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.1.0", version: "22.0.4", type: UiInput, isStandalone: true, selector: "ui-input", inputs: { type: { classPropertyName: "type", publicName: "type", isSignal: true, isRequired: false, transformFunction: null }, placeholder: { classPropertyName: "placeholder", publicName: "placeholder", isSignal: true, isRequired: false, transformFunction: null }, inputmode: { classPropertyName: "inputmode", publicName: "inputmode", isSignal: true, isRequired: false, transformFunction: null }, size: { classPropertyName: "size", publicName: "size", isSignal: true, isRequired: false, transformFunction: null }, invalid: { classPropertyName: "invalid", publicName: "invalid", isSignal: true, isRequired: false, transformFunction: null }, radius: { classPropertyName: "radius", publicName: "radius", isSignal: true, isRequired: false, transformFunction: null } }, providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiInput), multi: true }], ngImport: i0, template: `
    <input
      class="ui-input"
      [class.no-radius]="!radius()"
      [attr.data-size]="size()"
      [attr.type]="type()"
      [attr.placeholder]="placeholder()"
      [attr.inputmode]="inputmode()"
      [attr.aria-invalid]="invalid() || null"
      [value]="value()"
      [disabled]="disabled()"
      (input)="handleInput($event)"
      (blur)="onTouched()" />
  `, isInline: true, styles: [":host{display:block}.ui-input{width:100%;box-sizing:border-box;height:var(--ui-size-md);padding:0 var(--ui-space-3);background:var(--ui-color-surface);color:var(--ui-color-text);border:1px solid var(--ui-color-border);border-radius:var(--ui-radius);font-family:var(--ui-font-default);font-size:var(--ui-font-size-md);transition:border-color var(--ui-motion-base) var(--ui-ease-standard),box-shadow var(--ui-motion-base) var(--ui-ease-standard)}.ui-input::placeholder{color:var(--ui-color-text-muted)}.ui-input:focus{outline:none;border-color:var(--ui-color-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--ui-color-primary) 30%,transparent)}.ui-input:disabled{opacity:.55;cursor:not-allowed}.ui-input.no-radius{border-radius:0}.ui-input[data-size=sm]{height:var(--ui-size-sm);font-size:var(--ui-font-size-sm)}.ui-input[data-size=lg]{height:var(--ui-size-lg);font-size:var(--ui-font-size-lg)}.ui-input[aria-invalid=true]{border-color:var(--ui-color-danger)}.ui-input[aria-invalid=true]:focus{box-shadow:0 0 0 3px color-mix(in srgb,var(--ui-color-danger) 30%,transparent)}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiInput, decorators: [{
            type: Component,
            args: [{ selector: 'ui-input', template: `
    <input
      class="ui-input"
      [class.no-radius]="!radius()"
      [attr.data-size]="size()"
      [attr.type]="type()"
      [attr.placeholder]="placeholder()"
      [attr.inputmode]="inputmode()"
      [attr.aria-invalid]="invalid() || null"
      [value]="value()"
      [disabled]="disabled()"
      (input)="handleInput($event)"
      (blur)="onTouched()" />
  `, providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiInput), multi: true }], styles: [":host{display:block}.ui-input{width:100%;box-sizing:border-box;height:var(--ui-size-md);padding:0 var(--ui-space-3);background:var(--ui-color-surface);color:var(--ui-color-text);border:1px solid var(--ui-color-border);border-radius:var(--ui-radius);font-family:var(--ui-font-default);font-size:var(--ui-font-size-md);transition:border-color var(--ui-motion-base) var(--ui-ease-standard),box-shadow var(--ui-motion-base) var(--ui-ease-standard)}.ui-input::placeholder{color:var(--ui-color-text-muted)}.ui-input:focus{outline:none;border-color:var(--ui-color-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--ui-color-primary) 30%,transparent)}.ui-input:disabled{opacity:.55;cursor:not-allowed}.ui-input.no-radius{border-radius:0}.ui-input[data-size=sm]{height:var(--ui-size-sm);font-size:var(--ui-font-size-sm)}.ui-input[data-size=lg]{height:var(--ui-size-lg);font-size:var(--ui-font-size-lg)}.ui-input[aria-invalid=true]{border-color:var(--ui-color-danger)}.ui-input[aria-invalid=true]:focus{box-shadow:0 0 0 3px color-mix(in srgb,var(--ui-color-danger) 30%,transparent)}\n"] }]
        }], propDecorators: { type: [{ type: i0.Input, args: [{ isSignal: true, alias: "type", required: false }] }], placeholder: [{ type: i0.Input, args: [{ isSignal: true, alias: "placeholder", required: false }] }], inputmode: [{ type: i0.Input, args: [{ isSignal: true, alias: "inputmode", required: false }] }], size: [{ type: i0.Input, args: [{ isSignal: true, alias: "size", required: false }] }], invalid: [{ type: i0.Input, args: [{ isSignal: true, alias: "invalid", required: false }] }], radius: [{ type: i0.Input, args: [{ isSignal: true, alias: "radius", required: false }] }] } });

/** `ui-textarea` — multi-line text field (CVA). */
class UiTextarea {
    config = inject(UI_CONFIG);
    placeholder = input('', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "placeholder" }] : /* istanbul ignore next */ []));
    rows = input(4, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "rows" }] : /* istanbul ignore next */ []));
    invalid = input(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "invalid" }] : /* istanbul ignore next */ []));
    radius = input(this.config.radius, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "radius" }] : /* istanbul ignore next */ []));
    value = signal('', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "value" }] : /* istanbul ignore next */ []));
    disabled = signal(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "disabled" }] : /* istanbul ignore next */ []));
    onChange = () => { };
    onTouched = () => { };
    writeValue(v) { this.value.set(v ?? ''); }
    registerOnChange(fn) { this.onChange = fn; }
    registerOnTouched(fn) { this.onTouched = fn; }
    setDisabledState(d) { this.disabled.set(d); }
    handleInput(e) {
        const v = e.target.value;
        this.value.set(v);
        this.onChange(v);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiTextarea, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.1.0", version: "22.0.4", type: UiTextarea, isStandalone: true, selector: "ui-textarea", inputs: { placeholder: { classPropertyName: "placeholder", publicName: "placeholder", isSignal: true, isRequired: false, transformFunction: null }, rows: { classPropertyName: "rows", publicName: "rows", isSignal: true, isRequired: false, transformFunction: null }, invalid: { classPropertyName: "invalid", publicName: "invalid", isSignal: true, isRequired: false, transformFunction: null }, radius: { classPropertyName: "radius", publicName: "radius", isSignal: true, isRequired: false, transformFunction: null } }, providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiTextarea), multi: true }], ngImport: i0, template: `
    <textarea
      class="ui-textarea"
      [class.no-radius]="!radius()"
      [attr.placeholder]="placeholder()"
      [attr.rows]="rows()"
      [attr.aria-invalid]="invalid() || null"
      [value]="value()"
      [disabled]="disabled()"
      (input)="handleInput($event)"
      (blur)="onTouched()"></textarea>
  `, isInline: true, styles: [":host{display:block}.ui-textarea{width:100%;box-sizing:border-box;resize:vertical;padding:var(--ui-space-2) var(--ui-space-3);background:var(--ui-color-surface);color:var(--ui-color-text);border:1px solid var(--ui-color-border);border-radius:var(--ui-radius);font-family:var(--ui-font-default);font-size:var(--ui-font-size-md);line-height:1.5;transition:border-color var(--ui-motion-base) var(--ui-ease-standard),box-shadow var(--ui-motion-base) var(--ui-ease-standard)}.ui-textarea::placeholder{color:var(--ui-color-text-muted)}.ui-textarea:focus{outline:none;border-color:var(--ui-color-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--ui-color-primary) 30%,transparent)}.ui-textarea:disabled{opacity:.55;cursor:not-allowed}.ui-textarea.no-radius{border-radius:0}.ui-textarea[aria-invalid=true]{border-color:var(--ui-color-danger)}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiTextarea, decorators: [{
            type: Component,
            args: [{ selector: 'ui-textarea', template: `
    <textarea
      class="ui-textarea"
      [class.no-radius]="!radius()"
      [attr.placeholder]="placeholder()"
      [attr.rows]="rows()"
      [attr.aria-invalid]="invalid() || null"
      [value]="value()"
      [disabled]="disabled()"
      (input)="handleInput($event)"
      (blur)="onTouched()"></textarea>
  `, providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiTextarea), multi: true }], styles: [":host{display:block}.ui-textarea{width:100%;box-sizing:border-box;resize:vertical;padding:var(--ui-space-2) var(--ui-space-3);background:var(--ui-color-surface);color:var(--ui-color-text);border:1px solid var(--ui-color-border);border-radius:var(--ui-radius);font-family:var(--ui-font-default);font-size:var(--ui-font-size-md);line-height:1.5;transition:border-color var(--ui-motion-base) var(--ui-ease-standard),box-shadow var(--ui-motion-base) var(--ui-ease-standard)}.ui-textarea::placeholder{color:var(--ui-color-text-muted)}.ui-textarea:focus{outline:none;border-color:var(--ui-color-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--ui-color-primary) 30%,transparent)}.ui-textarea:disabled{opacity:.55;cursor:not-allowed}.ui-textarea.no-radius{border-radius:0}.ui-textarea[aria-invalid=true]{border-color:var(--ui-color-danger)}\n"] }]
        }], propDecorators: { placeholder: [{ type: i0.Input, args: [{ isSignal: true, alias: "placeholder", required: false }] }], rows: [{ type: i0.Input, args: [{ isSignal: true, alias: "rows", required: false }] }], invalid: [{ type: i0.Input, args: [{ isSignal: true, alias: "invalid", required: false }] }], radius: [{ type: i0.Input, args: [{ isSignal: true, alias: "radius", required: false }] }] } });

/** `ui-checkbox` — boolean control (CVA) built on a native checkbox for a11y. */
class UiCheckbox {
    invalid = input(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "invalid" }] : /* istanbul ignore next */ []));
    checked = signal(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "checked" }] : /* istanbul ignore next */ []));
    disabled = signal(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "disabled" }] : /* istanbul ignore next */ []));
    onChange = () => { };
    onTouched = () => { };
    writeValue(v) { this.checked.set(!!v); }
    registerOnChange(fn) { this.onChange = fn; }
    registerOnTouched(fn) { this.onTouched = fn; }
    setDisabledState(d) { this.disabled.set(d); }
    toggle(e) {
        const v = e.target.checked;
        this.checked.set(v);
        this.onChange(v);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiCheckbox, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.1.0", version: "22.0.4", type: UiCheckbox, isStandalone: true, selector: "ui-checkbox", inputs: { invalid: { classPropertyName: "invalid", publicName: "invalid", isSignal: true, isRequired: false, transformFunction: null } }, providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiCheckbox), multi: true }], ngImport: i0, template: `
    <label class="ui-checkbox" [class.disabled]="disabled()">
      <input
        type="checkbox"
        class="native"
        [checked]="checked()"
        [disabled]="disabled()"
        [attr.aria-invalid]="invalid() || null"
        (change)="toggle($event)"
        (blur)="onTouched()" />
      <span class="box" aria-hidden="true">
        <svg viewBox="0 0 16 16" class="tick"><path d="M3 8.5l3 3 7-7" /></svg>
      </span>
      <span class="text"><ng-content /></span>
    </label>
  `, isInline: true, styles: [":host{display:inline-flex}.ui-checkbox{display:inline-flex;align-items:center;gap:var(--ui-space-2);cursor:pointer;font-family:var(--ui-font-default);font-size:var(--ui-font-size-md);color:var(--ui-color-text)}.ui-checkbox.disabled{opacity:.55;cursor:not-allowed}.native{position:absolute;opacity:0;width:0;height:0}.box{display:inline-flex;align-items:center;justify-content:center;width:18px;height:18px;flex:none;border:1px solid var(--ui-color-border);border-radius:5px;background:var(--ui-color-surface);transition:background var(--ui-motion-fast) var(--ui-ease-standard),border-color var(--ui-motion-fast) var(--ui-ease-standard)}.tick{width:12px;height:12px;fill:none;stroke:var(--ui-color-primary-contrast);stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:16;stroke-dashoffset:16;transition:stroke-dashoffset var(--ui-motion-base) var(--ui-ease-standard)}.native:checked+.box{background:var(--ui-color-primary);border-color:var(--ui-color-primary)}.native:checked+.box .tick{stroke-dashoffset:0}.native:focus-visible+.box{box-shadow:var(--ui-focus-ring)}.native[aria-invalid=true]+.box{border-color:var(--ui-color-danger)}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiCheckbox, decorators: [{
            type: Component,
            args: [{ selector: 'ui-checkbox', template: `
    <label class="ui-checkbox" [class.disabled]="disabled()">
      <input
        type="checkbox"
        class="native"
        [checked]="checked()"
        [disabled]="disabled()"
        [attr.aria-invalid]="invalid() || null"
        (change)="toggle($event)"
        (blur)="onTouched()" />
      <span class="box" aria-hidden="true">
        <svg viewBox="0 0 16 16" class="tick"><path d="M3 8.5l3 3 7-7" /></svg>
      </span>
      <span class="text"><ng-content /></span>
    </label>
  `, providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiCheckbox), multi: true }], styles: [":host{display:inline-flex}.ui-checkbox{display:inline-flex;align-items:center;gap:var(--ui-space-2);cursor:pointer;font-family:var(--ui-font-default);font-size:var(--ui-font-size-md);color:var(--ui-color-text)}.ui-checkbox.disabled{opacity:.55;cursor:not-allowed}.native{position:absolute;opacity:0;width:0;height:0}.box{display:inline-flex;align-items:center;justify-content:center;width:18px;height:18px;flex:none;border:1px solid var(--ui-color-border);border-radius:5px;background:var(--ui-color-surface);transition:background var(--ui-motion-fast) var(--ui-ease-standard),border-color var(--ui-motion-fast) var(--ui-ease-standard)}.tick{width:12px;height:12px;fill:none;stroke:var(--ui-color-primary-contrast);stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:16;stroke-dashoffset:16;transition:stroke-dashoffset var(--ui-motion-base) var(--ui-ease-standard)}.native:checked+.box{background:var(--ui-color-primary);border-color:var(--ui-color-primary)}.native:checked+.box .tick{stroke-dashoffset:0}.native:focus-visible+.box{box-shadow:var(--ui-focus-ring)}.native[aria-invalid=true]+.box{border-color:var(--ui-color-danger)}\n"] }]
        }], propDecorators: { invalid: [{ type: i0.Input, args: [{ isSignal: true, alias: "invalid", required: false }] }] } });

/** `ui-switch` — on/off toggle (CVA). Uses role="switch" on a native checkbox. */
class UiSwitch {
    checked = signal(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "checked" }] : /* istanbul ignore next */ []));
    disabled = signal(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "disabled" }] : /* istanbul ignore next */ []));
    onChange = () => { };
    onTouched = () => { };
    writeValue(v) { this.checked.set(!!v); }
    registerOnChange(fn) { this.onChange = fn; }
    registerOnTouched(fn) { this.onTouched = fn; }
    setDisabledState(d) { this.disabled.set(d); }
    toggle(e) {
        const v = e.target.checked;
        this.checked.set(v);
        this.onChange(v);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiSwitch, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "22.0.4", type: UiSwitch, isStandalone: true, selector: "ui-switch", providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiSwitch), multi: true }], ngImport: i0, template: `
    <label class="ui-switch" [class.disabled]="disabled()">
      <input
        type="checkbox"
        role="switch"
        class="native"
        [checked]="checked()"
        [disabled]="disabled()"
        [attr.aria-checked]="checked()"
        (change)="toggle($event)"
        (blur)="onTouched()" />
      <span class="track" aria-hidden="true"><span class="thumb"></span></span>
      <span class="text"><ng-content /></span>
    </label>
  `, isInline: true, styles: [":host{display:inline-flex}.ui-switch{display:inline-flex;align-items:center;gap:var(--ui-space-2);cursor:pointer;font-family:var(--ui-font-default);font-size:var(--ui-font-size-md);color:var(--ui-color-text)}.ui-switch.disabled{opacity:.55;cursor:not-allowed}.native{position:absolute;opacity:0;width:0;height:0}.track{position:relative;width:38px;height:22px;flex:none;background:var(--ui-color-border);border-radius:999px;transition:background var(--ui-motion-base) var(--ui-ease-standard)}.thumb{position:absolute;top:2px;left:2px;width:18px;height:18px;background:#fff;border-radius:50%;box-shadow:var(--ui-shadow-1);transition:transform var(--ui-motion-base) var(--ui-ease-spring)}.native:checked+.track{background:var(--ui-color-primary)}.native:checked+.track .thumb{transform:translate(16px)}.native:focus-visible+.track{box-shadow:var(--ui-focus-ring)}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiSwitch, decorators: [{
            type: Component,
            args: [{ selector: 'ui-switch', template: `
    <label class="ui-switch" [class.disabled]="disabled()">
      <input
        type="checkbox"
        role="switch"
        class="native"
        [checked]="checked()"
        [disabled]="disabled()"
        [attr.aria-checked]="checked()"
        (change)="toggle($event)"
        (blur)="onTouched()" />
      <span class="track" aria-hidden="true"><span class="thumb"></span></span>
      <span class="text"><ng-content /></span>
    </label>
  `, providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiSwitch), multi: true }], styles: [":host{display:inline-flex}.ui-switch{display:inline-flex;align-items:center;gap:var(--ui-space-2);cursor:pointer;font-family:var(--ui-font-default);font-size:var(--ui-font-size-md);color:var(--ui-color-text)}.ui-switch.disabled{opacity:.55;cursor:not-allowed}.native{position:absolute;opacity:0;width:0;height:0}.track{position:relative;width:38px;height:22px;flex:none;background:var(--ui-color-border);border-radius:999px;transition:background var(--ui-motion-base) var(--ui-ease-standard)}.thumb{position:absolute;top:2px;left:2px;width:18px;height:18px;background:#fff;border-radius:50%;box-shadow:var(--ui-shadow-1);transition:transform var(--ui-motion-base) var(--ui-ease-spring)}.native:checked+.track{background:var(--ui-color-primary)}.native:checked+.track .thumb{transform:translate(16px)}.native:focus-visible+.track{box-shadow:var(--ui-focus-ring)}\n"] }]
        }] });

let radioGroupSeq = 0;
/**
 * `ui-radio-group` — single-choice control (CVA). Built on native radio inputs
 * so keyboard interaction and group semantics are handled by the platform.
 */
class UiRadioGroup {
    options = input([], /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "options" }] : /* istanbul ignore next */ []));
    label = input(/* @ts-ignore */
    ...(ngDevMode ? [undefined, { debugName: "label" }] : /* istanbul ignore next */ []));
    orientation = input('vertical', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "orientation" }] : /* istanbul ignore next */ []));
    name = `ui-radio-${radioGroupSeq++}`;
    value = signal(null, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "value" }] : /* istanbul ignore next */ []));
    disabled = signal(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "disabled" }] : /* istanbul ignore next */ []));
    onChange = () => { };
    onTouched = () => { };
    writeValue(v) { this.value.set(v ?? null); }
    registerOnChange(fn) { this.onChange = fn; }
    registerOnTouched(fn) { this.onTouched = fn; }
    setDisabledState(d) { this.disabled.set(d); }
    select(v) {
        this.value.set(v);
        this.onChange(v);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiRadioGroup, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "22.0.4", type: UiRadioGroup, isStandalone: true, selector: "ui-radio-group", inputs: { options: { classPropertyName: "options", publicName: "options", isSignal: true, isRequired: false, transformFunction: null }, label: { classPropertyName: "label", publicName: "label", isSignal: true, isRequired: false, transformFunction: null }, orientation: { classPropertyName: "orientation", publicName: "orientation", isSignal: true, isRequired: false, transformFunction: null } }, providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiRadioGroup), multi: true }], ngImport: i0, template: `
    <div class="ui-radio-group" role="radiogroup" [attr.aria-label]="label()" [class.row]="orientation() === 'horizontal'">
      @for (opt of options(); track opt.value) {
        <label class="opt" [class.disabled]="disabled() || opt.disabled">
          <input
            type="radio"
            class="native"
            [name]="name"
            [value]="opt.value"
            [checked]="opt.value === value()"
            [disabled]="disabled() || !!opt.disabled"
            (change)="select(opt.value)"
            (blur)="onTouched()" />
          <span class="dot" aria-hidden="true"></span>
          <span class="text">{{ opt.label }}</span>
        </label>
      }
    </div>
  `, isInline: true, styles: [":host{display:block}.ui-radio-group{display:flex;flex-direction:column;gap:var(--ui-space-2)}.ui-radio-group.row{flex-direction:row;flex-wrap:wrap;gap:var(--ui-space-4)}.opt{display:inline-flex;align-items:center;gap:var(--ui-space-2);cursor:pointer;font-family:var(--ui-font-default);font-size:var(--ui-font-size-md);color:var(--ui-color-text)}.opt.disabled{opacity:.55;cursor:not-allowed}.native{position:absolute;opacity:0;width:0;height:0}.dot{width:18px;height:18px;flex:none;border-radius:50%;border:1px solid var(--ui-color-border);background:var(--ui-color-surface);display:inline-flex;align-items:center;justify-content:center;transition:border-color var(--ui-motion-fast) var(--ui-ease-standard)}.dot:after{content:\"\";width:8px;height:8px;border-radius:50%;background:var(--ui-color-primary);transform:scale(0);transition:transform var(--ui-motion-fast) var(--ui-ease-spring)}.native:checked+.dot{border-color:var(--ui-color-primary)}.native:checked+.dot:after{transform:scale(1)}.native:focus-visible+.dot{box-shadow:var(--ui-focus-ring)}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiRadioGroup, decorators: [{
            type: Component,
            args: [{ selector: 'ui-radio-group', template: `
    <div class="ui-radio-group" role="radiogroup" [attr.aria-label]="label()" [class.row]="orientation() === 'horizontal'">
      @for (opt of options(); track opt.value) {
        <label class="opt" [class.disabled]="disabled() || opt.disabled">
          <input
            type="radio"
            class="native"
            [name]="name"
            [value]="opt.value"
            [checked]="opt.value === value()"
            [disabled]="disabled() || !!opt.disabled"
            (change)="select(opt.value)"
            (blur)="onTouched()" />
          <span class="dot" aria-hidden="true"></span>
          <span class="text">{{ opt.label }}</span>
        </label>
      }
    </div>
  `, providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiRadioGroup), multi: true }], styles: [":host{display:block}.ui-radio-group{display:flex;flex-direction:column;gap:var(--ui-space-2)}.ui-radio-group.row{flex-direction:row;flex-wrap:wrap;gap:var(--ui-space-4)}.opt{display:inline-flex;align-items:center;gap:var(--ui-space-2);cursor:pointer;font-family:var(--ui-font-default);font-size:var(--ui-font-size-md);color:var(--ui-color-text)}.opt.disabled{opacity:.55;cursor:not-allowed}.native{position:absolute;opacity:0;width:0;height:0}.dot{width:18px;height:18px;flex:none;border-radius:50%;border:1px solid var(--ui-color-border);background:var(--ui-color-surface);display:inline-flex;align-items:center;justify-content:center;transition:border-color var(--ui-motion-fast) var(--ui-ease-standard)}.dot:after{content:\"\";width:8px;height:8px;border-radius:50%;background:var(--ui-color-primary);transform:scale(0);transition:transform var(--ui-motion-fast) var(--ui-ease-spring)}.native:checked+.dot{border-color:var(--ui-color-primary)}.native:checked+.dot:after{transform:scale(1)}.native:focus-visible+.dot{box-shadow:var(--ui-focus-ring)}\n"] }]
        }], propDecorators: { options: [{ type: i0.Input, args: [{ isSignal: true, alias: "options", required: false }] }], label: [{ type: i0.Input, args: [{ isSignal: true, alias: "label", required: false }] }], orientation: [{ type: i0.Input, args: [{ isSignal: true, alias: "orientation", required: false }] }] } });

/**
 * `ui-select` — single-choice dropdown (CVA) built on a native `<select>` for
 * full keyboard/screen-reader support. For rich filtering use combobox instead.
 */
class UiSelect {
    config = inject(UI_CONFIG);
    options = input([], /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "options" }] : /* istanbul ignore next */ []));
    placeholder = input(/* @ts-ignore */
    ...(ngDevMode ? [undefined, { debugName: "placeholder" }] : /* istanbul ignore next */ []));
    label = input(/* @ts-ignore */
    ...(ngDevMode ? [undefined, { debugName: "label" }] : /* istanbul ignore next */ []));
    size = input('md', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "size" }] : /* istanbul ignore next */ []));
    invalid = input(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "invalid" }] : /* istanbul ignore next */ []));
    radius = input(this.config.radius, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "radius" }] : /* istanbul ignore next */ []));
    value = signal('', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "value" }] : /* istanbul ignore next */ []));
    disabled = signal(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "disabled" }] : /* istanbul ignore next */ []));
    onChange = () => { };
    onTouched = () => { };
    writeValue(v) { this.value.set(v ?? ''); }
    registerOnChange(fn) { this.onChange = fn; }
    registerOnTouched(fn) { this.onTouched = fn; }
    setDisabledState(d) { this.disabled.set(d); }
    handleChange(e) {
        const v = e.target.value;
        this.value.set(v);
        this.onChange(v);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiSelect, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "22.0.4", type: UiSelect, isStandalone: true, selector: "ui-select", inputs: { options: { classPropertyName: "options", publicName: "options", isSignal: true, isRequired: false, transformFunction: null }, placeholder: { classPropertyName: "placeholder", publicName: "placeholder", isSignal: true, isRequired: false, transformFunction: null }, label: { classPropertyName: "label", publicName: "label", isSignal: true, isRequired: false, transformFunction: null }, size: { classPropertyName: "size", publicName: "size", isSignal: true, isRequired: false, transformFunction: null }, invalid: { classPropertyName: "invalid", publicName: "invalid", isSignal: true, isRequired: false, transformFunction: null }, radius: { classPropertyName: "radius", publicName: "radius", isSignal: true, isRequired: false, transformFunction: null } }, providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiSelect), multi: true }], ngImport: i0, template: `
    <div class="wrap" [class.no-radius]="!radius()" [attr.data-size]="size()">
      <select
        class="ui-select"
        [value]="value()"
        [disabled]="disabled()"
        [attr.aria-invalid]="invalid() || null"
        [attr.aria-label]="label()"
        (change)="handleChange($event)"
        (blur)="onTouched()">
        @if (placeholder()) { <option value="" disabled hidden>{{ placeholder() }}</option> }
        @for (opt of options(); track opt.value) {
          <option [value]="opt.value" [disabled]="!!opt.disabled">{{ opt.label }}</option>
        }
      </select>
      <span class="chevron" aria-hidden="true">▾</span>
    </div>
  `, isInline: true, styles: [":host{display:block}.wrap{position:relative}.ui-select{width:100%;box-sizing:border-box;appearance:none;height:var(--ui-size-md);padding:0 var(--ui-space-6) 0 var(--ui-space-3);background:var(--ui-color-surface);color:var(--ui-color-text);border:1px solid var(--ui-color-border);border-radius:var(--ui-radius);font-family:var(--ui-font-default);font-size:var(--ui-font-size-md);cursor:pointer;transition:border-color var(--ui-motion-base) var(--ui-ease-standard),box-shadow var(--ui-motion-base) var(--ui-ease-standard)}.ui-select:focus{outline:none;border-color:var(--ui-color-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--ui-color-primary) 30%,transparent)}.ui-select:disabled{opacity:.55;cursor:not-allowed}.wrap.no-radius .ui-select{border-radius:0}.wrap[data-size=sm] .ui-select{height:var(--ui-size-sm);font-size:var(--ui-font-size-sm)}.wrap[data-size=lg] .ui-select{height:var(--ui-size-lg);font-size:var(--ui-font-size-lg)}.ui-select[aria-invalid=true]{border-color:var(--ui-color-danger)}.chevron{position:absolute;right:var(--ui-space-3);top:50%;transform:translateY(-50%);pointer-events:none;color:var(--ui-color-text-muted)}option{color:initial}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiSelect, decorators: [{
            type: Component,
            args: [{ selector: 'ui-select', template: `
    <div class="wrap" [class.no-radius]="!radius()" [attr.data-size]="size()">
      <select
        class="ui-select"
        [value]="value()"
        [disabled]="disabled()"
        [attr.aria-invalid]="invalid() || null"
        [attr.aria-label]="label()"
        (change)="handleChange($event)"
        (blur)="onTouched()">
        @if (placeholder()) { <option value="" disabled hidden>{{ placeholder() }}</option> }
        @for (opt of options(); track opt.value) {
          <option [value]="opt.value" [disabled]="!!opt.disabled">{{ opt.label }}</option>
        }
      </select>
      <span class="chevron" aria-hidden="true">▾</span>
    </div>
  `, providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiSelect), multi: true }], styles: [":host{display:block}.wrap{position:relative}.ui-select{width:100%;box-sizing:border-box;appearance:none;height:var(--ui-size-md);padding:0 var(--ui-space-6) 0 var(--ui-space-3);background:var(--ui-color-surface);color:var(--ui-color-text);border:1px solid var(--ui-color-border);border-radius:var(--ui-radius);font-family:var(--ui-font-default);font-size:var(--ui-font-size-md);cursor:pointer;transition:border-color var(--ui-motion-base) var(--ui-ease-standard),box-shadow var(--ui-motion-base) var(--ui-ease-standard)}.ui-select:focus{outline:none;border-color:var(--ui-color-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--ui-color-primary) 30%,transparent)}.ui-select:disabled{opacity:.55;cursor:not-allowed}.wrap.no-radius .ui-select{border-radius:0}.wrap[data-size=sm] .ui-select{height:var(--ui-size-sm);font-size:var(--ui-font-size-sm)}.wrap[data-size=lg] .ui-select{height:var(--ui-size-lg);font-size:var(--ui-font-size-lg)}.ui-select[aria-invalid=true]{border-color:var(--ui-color-danger)}.chevron{position:absolute;right:var(--ui-space-3);top:50%;transform:translateY(-50%);pointer-events:none;color:var(--ui-color-text-muted)}option{color:initial}\n"] }]
        }], propDecorators: { options: [{ type: i0.Input, args: [{ isSignal: true, alias: "options", required: false }] }], placeholder: [{ type: i0.Input, args: [{ isSignal: true, alias: "placeholder", required: false }] }], label: [{ type: i0.Input, args: [{ isSignal: true, alias: "label", required: false }] }], size: [{ type: i0.Input, args: [{ isSignal: true, alias: "size", required: false }] }], invalid: [{ type: i0.Input, args: [{ isSignal: true, alias: "invalid", required: false }] }], radius: [{ type: i0.Input, args: [{ isSignal: true, alias: "radius", required: false }] }] } });

/** `ui-number-input` — numeric field with stepper buttons (CVA). */
class UiNumberInput {
    config = inject(UI_CONFIG);
    min = input(/* @ts-ignore */
    ...(ngDevMode ? [undefined, { debugName: "min" }] : /* istanbul ignore next */ []));
    max = input(/* @ts-ignore */
    ...(ngDevMode ? [undefined, { debugName: "max" }] : /* istanbul ignore next */ []));
    step = input(1, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "step" }] : /* istanbul ignore next */ []));
    placeholder = input('', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "placeholder" }] : /* istanbul ignore next */ []));
    size = input('md', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "size" }] : /* istanbul ignore next */ []));
    invalid = input(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "invalid" }] : /* istanbul ignore next */ []));
    radius = input(this.config.radius, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "radius" }] : /* istanbul ignore next */ []));
    value = signal(null, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "value" }] : /* istanbul ignore next */ []));
    disabled = signal(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "disabled" }] : /* istanbul ignore next */ []));
    onChange = () => { };
    onTouched = () => { };
    writeValue(v) { this.value.set(v ?? null); }
    registerOnChange(fn) { this.onChange = fn; }
    registerOnTouched(fn) { this.onTouched = fn; }
    setDisabledState(d) { this.disabled.set(d); }
    handleInput(e) {
        const raw = e.target.value;
        const v = raw === '' ? null : Number(raw);
        this.commit(v);
    }
    bump(delta) {
        this.commit((this.value() ?? 0) + delta);
    }
    commit(v) {
        if (v !== null) {
            const min = this.min(), max = this.max();
            if (min !== undefined)
                v = Math.max(min, v);
            if (max !== undefined)
                v = Math.min(max, v);
        }
        this.value.set(v);
        this.onChange(v);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiNumberInput, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.1.0", version: "22.0.4", type: UiNumberInput, isStandalone: true, selector: "ui-number-input", inputs: { min: { classPropertyName: "min", publicName: "min", isSignal: true, isRequired: false, transformFunction: null }, max: { classPropertyName: "max", publicName: "max", isSignal: true, isRequired: false, transformFunction: null }, step: { classPropertyName: "step", publicName: "step", isSignal: true, isRequired: false, transformFunction: null }, placeholder: { classPropertyName: "placeholder", publicName: "placeholder", isSignal: true, isRequired: false, transformFunction: null }, size: { classPropertyName: "size", publicName: "size", isSignal: true, isRequired: false, transformFunction: null }, invalid: { classPropertyName: "invalid", publicName: "invalid", isSignal: true, isRequired: false, transformFunction: null }, radius: { classPropertyName: "radius", publicName: "radius", isSignal: true, isRequired: false, transformFunction: null } }, providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiNumberInput), multi: true }], ngImport: i0, template: `
    <div class="wrap" [class.no-radius]="!radius()" [attr.data-size]="size()">
      <input
        class="ui-number"
        type="number"
        [attr.min]="min()" [attr.max]="max()" [attr.step]="step()"
        [attr.placeholder]="placeholder()"
        [attr.aria-invalid]="invalid() || null"
        [value]="value()"
        [disabled]="disabled()"
        (input)="handleInput($event)"
        (blur)="onTouched()" />
      <div class="steppers">
        <button type="button" tabindex="-1" aria-label="Increment" [disabled]="disabled()" (click)="bump(step())">▲</button>
        <button type="button" tabindex="-1" aria-label="Decrement" [disabled]="disabled()" (click)="bump(-step())">▼</button>
      </div>
    </div>
  `, isInline: true, styles: [":host{display:block}.wrap{position:relative;display:flex;align-items:stretch;border:1px solid var(--ui-color-border);border-radius:var(--ui-radius);background:var(--ui-color-surface);transition:border-color var(--ui-motion-base) var(--ui-ease-standard),box-shadow var(--ui-motion-base) var(--ui-ease-standard)}.wrap:focus-within{border-color:var(--ui-color-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--ui-color-primary) 30%,transparent)}.wrap.no-radius{border-radius:0}.ui-number{flex:1;min-width:0;appearance:textfield;-moz-appearance:textfield;height:var(--ui-size-md);padding:0 var(--ui-space-3);border:none;background:transparent;color:var(--ui-color-text);font-family:var(--ui-font-default);font-size:var(--ui-font-size-md);outline:none}.ui-number::-webkit-outer-spin-button,.ui-number::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}.wrap[data-size=sm] .ui-number{height:var(--ui-size-sm);font-size:var(--ui-font-size-sm)}.wrap[data-size=lg] .ui-number{height:var(--ui-size-lg);font-size:var(--ui-font-size-lg)}.steppers{display:flex;flex-direction:column;border-left:1px solid var(--ui-color-border)}.steppers button{flex:1;width:22px;border:none;background:transparent;color:var(--ui-color-text-muted);cursor:pointer;font-size:8px;padding:0}.steppers button:first-child{border-bottom:1px solid var(--ui-color-border)}.steppers button:hover:not(:disabled){background:var(--ui-color-surface-raised);color:var(--ui-color-text)}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiNumberInput, decorators: [{
            type: Component,
            args: [{ selector: 'ui-number-input', template: `
    <div class="wrap" [class.no-radius]="!radius()" [attr.data-size]="size()">
      <input
        class="ui-number"
        type="number"
        [attr.min]="min()" [attr.max]="max()" [attr.step]="step()"
        [attr.placeholder]="placeholder()"
        [attr.aria-invalid]="invalid() || null"
        [value]="value()"
        [disabled]="disabled()"
        (input)="handleInput($event)"
        (blur)="onTouched()" />
      <div class="steppers">
        <button type="button" tabindex="-1" aria-label="Increment" [disabled]="disabled()" (click)="bump(step())">▲</button>
        <button type="button" tabindex="-1" aria-label="Decrement" [disabled]="disabled()" (click)="bump(-step())">▼</button>
      </div>
    </div>
  `, providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiNumberInput), multi: true }], styles: [":host{display:block}.wrap{position:relative;display:flex;align-items:stretch;border:1px solid var(--ui-color-border);border-radius:var(--ui-radius);background:var(--ui-color-surface);transition:border-color var(--ui-motion-base) var(--ui-ease-standard),box-shadow var(--ui-motion-base) var(--ui-ease-standard)}.wrap:focus-within{border-color:var(--ui-color-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--ui-color-primary) 30%,transparent)}.wrap.no-radius{border-radius:0}.ui-number{flex:1;min-width:0;appearance:textfield;-moz-appearance:textfield;height:var(--ui-size-md);padding:0 var(--ui-space-3);border:none;background:transparent;color:var(--ui-color-text);font-family:var(--ui-font-default);font-size:var(--ui-font-size-md);outline:none}.ui-number::-webkit-outer-spin-button,.ui-number::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}.wrap[data-size=sm] .ui-number{height:var(--ui-size-sm);font-size:var(--ui-font-size-sm)}.wrap[data-size=lg] .ui-number{height:var(--ui-size-lg);font-size:var(--ui-font-size-lg)}.steppers{display:flex;flex-direction:column;border-left:1px solid var(--ui-color-border)}.steppers button{flex:1;width:22px;border:none;background:transparent;color:var(--ui-color-text-muted);cursor:pointer;font-size:8px;padding:0}.steppers button:first-child{border-bottom:1px solid var(--ui-color-border)}.steppers button:hover:not(:disabled){background:var(--ui-color-surface-raised);color:var(--ui-color-text)}\n"] }]
        }], propDecorators: { min: [{ type: i0.Input, args: [{ isSignal: true, alias: "min", required: false }] }], max: [{ type: i0.Input, args: [{ isSignal: true, alias: "max", required: false }] }], step: [{ type: i0.Input, args: [{ isSignal: true, alias: "step", required: false }] }], placeholder: [{ type: i0.Input, args: [{ isSignal: true, alias: "placeholder", required: false }] }], size: [{ type: i0.Input, args: [{ isSignal: true, alias: "size", required: false }] }], invalid: [{ type: i0.Input, args: [{ isSignal: true, alias: "invalid", required: false }] }], radius: [{ type: i0.Input, args: [{ isSignal: true, alias: "radius", required: false }] }] } });

/** `ui-password-input` — password field with show/hide toggle (CVA). */
class UiPasswordInput {
    config = inject(UI_CONFIG);
    placeholder = input('', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "placeholder" }] : /* istanbul ignore next */ []));
    size = input('md', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "size" }] : /* istanbul ignore next */ []));
    invalid = input(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "invalid" }] : /* istanbul ignore next */ []));
    radius = input(this.config.radius, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "radius" }] : /* istanbul ignore next */ []));
    value = signal('', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "value" }] : /* istanbul ignore next */ []));
    disabled = signal(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "disabled" }] : /* istanbul ignore next */ []));
    reveal = signal(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "reveal" }] : /* istanbul ignore next */ []));
    onChange = () => { };
    onTouched = () => { };
    writeValue(v) { this.value.set(v ?? ''); }
    registerOnChange(fn) { this.onChange = fn; }
    registerOnTouched(fn) { this.onTouched = fn; }
    setDisabledState(d) { this.disabled.set(d); }
    handleInput(e) {
        const v = e.target.value;
        this.value.set(v);
        this.onChange(v);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiPasswordInput, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.1.0", version: "22.0.4", type: UiPasswordInput, isStandalone: true, selector: "ui-password-input", inputs: { placeholder: { classPropertyName: "placeholder", publicName: "placeholder", isSignal: true, isRequired: false, transformFunction: null }, size: { classPropertyName: "size", publicName: "size", isSignal: true, isRequired: false, transformFunction: null }, invalid: { classPropertyName: "invalid", publicName: "invalid", isSignal: true, isRequired: false, transformFunction: null }, radius: { classPropertyName: "radius", publicName: "radius", isSignal: true, isRequired: false, transformFunction: null } }, providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiPasswordInput), multi: true }], ngImport: i0, template: `
    <div class="wrap" [class.no-radius]="!radius()" [attr.data-size]="size()">
      <input
        class="ui-pw"
        [attr.type]="reveal() ? 'text' : 'password'"
        [attr.placeholder]="placeholder()"
        [attr.aria-invalid]="invalid() || null"
        autocomplete="current-password"
        [value]="value()"
        [disabled]="disabled()"
        (input)="handleInput($event)"
        (blur)="onTouched()" />
      <button type="button" class="toggle" tabindex="-1"
              [attr.aria-label]="reveal() ? 'Hide password' : 'Show password'"
              [disabled]="disabled()" (click)="reveal.set(!reveal())">
        {{ reveal() ? '🙈' : '👁' }}
      </button>
    </div>
  `, isInline: true, styles: [":host{display:block}.wrap{display:flex;align-items:stretch;border:1px solid var(--ui-color-border);border-radius:var(--ui-radius);background:var(--ui-color-surface);transition:border-color var(--ui-motion-base) var(--ui-ease-standard),box-shadow var(--ui-motion-base) var(--ui-ease-standard)}.wrap:focus-within{border-color:var(--ui-color-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--ui-color-primary) 30%,transparent)}.wrap.no-radius{border-radius:0}.ui-pw{flex:1;min-width:0;height:var(--ui-size-md);padding:0 var(--ui-space-3);border:none;background:transparent;color:var(--ui-color-text);font-family:var(--ui-font-default);font-size:var(--ui-font-size-md);outline:none}.wrap[data-size=sm] .ui-pw{height:var(--ui-size-sm);font-size:var(--ui-font-size-sm)}.wrap[data-size=lg] .ui-pw{height:var(--ui-size-lg);font-size:var(--ui-font-size-lg)}.toggle{border:none;background:transparent;cursor:pointer;padding:0 var(--ui-space-2);font-size:14px}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiPasswordInput, decorators: [{
            type: Component,
            args: [{ selector: 'ui-password-input', template: `
    <div class="wrap" [class.no-radius]="!radius()" [attr.data-size]="size()">
      <input
        class="ui-pw"
        [attr.type]="reveal() ? 'text' : 'password'"
        [attr.placeholder]="placeholder()"
        [attr.aria-invalid]="invalid() || null"
        autocomplete="current-password"
        [value]="value()"
        [disabled]="disabled()"
        (input)="handleInput($event)"
        (blur)="onTouched()" />
      <button type="button" class="toggle" tabindex="-1"
              [attr.aria-label]="reveal() ? 'Hide password' : 'Show password'"
              [disabled]="disabled()" (click)="reveal.set(!reveal())">
        {{ reveal() ? '🙈' : '👁' }}
      </button>
    </div>
  `, providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiPasswordInput), multi: true }], styles: [":host{display:block}.wrap{display:flex;align-items:stretch;border:1px solid var(--ui-color-border);border-radius:var(--ui-radius);background:var(--ui-color-surface);transition:border-color var(--ui-motion-base) var(--ui-ease-standard),box-shadow var(--ui-motion-base) var(--ui-ease-standard)}.wrap:focus-within{border-color:var(--ui-color-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--ui-color-primary) 30%,transparent)}.wrap.no-radius{border-radius:0}.ui-pw{flex:1;min-width:0;height:var(--ui-size-md);padding:0 var(--ui-space-3);border:none;background:transparent;color:var(--ui-color-text);font-family:var(--ui-font-default);font-size:var(--ui-font-size-md);outline:none}.wrap[data-size=sm] .ui-pw{height:var(--ui-size-sm);font-size:var(--ui-font-size-sm)}.wrap[data-size=lg] .ui-pw{height:var(--ui-size-lg);font-size:var(--ui-font-size-lg)}.toggle{border:none;background:transparent;cursor:pointer;padding:0 var(--ui-space-2);font-size:14px}\n"] }]
        }], propDecorators: { placeholder: [{ type: i0.Input, args: [{ isSignal: true, alias: "placeholder", required: false }] }], size: [{ type: i0.Input, args: [{ isSignal: true, alias: "size", required: false }] }], invalid: [{ type: i0.Input, args: [{ isSignal: true, alias: "invalid", required: false }] }], radius: [{ type: i0.Input, args: [{ isSignal: true, alias: "radius", required: false }] }] } });

/** `ui-search-input` — search field with icon and clear button (CVA). */
class UiSearchInput {
    config = inject(UI_CONFIG);
    placeholder = input('Search…', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "placeholder" }] : /* istanbul ignore next */ []));
    size = input('md', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "size" }] : /* istanbul ignore next */ []));
    radius = input(this.config.radius, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "radius" }] : /* istanbul ignore next */ []));
    value = signal('', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "value" }] : /* istanbul ignore next */ []));
    disabled = signal(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "disabled" }] : /* istanbul ignore next */ []));
    onChange = () => { };
    onTouched = () => { };
    writeValue(v) { this.value.set(v ?? ''); }
    registerOnChange(fn) { this.onChange = fn; }
    registerOnTouched(fn) { this.onTouched = fn; }
    setDisabledState(d) { this.disabled.set(d); }
    handleInput(e) {
        const v = e.target.value;
        this.value.set(v);
        this.onChange(v);
    }
    clear() {
        this.value.set('');
        this.onChange('');
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiSearchInput, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "22.0.4", type: UiSearchInput, isStandalone: true, selector: "ui-search-input", inputs: { placeholder: { classPropertyName: "placeholder", publicName: "placeholder", isSignal: true, isRequired: false, transformFunction: null }, size: { classPropertyName: "size", publicName: "size", isSignal: true, isRequired: false, transformFunction: null }, radius: { classPropertyName: "radius", publicName: "radius", isSignal: true, isRequired: false, transformFunction: null } }, providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiSearchInput), multi: true }], ngImport: i0, template: `
    <div class="wrap" [class.no-radius]="!radius()" [attr.data-size]="size()">
      <span class="icon" aria-hidden="true">🔍</span>
      <input
        class="ui-search"
        type="search"
        role="searchbox"
        [attr.placeholder]="placeholder()"
        [value]="value()"
        [disabled]="disabled()"
        (input)="handleInput($event)"
        (blur)="onTouched()" />
      @if (value()) {
        <button type="button" class="clear" tabindex="-1" aria-label="Clear search" (click)="clear()">×</button>
      }
    </div>
  `, isInline: true, styles: [":host{display:block}.wrap{display:flex;align-items:center;gap:var(--ui-space-2);padding:0 var(--ui-space-3);border:1px solid var(--ui-color-border);border-radius:var(--ui-radius);background:var(--ui-color-surface);transition:border-color var(--ui-motion-base) var(--ui-ease-standard),box-shadow var(--ui-motion-base) var(--ui-ease-standard)}.wrap:focus-within{border-color:var(--ui-color-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--ui-color-primary) 30%,transparent)}.wrap.no-radius{border-radius:0}.icon{font-size:12px;opacity:.7}.ui-search{flex:1;min-width:0;height:var(--ui-size-md);border:none;background:transparent;color:var(--ui-color-text);font-family:var(--ui-font-default);font-size:var(--ui-font-size-md);outline:none}.ui-search::-webkit-search-cancel-button{display:none}.wrap[data-size=sm] .ui-search{height:var(--ui-size-sm);font-size:var(--ui-font-size-sm)}.wrap[data-size=lg] .ui-search{height:var(--ui-size-lg);font-size:var(--ui-font-size-lg)}.clear{border:none;background:transparent;color:var(--ui-color-text-muted);cursor:pointer;font-size:16px;line-height:1}.clear:hover{color:var(--ui-color-text)}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiSearchInput, decorators: [{
            type: Component,
            args: [{ selector: 'ui-search-input', template: `
    <div class="wrap" [class.no-radius]="!radius()" [attr.data-size]="size()">
      <span class="icon" aria-hidden="true">🔍</span>
      <input
        class="ui-search"
        type="search"
        role="searchbox"
        [attr.placeholder]="placeholder()"
        [value]="value()"
        [disabled]="disabled()"
        (input)="handleInput($event)"
        (blur)="onTouched()" />
      @if (value()) {
        <button type="button" class="clear" tabindex="-1" aria-label="Clear search" (click)="clear()">×</button>
      }
    </div>
  `, providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiSearchInput), multi: true }], styles: [":host{display:block}.wrap{display:flex;align-items:center;gap:var(--ui-space-2);padding:0 var(--ui-space-3);border:1px solid var(--ui-color-border);border-radius:var(--ui-radius);background:var(--ui-color-surface);transition:border-color var(--ui-motion-base) var(--ui-ease-standard),box-shadow var(--ui-motion-base) var(--ui-ease-standard)}.wrap:focus-within{border-color:var(--ui-color-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--ui-color-primary) 30%,transparent)}.wrap.no-radius{border-radius:0}.icon{font-size:12px;opacity:.7}.ui-search{flex:1;min-width:0;height:var(--ui-size-md);border:none;background:transparent;color:var(--ui-color-text);font-family:var(--ui-font-default);font-size:var(--ui-font-size-md);outline:none}.ui-search::-webkit-search-cancel-button{display:none}.wrap[data-size=sm] .ui-search{height:var(--ui-size-sm);font-size:var(--ui-font-size-sm)}.wrap[data-size=lg] .ui-search{height:var(--ui-size-lg);font-size:var(--ui-font-size-lg)}.clear{border:none;background:transparent;color:var(--ui-color-text-muted);cursor:pointer;font-size:16px;line-height:1}.clear:hover{color:var(--ui-color-text)}\n"] }]
        }], propDecorators: { placeholder: [{ type: i0.Input, args: [{ isSignal: true, alias: "placeholder", required: false }] }], size: [{ type: i0.Input, args: [{ isSignal: true, alias: "size", required: false }] }], radius: [{ type: i0.Input, args: [{ isSignal: true, alias: "radius", required: false }] }] } });

/** `ui-slider` — themed range slider (CVA). */
class UiSlider {
    min = input(0, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "min" }] : /* istanbul ignore next */ []));
    max = input(100, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "max" }] : /* istanbul ignore next */ []));
    step = input(1, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "step" }] : /* istanbul ignore next */ []));
    label = input('Slider', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "label" }] : /* istanbul ignore next */ []));
    showValue = input(true, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "showValue" }] : /* istanbul ignore next */ []));
    value = signal(0, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "value" }] : /* istanbul ignore next */ []));
    disabled = signal(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "disabled" }] : /* istanbul ignore next */ []));
    onChange = () => { };
    onTouched = () => { };
    fillPct = computed(() => {
        const range = this.max() - this.min();
        return range <= 0 ? 0 : ((this.value() - this.min()) / range) * 100;
    }, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "fillPct" }] : /* istanbul ignore next */ []));
    writeValue(v) { this.value.set(v ?? this.min()); }
    registerOnChange(fn) { this.onChange = fn; }
    registerOnTouched(fn) { this.onTouched = fn; }
    setDisabledState(d) { this.disabled.set(d); }
    handleInput(e) {
        const v = Number(e.target.value);
        this.value.set(v);
        this.onChange(v);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiSlider, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "22.0.4", type: UiSlider, isStandalone: true, selector: "ui-slider", inputs: { min: { classPropertyName: "min", publicName: "min", isSignal: true, isRequired: false, transformFunction: null }, max: { classPropertyName: "max", publicName: "max", isSignal: true, isRequired: false, transformFunction: null }, step: { classPropertyName: "step", publicName: "step", isSignal: true, isRequired: false, transformFunction: null }, label: { classPropertyName: "label", publicName: "label", isSignal: true, isRequired: false, transformFunction: null }, showValue: { classPropertyName: "showValue", publicName: "showValue", isSignal: true, isRequired: false, transformFunction: null } }, providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiSlider), multi: true }], ngImport: i0, template: `
    <div class="ui-slider">
      <input
        type="range"
        [min]="min()" [max]="max()" [step]="step()"
        [value]="value()"
        [disabled]="disabled()"
        [style.--ui-fill.%]="fillPct()"
        [attr.aria-label]="label()"
        (input)="handleInput($event)"
        (blur)="onTouched()" />
      @if (showValue()) { <span class="val">{{ value() }}</span> }
    </div>
  `, isInline: true, styles: [":host{display:block}.ui-slider{display:flex;align-items:center;gap:var(--ui-space-3)}input[type=range]{flex:1;appearance:none;height:6px;border-radius:999px;outline:none;cursor:pointer;background:linear-gradient(to right,var(--ui-color-primary) var(--ui-fill, 0%),var(--ui-color-surface-raised) var(--ui-fill, 0%))}input[type=range]:disabled{opacity:.5;cursor:not-allowed}input[type=range]::-webkit-slider-thumb{appearance:none;width:16px;height:16px;border-radius:50%;background:#fff;border:1px solid var(--ui-color-border);box-shadow:var(--ui-shadow-1);cursor:pointer}input[type=range]::-moz-range-thumb{width:16px;height:16px;border-radius:50%;background:#fff;border:1px solid var(--ui-color-border);cursor:pointer}input[type=range]:focus-visible{box-shadow:var(--ui-focus-ring)}.val{min-width:2.5ch;text-align:right;font-family:var(--ui-font-mono);font-size:var(--ui-font-size-sm);color:var(--ui-color-text-muted)}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiSlider, decorators: [{
            type: Component,
            args: [{ selector: 'ui-slider', template: `
    <div class="ui-slider">
      <input
        type="range"
        [min]="min()" [max]="max()" [step]="step()"
        [value]="value()"
        [disabled]="disabled()"
        [style.--ui-fill.%]="fillPct()"
        [attr.aria-label]="label()"
        (input)="handleInput($event)"
        (blur)="onTouched()" />
      @if (showValue()) { <span class="val">{{ value() }}</span> }
    </div>
  `, providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiSlider), multi: true }], styles: [":host{display:block}.ui-slider{display:flex;align-items:center;gap:var(--ui-space-3)}input[type=range]{flex:1;appearance:none;height:6px;border-radius:999px;outline:none;cursor:pointer;background:linear-gradient(to right,var(--ui-color-primary) var(--ui-fill, 0%),var(--ui-color-surface-raised) var(--ui-fill, 0%))}input[type=range]:disabled{opacity:.5;cursor:not-allowed}input[type=range]::-webkit-slider-thumb{appearance:none;width:16px;height:16px;border-radius:50%;background:#fff;border:1px solid var(--ui-color-border);box-shadow:var(--ui-shadow-1);cursor:pointer}input[type=range]::-moz-range-thumb{width:16px;height:16px;border-radius:50%;background:#fff;border:1px solid var(--ui-color-border);cursor:pointer}input[type=range]:focus-visible{box-shadow:var(--ui-focus-ring)}.val{min-width:2.5ch;text-align:right;font-family:var(--ui-font-mono);font-size:var(--ui-font-size-sm);color:var(--ui-color-text-muted)}\n"] }]
        }], propDecorators: { min: [{ type: i0.Input, args: [{ isSignal: true, alias: "min", required: false }] }], max: [{ type: i0.Input, args: [{ isSignal: true, alias: "max", required: false }] }], step: [{ type: i0.Input, args: [{ isSignal: true, alias: "step", required: false }] }], label: [{ type: i0.Input, args: [{ isSignal: true, alias: "label", required: false }] }], showValue: [{ type: i0.Input, args: [{ isSignal: true, alias: "showValue", required: false }] }] } });

/** `ui-checkbox-group` — multi-select checkbox set (CVA; value is string[]). */
class UiCheckboxGroup {
    options = input([], /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "options" }] : /* istanbul ignore next */ []));
    label = input(/* @ts-ignore */
    ...(ngDevMode ? [undefined, { debugName: "label" }] : /* istanbul ignore next */ []));
    orientation = input('vertical', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "orientation" }] : /* istanbul ignore next */ []));
    selected = signal(new Set(), /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "selected" }] : /* istanbul ignore next */ []));
    disabled = signal(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "disabled" }] : /* istanbul ignore next */ []));
    onChange = () => { };
    onTouched = () => { };
    writeValue(v) { this.selected.set(new Set(v ?? [])); }
    registerOnChange(fn) { this.onChange = fn; }
    registerOnTouched(fn) { this.onTouched = fn; }
    setDisabledState(d) { this.disabled.set(d); }
    toggle(value) {
        const next = new Set(this.selected());
        next.has(value) ? next.delete(value) : next.add(value);
        this.selected.set(next);
        this.onChange([...next]);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiCheckboxGroup, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "22.0.4", type: UiCheckboxGroup, isStandalone: true, selector: "ui-checkbox-group", inputs: { options: { classPropertyName: "options", publicName: "options", isSignal: true, isRequired: false, transformFunction: null }, label: { classPropertyName: "label", publicName: "label", isSignal: true, isRequired: false, transformFunction: null }, orientation: { classPropertyName: "orientation", publicName: "orientation", isSignal: true, isRequired: false, transformFunction: null } }, providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiCheckboxGroup), multi: true }], ngImport: i0, template: `
    <div class="grp" role="group" [attr.aria-label]="label()" [class.row]="orientation() === 'horizontal'">
      @for (opt of options(); track opt.value) {
        <label class="opt" [class.disabled]="disabled() || opt.disabled">
          <input type="checkbox" class="native"
                 [checked]="selected().has(opt.value)"
                 [disabled]="disabled() || !!opt.disabled"
                 (change)="toggle(opt.value)" (blur)="onTouched()" />
          <span class="box" aria-hidden="true">
            <svg viewBox="0 0 16 16" class="tick"><path d="M3 8.5l3 3 7-7" /></svg>
          </span>
          <span class="text">{{ opt.label }}</span>
        </label>
      }
    </div>
  `, isInline: true, styles: [":host{display:block}.grp{display:flex;flex-direction:column;gap:var(--ui-space-2)}.grp.row{flex-direction:row;flex-wrap:wrap;gap:var(--ui-space-4)}.opt{display:inline-flex;align-items:center;gap:var(--ui-space-2);cursor:pointer;font-family:var(--ui-font-default);font-size:var(--ui-font-size-md);color:var(--ui-color-text)}.opt.disabled{opacity:.55;cursor:not-allowed}.native{position:absolute;opacity:0;width:0;height:0}.box{display:inline-flex;align-items:center;justify-content:center;width:18px;height:18px;flex:none;border:1px solid var(--ui-color-border);border-radius:5px;background:var(--ui-color-surface);transition:background var(--ui-motion-fast) var(--ui-ease-standard),border-color var(--ui-motion-fast) var(--ui-ease-standard)}.tick{width:12px;height:12px;fill:none;stroke:var(--ui-color-primary-contrast);stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:16;stroke-dashoffset:16;transition:stroke-dashoffset var(--ui-motion-base) var(--ui-ease-standard)}.native:checked+.box{background:var(--ui-color-primary);border-color:var(--ui-color-primary)}.native:checked+.box .tick{stroke-dashoffset:0}.native:focus-visible+.box{box-shadow:var(--ui-focus-ring)}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiCheckboxGroup, decorators: [{
            type: Component,
            args: [{ selector: 'ui-checkbox-group', template: `
    <div class="grp" role="group" [attr.aria-label]="label()" [class.row]="orientation() === 'horizontal'">
      @for (opt of options(); track opt.value) {
        <label class="opt" [class.disabled]="disabled() || opt.disabled">
          <input type="checkbox" class="native"
                 [checked]="selected().has(opt.value)"
                 [disabled]="disabled() || !!opt.disabled"
                 (change)="toggle(opt.value)" (blur)="onTouched()" />
          <span class="box" aria-hidden="true">
            <svg viewBox="0 0 16 16" class="tick"><path d="M3 8.5l3 3 7-7" /></svg>
          </span>
          <span class="text">{{ opt.label }}</span>
        </label>
      }
    </div>
  `, providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiCheckboxGroup), multi: true }], styles: [":host{display:block}.grp{display:flex;flex-direction:column;gap:var(--ui-space-2)}.grp.row{flex-direction:row;flex-wrap:wrap;gap:var(--ui-space-4)}.opt{display:inline-flex;align-items:center;gap:var(--ui-space-2);cursor:pointer;font-family:var(--ui-font-default);font-size:var(--ui-font-size-md);color:var(--ui-color-text)}.opt.disabled{opacity:.55;cursor:not-allowed}.native{position:absolute;opacity:0;width:0;height:0}.box{display:inline-flex;align-items:center;justify-content:center;width:18px;height:18px;flex:none;border:1px solid var(--ui-color-border);border-radius:5px;background:var(--ui-color-surface);transition:background var(--ui-motion-fast) var(--ui-ease-standard),border-color var(--ui-motion-fast) var(--ui-ease-standard)}.tick{width:12px;height:12px;fill:none;stroke:var(--ui-color-primary-contrast);stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:16;stroke-dashoffset:16;transition:stroke-dashoffset var(--ui-motion-base) var(--ui-ease-standard)}.native:checked+.box{background:var(--ui-color-primary);border-color:var(--ui-color-primary)}.native:checked+.box .tick{stroke-dashoffset:0}.native:focus-visible+.box{box-shadow:var(--ui-focus-ring)}\n"] }]
        }], propDecorators: { options: [{ type: i0.Input, args: [{ isSignal: true, alias: "options", required: false }] }], label: [{ type: i0.Input, args: [{ isSignal: true, alias: "label", required: false }] }], orientation: [{ type: i0.Input, args: [{ isSignal: true, alias: "orientation", required: false }] }] } });

/** `ui-rating` — star rating (CVA). */
class UiRating {
    max = input(5, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "max" }] : /* istanbul ignore next */ []));
    label = input('Rating', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "label" }] : /* istanbul ignore next */ []));
    value = signal(0, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "value" }] : /* istanbul ignore next */ []));
    hover = signal(0, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "hover" }] : /* istanbul ignore next */ []));
    disabled = signal(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "disabled" }] : /* istanbul ignore next */ []));
    onChange = () => { };
    onTouched = () => { };
    stars() {
        return Array.from({ length: this.max() }, (_, i) => i + 1);
    }
    writeValue(v) { this.value.set(v ?? 0); }
    registerOnChange(fn) { this.onChange = fn; }
    registerOnTouched(fn) { this.onTouched = fn; }
    setDisabledState(d) { this.disabled.set(d); }
    set(v) {
        const next = this.value() === v ? 0 : v;
        this.value.set(next);
        this.onChange(next);
        this.onTouched();
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiRating, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "22.0.4", type: UiRating, isStandalone: true, selector: "ui-rating", inputs: { max: { classPropertyName: "max", publicName: "max", isSignal: true, isRequired: false, transformFunction: null }, label: { classPropertyName: "label", publicName: "label", isSignal: true, isRequired: false, transformFunction: null } }, providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiRating), multi: true }], ngImport: i0, template: `
    <div class="ui-rating" role="radiogroup" [attr.aria-label]="label()">
      @for (i of stars(); track i) {
        <button
          type="button"
          class="star"
          [class.filled]="i <= (hover() || value())"
          role="radio"
          [attr.aria-checked]="i === value()"
          [attr.aria-label]="i + ' of ' + max()"
          [disabled]="disabled()"
          (click)="set(i)"
          (mouseenter)="hover.set(i)"
          (mouseleave)="hover.set(0)">★</button>
      }
    </div>
  `, isInline: true, styles: [":host{display:inline-block}.ui-rating{display:inline-flex;gap:2px}.star{border:none;background:none;cursor:pointer;padding:0 1px;font-size:20px;line-height:1;color:var(--ui-color-border);transition:color var(--ui-motion-fast) var(--ui-ease-standard)}.star.filled{color:var(--ui-color-warning)}.star:disabled{cursor:not-allowed}.star:focus-visible{outline:none;box-shadow:var(--ui-focus-ring);border-radius:4px}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiRating, decorators: [{
            type: Component,
            args: [{ selector: 'ui-rating', template: `
    <div class="ui-rating" role="radiogroup" [attr.aria-label]="label()">
      @for (i of stars(); track i) {
        <button
          type="button"
          class="star"
          [class.filled]="i <= (hover() || value())"
          role="radio"
          [attr.aria-checked]="i === value()"
          [attr.aria-label]="i + ' of ' + max()"
          [disabled]="disabled()"
          (click)="set(i)"
          (mouseenter)="hover.set(i)"
          (mouseleave)="hover.set(0)">★</button>
      }
    </div>
  `, providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiRating), multi: true }], styles: [":host{display:inline-block}.ui-rating{display:inline-flex;gap:2px}.star{border:none;background:none;cursor:pointer;padding:0 1px;font-size:20px;line-height:1;color:var(--ui-color-border);transition:color var(--ui-motion-fast) var(--ui-ease-standard)}.star.filled{color:var(--ui-color-warning)}.star:disabled{cursor:not-allowed}.star:focus-visible{outline:none;box-shadow:var(--ui-focus-ring);border-radius:4px}\n"] }]
        }], propDecorators: { max: [{ type: i0.Input, args: [{ isSignal: true, alias: "max", required: false }] }], label: [{ type: i0.Input, args: [{ isSignal: true, alias: "label", required: false }] }] } });

/** `ui-otp-input` — fixed-length one-time-code entry (CVA; value is the joined string). */
class UiOtpInput {
    host = inject(ElementRef);
    length = input(6, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "length" }] : /* istanbul ignore next */ []));
    numeric = input(true, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "numeric" }] : /* istanbul ignore next */ []));
    chars = signal([], /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "chars" }] : /* istanbul ignore next */ []));
    disabled = signal(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "disabled" }] : /* istanbul ignore next */ []));
    onChange = () => { };
    onTouched = () => { };
    slots() {
        return Array.from({ length: this.length() }, (_, i) => i);
    }
    writeValue(v) { this.chars.set((v ?? '').slice(0, this.length()).split('')); }
    registerOnChange(fn) { this.onChange = fn; }
    registerOnTouched(fn) { this.onTouched = fn; }
    setDisabledState(d) { this.disabled.set(d); }
    onInput(e, index) {
        const input = e.target;
        let ch = input.value.slice(-1);
        if (this.numeric() && ch && !/[0-9]/.test(ch)) {
            input.value = this.chars()[index] || '';
            return;
        }
        const next = [...this.chars()];
        next[index] = ch;
        this.chars.set(next);
        this.emit();
        if (ch)
            this.focusCell(index + 1);
    }
    onKeydown(e, index) {
        if (e.key === 'Backspace' && !this.chars()[index]) {
            this.focusCell(index - 1);
        }
        else if (e.key === 'ArrowLeft')
            this.focusCell(index - 1);
        else if (e.key === 'ArrowRight')
            this.focusCell(index + 1);
    }
    select(e) { e.target.select(); }
    emit() {
        this.onChange(this.chars().join(''));
    }
    focusCell(i) {
        const cells = this.host.nativeElement.querySelectorAll('.cell');
        cells[i]?.focus();
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiOtpInput, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "22.0.4", type: UiOtpInput, isStandalone: true, selector: "ui-otp-input", inputs: { length: { classPropertyName: "length", publicName: "length", isSignal: true, isRequired: false, transformFunction: null }, numeric: { classPropertyName: "numeric", publicName: "numeric", isSignal: true, isRequired: false, transformFunction: null } }, providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiOtpInput), multi: true }], ngImport: i0, template: `
    <div class="ui-otp" role="group" aria-label="One-time code">
      @for (i of slots(); track i) {
        <input
          class="cell"
          [attr.inputmode]="numeric() ? 'numeric' : 'text'"
          maxlength="1"
          [value]="chars()[i] || ''"
          [disabled]="disabled()"
          [attr.aria-label]="'Digit ' + (i + 1)"
          (input)="onInput($event, i)"
          (keydown)="onKeydown($event, i)"
          (focus)="select($event)"
          (blur)="onTouched()" />
      }
    </div>
  `, isInline: true, styles: [":host{display:block}.ui-otp{display:inline-flex;gap:var(--ui-space-2)}.cell{width:var(--ui-size-md);height:var(--ui-size-lg);text-align:center;border:1px solid var(--ui-color-border);border-radius:var(--ui-radius);background:var(--ui-color-surface);color:var(--ui-color-text);font-family:var(--ui-font-mono);font-size:var(--ui-font-size-lg);outline:none;transition:border-color var(--ui-motion-fast) var(--ui-ease-standard),box-shadow var(--ui-motion-fast) var(--ui-ease-standard)}.cell:focus{border-color:var(--ui-color-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--ui-color-primary) 30%,transparent)}.cell:disabled{opacity:.55}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiOtpInput, decorators: [{
            type: Component,
            args: [{ selector: 'ui-otp-input', template: `
    <div class="ui-otp" role="group" aria-label="One-time code">
      @for (i of slots(); track i) {
        <input
          class="cell"
          [attr.inputmode]="numeric() ? 'numeric' : 'text'"
          maxlength="1"
          [value]="chars()[i] || ''"
          [disabled]="disabled()"
          [attr.aria-label]="'Digit ' + (i + 1)"
          (input)="onInput($event, i)"
          (keydown)="onKeydown($event, i)"
          (focus)="select($event)"
          (blur)="onTouched()" />
      }
    </div>
  `, providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiOtpInput), multi: true }], styles: [":host{display:block}.ui-otp{display:inline-flex;gap:var(--ui-space-2)}.cell{width:var(--ui-size-md);height:var(--ui-size-lg);text-align:center;border:1px solid var(--ui-color-border);border-radius:var(--ui-radius);background:var(--ui-color-surface);color:var(--ui-color-text);font-family:var(--ui-font-mono);font-size:var(--ui-font-size-lg);outline:none;transition:border-color var(--ui-motion-fast) var(--ui-ease-standard),box-shadow var(--ui-motion-fast) var(--ui-ease-standard)}.cell:focus{border-color:var(--ui-color-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--ui-color-primary) 30%,transparent)}.cell:disabled{opacity:.55}\n"] }]
        }], propDecorators: { length: [{ type: i0.Input, args: [{ isSignal: true, alias: "length", required: false }] }], numeric: [{ type: i0.Input, args: [{ isSignal: true, alias: "numeric", required: false }] }] } });

/** `ui-chip-input` — tokenized text entry (CVA; value is string[]). Enter adds, Backspace removes. */
class UiChipInput {
    config = inject(UI_CONFIG);
    placeholder = input('Add tag…', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "placeholder" }] : /* istanbul ignore next */ []));
    radius = input(this.config.radius, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "radius" }] : /* istanbul ignore next */ []));
    chips = signal([], /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "chips" }] : /* istanbul ignore next */ []));
    disabled = signal(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "disabled" }] : /* istanbul ignore next */ []));
    onChange = () => { };
    onTouched = () => { };
    writeValue(v) { this.chips.set(v ?? []); }
    registerOnChange(fn) { this.onChange = fn; }
    registerOnTouched(fn) { this.onTouched = fn; }
    setDisabledState(d) { this.disabled.set(d); }
    onKey(e) {
        const input = e.target;
        if ((e.key === 'Enter' || e.key === ',') && input.value.trim()) {
            e.preventDefault();
            this.chips.update((c) => [...c, input.value.trim()]);
            input.value = '';
            this.onChange(this.chips());
        }
        else if (e.key === 'Backspace' && !input.value && this.chips().length) {
            this.chips.update((c) => c.slice(0, -1));
            this.onChange(this.chips());
        }
    }
    removeAt(i, e) {
        e.stopPropagation();
        this.chips.update((c) => c.filter((_, idx) => idx !== i));
        this.onChange(this.chips());
    }
    focusInput() { }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiChipInput, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "22.0.4", type: UiChipInput, isStandalone: true, selector: "ui-chip-input", inputs: { placeholder: { classPropertyName: "placeholder", publicName: "placeholder", isSignal: true, isRequired: false, transformFunction: null }, radius: { classPropertyName: "radius", publicName: "radius", isSignal: true, isRequired: false, transformFunction: null } }, providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiChipInput), multi: true }], ngImport: i0, template: `
    <div class="ci" [class.no-radius]="!radius()" (click)="focusInput()">
      @for (chip of chips(); track $index) {
        <span class="chip">{{ chip }}<button type="button" class="x" tabindex="-1" aria-label="Remove" (click)="removeAt($index, $event)">×</button></span>
      }
      <input #inp class="entry" [attr.placeholder]="chips().length ? '' : placeholder()"
             [disabled]="disabled()" (keydown)="onKey($event)" (blur)="onTouched()" />
    </div>
  `, isInline: true, styles: [":host{display:block}.ci{display:flex;flex-wrap:wrap;gap:var(--ui-space-1);align-items:center;min-height:var(--ui-size-md);padding:3px var(--ui-space-2);background:var(--ui-color-surface);border:1px solid var(--ui-color-border);border-radius:var(--ui-radius);cursor:text;transition:border-color var(--ui-motion-base) var(--ui-ease-standard),box-shadow var(--ui-motion-base) var(--ui-ease-standard)}.ci:focus-within{border-color:var(--ui-color-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--ui-color-primary) 30%,transparent)}.ci.no-radius{border-radius:0}.chip{display:inline-flex;align-items:center;gap:2px;height:22px;padding:0 var(--ui-space-2);background:color-mix(in srgb,var(--ui-color-primary) 18%,transparent);border:1px solid var(--ui-color-primary);border-radius:999px;font-family:var(--ui-font-default);font-size:var(--ui-font-size-sm);color:var(--ui-color-text)}.x{border:none;background:none;color:inherit;cursor:pointer;font-size:13px;line-height:1;padding:0}.entry{flex:1;min-width:80px;border:none;background:transparent;outline:none;color:var(--ui-color-text);font-family:var(--ui-font-default);font-size:var(--ui-font-size-md);height:22px}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiChipInput, decorators: [{
            type: Component,
            args: [{ selector: 'ui-chip-input', template: `
    <div class="ci" [class.no-radius]="!radius()" (click)="focusInput()">
      @for (chip of chips(); track $index) {
        <span class="chip">{{ chip }}<button type="button" class="x" tabindex="-1" aria-label="Remove" (click)="removeAt($index, $event)">×</button></span>
      }
      <input #inp class="entry" [attr.placeholder]="chips().length ? '' : placeholder()"
             [disabled]="disabled()" (keydown)="onKey($event)" (blur)="onTouched()" />
    </div>
  `, providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiChipInput), multi: true }], styles: [":host{display:block}.ci{display:flex;flex-wrap:wrap;gap:var(--ui-space-1);align-items:center;min-height:var(--ui-size-md);padding:3px var(--ui-space-2);background:var(--ui-color-surface);border:1px solid var(--ui-color-border);border-radius:var(--ui-radius);cursor:text;transition:border-color var(--ui-motion-base) var(--ui-ease-standard),box-shadow var(--ui-motion-base) var(--ui-ease-standard)}.ci:focus-within{border-color:var(--ui-color-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--ui-color-primary) 30%,transparent)}.ci.no-radius{border-radius:0}.chip{display:inline-flex;align-items:center;gap:2px;height:22px;padding:0 var(--ui-space-2);background:color-mix(in srgb,var(--ui-color-primary) 18%,transparent);border:1px solid var(--ui-color-primary);border-radius:999px;font-family:var(--ui-font-default);font-size:var(--ui-font-size-sm);color:var(--ui-color-text)}.x{border:none;background:none;color:inherit;cursor:pointer;font-size:13px;line-height:1;padding:0}.entry{flex:1;min-width:80px;border:none;background:transparent;outline:none;color:var(--ui-color-text);font-family:var(--ui-font-default);font-size:var(--ui-font-size-md);height:22px}\n"] }]
        }], propDecorators: { placeholder: [{ type: i0.Input, args: [{ isSignal: true, alias: "placeholder", required: false }] }], radius: [{ type: i0.Input, args: [{ isSignal: true, alias: "radius", required: false }] }] } });

/** `ui-editable-text` — click-to-edit inline text (CVA). Enter commits, Escape cancels. */
class UiEditableText {
    placeholder = input('Empty', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "placeholder" }] : /* istanbul ignore next */ []));
    inp = viewChild('inp', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "inp" }] : /* istanbul ignore next */ []));
    value = signal('', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "value" }] : /* istanbul ignore next */ []));
    draft = signal('', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "draft" }] : /* istanbul ignore next */ []));
    editing = signal(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "editing" }] : /* istanbul ignore next */ []));
    disabled = signal(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "disabled" }] : /* istanbul ignore next */ []));
    onChange = () => { };
    onTouched = () => { };
    writeValue(v) { this.value.set(v ?? ''); }
    registerOnChange(fn) { this.onChange = fn; }
    registerOnTouched(fn) { this.onTouched = fn; }
    setDisabledState(d) { this.disabled.set(d); }
    edit() {
        if (this.disabled())
            return;
        this.draft.set(this.value());
        this.editing.set(true);
        queueMicrotask(() => { const el = this.inp()?.nativeElement; el?.focus(); el?.select(); });
    }
    commit() {
        if (!this.editing())
            return;
        this.value.set(this.draft());
        this.editing.set(false);
        this.onChange(this.value());
        this.onTouched();
    }
    cancel() { this.editing.set(false); }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiEditableText, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "22.0.4", type: UiEditableText, isStandalone: true, selector: "ui-editable-text", inputs: { placeholder: { classPropertyName: "placeholder", publicName: "placeholder", isSignal: true, isRequired: false, transformFunction: null } }, providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiEditableText), multi: true }], viewQueries: [{ propertyName: "inp", first: true, predicate: ["inp"], descendants: true, isSignal: true }], ngImport: i0, template: `
    @if (editing()) {
      <input #inp class="edit" [value]="draft()" [disabled]="disabled()"
             (input)="draft.set($any($event.target).value)"
             (keydown.enter)="commit()" (keydown.escape)="cancel()" (blur)="commit()" />
    } @else {
      <button type="button" class="view" [disabled]="disabled()" (click)="edit()">
        <span [class.placeholder]="!value()">{{ value() || placeholder() }}</span>
        <span class="pencil" aria-hidden="true">✎</span>
      </button>
    }
  `, isInline: true, styles: [":host{display:inline-block}.view{display:inline-flex;align-items:center;gap:var(--ui-space-2);background:none;border:1px solid transparent;border-radius:var(--ui-radius);padding:2px var(--ui-space-2);cursor:text;color:var(--ui-color-text);font-family:var(--ui-font-default);font-size:var(--ui-font-size-md)}.view:hover{border-color:var(--ui-color-border)}.view:focus-visible{outline:none;box-shadow:var(--ui-focus-ring)}.placeholder{color:var(--ui-color-text-muted)}.pencil{opacity:0;font-size:12px;color:var(--ui-color-text-muted)}.view:hover .pencil{opacity:1}.edit{padding:2px var(--ui-space-2);background:var(--ui-color-surface);border:1px solid var(--ui-color-primary);border-radius:var(--ui-radius);color:var(--ui-color-text);font-family:var(--ui-font-default);font-size:var(--ui-font-size-md);outline:none;box-shadow:0 0 0 3px color-mix(in srgb,var(--ui-color-primary) 30%,transparent)}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiEditableText, decorators: [{
            type: Component,
            args: [{ selector: 'ui-editable-text', template: `
    @if (editing()) {
      <input #inp class="edit" [value]="draft()" [disabled]="disabled()"
             (input)="draft.set($any($event.target).value)"
             (keydown.enter)="commit()" (keydown.escape)="cancel()" (blur)="commit()" />
    } @else {
      <button type="button" class="view" [disabled]="disabled()" (click)="edit()">
        <span [class.placeholder]="!value()">{{ value() || placeholder() }}</span>
        <span class="pencil" aria-hidden="true">✎</span>
      </button>
    }
  `, providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiEditableText), multi: true }], styles: [":host{display:inline-block}.view{display:inline-flex;align-items:center;gap:var(--ui-space-2);background:none;border:1px solid transparent;border-radius:var(--ui-radius);padding:2px var(--ui-space-2);cursor:text;color:var(--ui-color-text);font-family:var(--ui-font-default);font-size:var(--ui-font-size-md)}.view:hover{border-color:var(--ui-color-border)}.view:focus-visible{outline:none;box-shadow:var(--ui-focus-ring)}.placeholder{color:var(--ui-color-text-muted)}.pencil{opacity:0;font-size:12px;color:var(--ui-color-text-muted)}.view:hover .pencil{opacity:1}.edit{padding:2px var(--ui-space-2);background:var(--ui-color-surface);border:1px solid var(--ui-color-primary);border-radius:var(--ui-radius);color:var(--ui-color-text);font-family:var(--ui-font-default);font-size:var(--ui-font-size-md);outline:none;box-shadow:0 0 0 3px color-mix(in srgb,var(--ui-color-primary) 30%,transparent)}\n"] }]
        }], propDecorators: { placeholder: [{ type: i0.Input, args: [{ isSignal: true, alias: "placeholder", required: false }] }], inp: [{ type: i0.ViewChild, args: ['inp', { isSignal: true }] }] } });

/** `ui-color-picker` — native color well + hex field + preset swatches (CVA; value is hex). */
class UiColorPicker {
    config = inject(UI_CONFIG);
    radius = input(this.config.radius, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "radius" }] : /* istanbul ignore next */ []));
    swatches = input(['#3d5afe', '#2faa6e', '#d9a521', '#e5484d', '#8a8f98', '#e8eaed'], /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "swatches" }] : /* istanbul ignore next */ []));
    value = signal('#3d5afe', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "value" }] : /* istanbul ignore next */ []));
    disabled = signal(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "disabled" }] : /* istanbul ignore next */ []));
    onChange = () => { };
    onTouched = () => { };
    writeValue(v) { if (v)
        this.value.set(v); }
    registerOnChange(fn) { this.onChange = fn; }
    registerOnTouched(fn) { this.onTouched = fn; }
    setDisabledState(d) { this.disabled.set(d); }
    set(v) {
        this.value.set(v);
        this.onChange(v);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiColorPicker, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "22.0.4", type: UiColorPicker, isStandalone: true, selector: "ui-color-picker", inputs: { radius: { classPropertyName: "radius", publicName: "radius", isSignal: true, isRequired: false, transformFunction: null }, swatches: { classPropertyName: "swatches", publicName: "swatches", isSignal: true, isRequired: false, transformFunction: null } }, providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiColorPicker), multi: true }], ngImport: i0, template: `
    <div class="cp" [class.no-radius]="!radius()">
      <label class="well" [style.background]="value()">
        <input type="color" [value]="value()" [disabled]="disabled()" (input)="set($any($event.target).value)" aria-label="Pick color" />
      </label>
      <input class="hex" [value]="value()" [disabled]="disabled()" (input)="set($any($event.target).value)" (blur)="onTouched()" aria-label="Hex color" />
      <div class="swatches">
        @for (c of swatches(); track c) {
          <button type="button" class="sw" [style.background]="c" [attr.aria-label]="c" (click)="set(c)"></button>
        }
      </div>
    </div>
  `, isInline: true, styles: [":host{display:block}.cp{display:flex;align-items:center;gap:var(--ui-space-2)}.well{width:var(--ui-size-md);height:var(--ui-size-md);border-radius:var(--ui-radius);border:1px solid var(--ui-color-border);overflow:hidden;cursor:pointer;flex:none}.cp.no-radius .well,.cp.no-radius .hex{border-radius:0}.well input{opacity:0;width:100%;height:100%;cursor:pointer}.hex{width:92px;height:var(--ui-size-md);padding:0 var(--ui-space-2);background:var(--ui-color-surface);border:1px solid var(--ui-color-border);border-radius:var(--ui-radius);color:var(--ui-color-text);font-family:var(--ui-font-mono);font-size:var(--ui-font-size-sm);outline:none}.hex:focus{border-color:var(--ui-color-primary)}.swatches{display:flex;gap:4px}.sw{width:20px;height:20px;border-radius:50%;border:1px solid var(--ui-color-border);cursor:pointer;padding:0}.sw:focus-visible{outline:none;box-shadow:var(--ui-focus-ring)}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiColorPicker, decorators: [{
            type: Component,
            args: [{ selector: 'ui-color-picker', template: `
    <div class="cp" [class.no-radius]="!radius()">
      <label class="well" [style.background]="value()">
        <input type="color" [value]="value()" [disabled]="disabled()" (input)="set($any($event.target).value)" aria-label="Pick color" />
      </label>
      <input class="hex" [value]="value()" [disabled]="disabled()" (input)="set($any($event.target).value)" (blur)="onTouched()" aria-label="Hex color" />
      <div class="swatches">
        @for (c of swatches(); track c) {
          <button type="button" class="sw" [style.background]="c" [attr.aria-label]="c" (click)="set(c)"></button>
        }
      </div>
    </div>
  `, providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiColorPicker), multi: true }], styles: [":host{display:block}.cp{display:flex;align-items:center;gap:var(--ui-space-2)}.well{width:var(--ui-size-md);height:var(--ui-size-md);border-radius:var(--ui-radius);border:1px solid var(--ui-color-border);overflow:hidden;cursor:pointer;flex:none}.cp.no-radius .well,.cp.no-radius .hex{border-radius:0}.well input{opacity:0;width:100%;height:100%;cursor:pointer}.hex{width:92px;height:var(--ui-size-md);padding:0 var(--ui-space-2);background:var(--ui-color-surface);border:1px solid var(--ui-color-border);border-radius:var(--ui-radius);color:var(--ui-color-text);font-family:var(--ui-font-mono);font-size:var(--ui-font-size-sm);outline:none}.hex:focus{border-color:var(--ui-color-primary)}.swatches{display:flex;gap:4px}.sw{width:20px;height:20px;border-radius:50%;border:1px solid var(--ui-color-border);cursor:pointer;padding:0}.sw:focus-visible{outline:none;box-shadow:var(--ui-focus-ring)}\n"] }]
        }], propDecorators: { radius: [{ type: i0.Input, args: [{ isSignal: true, alias: "radius", required: false }] }], swatches: [{ type: i0.Input, args: [{ isSignal: true, alias: "swatches", required: false }] }] } });

/** `ui-file-upload` — drag-and-drop / click dropzone. Emits `(filesSelected)`. */
class UiFileUpload {
    multiple = input(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "multiple" }] : /* istanbul ignore next */ []));
    accept = input(/* @ts-ignore */
    ...(ngDevMode ? [undefined, { debugName: "accept" }] : /* istanbul ignore next */ []));
    radius = input(true, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "radius" }] : /* istanbul ignore next */ []));
    filesSelected = output();
    files = signal([], /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "files" }] : /* istanbul ignore next */ []));
    dragOver = signal(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "dragOver" }] : /* istanbul ignore next */ []));
    onDragOver(e) { e.preventDefault(); this.dragOver.set(true); }
    onDrop(e) {
        e.preventDefault();
        this.dragOver.set(false);
        this.commit(Array.from(e.dataTransfer?.files ?? []));
    }
    onPick(e) {
        this.commit(Array.from(e.target.files ?? []));
    }
    commit(list) {
        const files = this.multiple() ? list : list.slice(0, 1);
        this.files.set(files);
        this.filesSelected.emit(files);
    }
    size(bytes) {
        if (bytes < 1024)
            return `${bytes} B`;
        if (bytes < 1024 * 1024)
            return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiFileUpload, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "22.0.4", type: UiFileUpload, isStandalone: true, selector: "ui-file-upload", inputs: { multiple: { classPropertyName: "multiple", publicName: "multiple", isSignal: true, isRequired: false, transformFunction: null }, accept: { classPropertyName: "accept", publicName: "accept", isSignal: true, isRequired: false, transformFunction: null }, radius: { classPropertyName: "radius", publicName: "radius", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { filesSelected: "filesSelected" }, ngImport: i0, template: `
    <label class="dz" [class.over]="dragOver()" [class.no-radius]="!radius()"
           (dragover)="onDragOver($event)" (dragleave)="dragOver.set(false)" (drop)="onDrop($event)">
      <input type="file" class="native" [multiple]="multiple()" [attr.accept]="accept()" (change)="onPick($event)" />
      <span class="icon" aria-hidden="true">⬆</span>
      <span class="hint"><strong>Click to upload</strong> or drag & drop</span>
      @if (accept()) { <span class="accept">{{ accept() }}</span> }
    </label>
    @if (files().length) {
      <ul class="files">
        @for (f of files(); track f.name) {
          <li><span class="fn">{{ f.name }}</span><span class="sz">{{ size(f.size) }}</span></li>
        }
      </ul>
    }
  `, isInline: true, styles: [":host{display:block}.dz{display:flex;flex-direction:column;align-items:center;gap:var(--ui-space-1);padding:var(--ui-space-6) var(--ui-space-4);text-align:center;cursor:pointer;border:1px dashed var(--ui-color-border);border-radius:var(--ui-radius);background:var(--ui-color-surface);font-family:var(--ui-font-default);transition:border-color var(--ui-motion-base) var(--ui-ease-standard),background var(--ui-motion-base) var(--ui-ease-standard)}.dz.no-radius{border-radius:0}.dz:hover,.dz.over{border-color:var(--ui-color-primary);background:color-mix(in srgb,var(--ui-color-primary) 8%,var(--ui-color-surface))}.native{position:absolute;width:0;height:0;opacity:0}.icon{font-size:22px;color:var(--ui-color-text-muted)}.hint{font-size:var(--ui-font-size-md);color:var(--ui-color-text)}.accept{font-size:var(--ui-font-size-sm);color:var(--ui-color-text-muted)}.files{margin:var(--ui-space-2) 0 0;padding:0;list-style:none;display:flex;flex-direction:column;gap:2px}.files li{display:flex;justify-content:space-between;gap:var(--ui-space-3);padding:var(--ui-space-1) var(--ui-space-2);background:var(--ui-color-surface-raised);border-radius:6px;font-family:var(--ui-font-default);font-size:var(--ui-font-size-sm)}.sz{color:var(--ui-color-text-muted)}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiFileUpload, decorators: [{
            type: Component,
            args: [{ selector: 'ui-file-upload', template: `
    <label class="dz" [class.over]="dragOver()" [class.no-radius]="!radius()"
           (dragover)="onDragOver($event)" (dragleave)="dragOver.set(false)" (drop)="onDrop($event)">
      <input type="file" class="native" [multiple]="multiple()" [attr.accept]="accept()" (change)="onPick($event)" />
      <span class="icon" aria-hidden="true">⬆</span>
      <span class="hint"><strong>Click to upload</strong> or drag & drop</span>
      @if (accept()) { <span class="accept">{{ accept() }}</span> }
    </label>
    @if (files().length) {
      <ul class="files">
        @for (f of files(); track f.name) {
          <li><span class="fn">{{ f.name }}</span><span class="sz">{{ size(f.size) }}</span></li>
        }
      </ul>
    }
  `, styles: [":host{display:block}.dz{display:flex;flex-direction:column;align-items:center;gap:var(--ui-space-1);padding:var(--ui-space-6) var(--ui-space-4);text-align:center;cursor:pointer;border:1px dashed var(--ui-color-border);border-radius:var(--ui-radius);background:var(--ui-color-surface);font-family:var(--ui-font-default);transition:border-color var(--ui-motion-base) var(--ui-ease-standard),background var(--ui-motion-base) var(--ui-ease-standard)}.dz.no-radius{border-radius:0}.dz:hover,.dz.over{border-color:var(--ui-color-primary);background:color-mix(in srgb,var(--ui-color-primary) 8%,var(--ui-color-surface))}.native{position:absolute;width:0;height:0;opacity:0}.icon{font-size:22px;color:var(--ui-color-text-muted)}.hint{font-size:var(--ui-font-size-md);color:var(--ui-color-text)}.accept{font-size:var(--ui-font-size-sm);color:var(--ui-color-text-muted)}.files{margin:var(--ui-space-2) 0 0;padding:0;list-style:none;display:flex;flex-direction:column;gap:2px}.files li{display:flex;justify-content:space-between;gap:var(--ui-space-3);padding:var(--ui-space-1) var(--ui-space-2);background:var(--ui-color-surface-raised);border-radius:6px;font-family:var(--ui-font-default);font-size:var(--ui-font-size-sm)}.sz{color:var(--ui-color-text-muted)}\n"] }]
        }], propDecorators: { multiple: [{ type: i0.Input, args: [{ isSignal: true, alias: "multiple", required: false }] }], accept: [{ type: i0.Input, args: [{ isSignal: true, alias: "accept", required: false }] }], radius: [{ type: i0.Input, args: [{ isSignal: true, alias: "radius", required: false }] }], filesSelected: [{ type: i0.Output, args: ["filesSelected"] }] } });

/** `ui-time-picker` — time field (CVA; value is `HH:MM`), built on a native time input. */
class UiTimePicker {
    config = inject(UI_CONFIG);
    size = input('md', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "size" }] : /* istanbul ignore next */ []));
    /** Seconds granularity: 60 = minutes (default), 1 = show seconds. */
    step = input(60, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "step" }] : /* istanbul ignore next */ []));
    radius = input(this.config.radius, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "radius" }] : /* istanbul ignore next */ []));
    value = signal('', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "value" }] : /* istanbul ignore next */ []));
    disabled = signal(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "disabled" }] : /* istanbul ignore next */ []));
    onChange = () => { };
    onTouched = () => { };
    writeValue(v) { this.value.set(v ?? ''); }
    registerOnChange(fn) { this.onChange = fn; }
    registerOnTouched(fn) { this.onTouched = fn; }
    setDisabledState(d) { this.disabled.set(d); }
    set(v) { this.value.set(v); this.onChange(v); }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiTimePicker, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.1.0", version: "22.0.4", type: UiTimePicker, isStandalone: true, selector: "ui-time-picker", inputs: { size: { classPropertyName: "size", publicName: "size", isSignal: true, isRequired: false, transformFunction: null }, step: { classPropertyName: "step", publicName: "step", isSignal: true, isRequired: false, transformFunction: null }, radius: { classPropertyName: "radius", publicName: "radius", isSignal: true, isRequired: false, transformFunction: null } }, providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiTimePicker), multi: true }], ngImport: i0, template: `
    <input
      class="ui-time"
      type="time"
      [class.no-radius]="!radius()"
      [attr.data-size]="size()"
      [attr.step]="step()"
      [value]="value()"
      [disabled]="disabled()"
      (input)="set($any($event.target).value)"
      (blur)="onTouched()" />
  `, isInline: true, styles: [":host{display:block}.ui-time{width:100%;box-sizing:border-box;height:var(--ui-size-md);padding:0 var(--ui-space-3);background:var(--ui-color-surface);color:var(--ui-color-text);border:1px solid var(--ui-color-border);border-radius:var(--ui-radius);font-family:var(--ui-font-default);font-size:var(--ui-font-size-md);outline:none;transition:border-color var(--ui-motion-base) var(--ui-ease-standard),box-shadow var(--ui-motion-base) var(--ui-ease-standard)}.ui-time:focus{border-color:var(--ui-color-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--ui-color-primary) 30%,transparent)}.ui-time.no-radius{border-radius:0}.ui-time[data-size=sm]{height:var(--ui-size-sm);font-size:var(--ui-font-size-sm)}.ui-time[data-size=lg]{height:var(--ui-size-lg);font-size:var(--ui-font-size-lg)}.ui-time::-webkit-calendar-picker-indicator{filter:invert(.6);cursor:pointer}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiTimePicker, decorators: [{
            type: Component,
            args: [{ selector: 'ui-time-picker', template: `
    <input
      class="ui-time"
      type="time"
      [class.no-radius]="!radius()"
      [attr.data-size]="size()"
      [attr.step]="step()"
      [value]="value()"
      [disabled]="disabled()"
      (input)="set($any($event.target).value)"
      (blur)="onTouched()" />
  `, providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiTimePicker), multi: true }], styles: [":host{display:block}.ui-time{width:100%;box-sizing:border-box;height:var(--ui-size-md);padding:0 var(--ui-space-3);background:var(--ui-color-surface);color:var(--ui-color-text);border:1px solid var(--ui-color-border);border-radius:var(--ui-radius);font-family:var(--ui-font-default);font-size:var(--ui-font-size-md);outline:none;transition:border-color var(--ui-motion-base) var(--ui-ease-standard),box-shadow var(--ui-motion-base) var(--ui-ease-standard)}.ui-time:focus{border-color:var(--ui-color-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--ui-color-primary) 30%,transparent)}.ui-time.no-radius{border-radius:0}.ui-time[data-size=sm]{height:var(--ui-size-sm);font-size:var(--ui-font-size-sm)}.ui-time[data-size=lg]{height:var(--ui-size-lg);font-size:var(--ui-font-size-lg)}.ui-time::-webkit-calendar-picker-indicator{filter:invert(.6);cursor:pointer}\n"] }]
        }], propDecorators: { size: [{ type: i0.Input, args: [{ isSignal: true, alias: "size", required: false }] }], step: [{ type: i0.Input, args: [{ isSignal: true, alias: "step", required: false }] }], radius: [{ type: i0.Input, args: [{ isSignal: true, alias: "radius", required: false }] }] } });

/**
 * Generated bundle index. Do not edit.
 */

export { UiCheckbox, UiCheckboxGroup, UiChipInput, UiColorPicker, UiEditableText, UiFileUpload, UiFormField, UiInput, UiNumberInput, UiOtpInput, UiPasswordInput, UiRadioGroup, UiRating, UiSearchInput, UiSelect, UiSlider, UiSwitch, UiTextarea, UiTimePicker };
//# sourceMappingURL=ui-form.mjs.map
