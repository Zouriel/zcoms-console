import * as _angular_core from '@angular/core';
import { ConnectedPosition } from '@angular/cdk/overlay';
import { ControlValueAccessor } from '@angular/forms';
import { UiSize } from 'ui';

interface DayCell {
    day: number;
    iso: string;
    today: boolean;
}
/**
 * `ui-date-picker` — calendar popover (CVA; value is an ISO `YYYY-MM-DD`
 * string). Backed by the CDK Overlay; closes on outside click / Escape.
 */
declare class UiDatePicker implements ControlValueAccessor {
    private config;
    placeholder: _angular_core.InputSignal<string>;
    size: _angular_core.InputSignal<UiSize>;
    radius: _angular_core.InputSignal<boolean>;
    protected readonly value: _angular_core.WritableSignal<string | null>;
    protected readonly open: _angular_core.WritableSignal<boolean>;
    protected readonly disabled: _angular_core.WritableSignal<boolean>;
    protected readonly weekdays: string[];
    private readonly view;
    protected readonly positions: ConnectedPosition[];
    protected readonly display: _angular_core.Signal<string>;
    protected readonly monthLabel: _angular_core.Signal<string>;
    protected readonly leading: _angular_core.Signal<unknown[]>;
    protected readonly days: _angular_core.Signal<DayCell[]>;
    private initialView;
    writeValue(v: string | null): void;
    private onChange;
    protected onTouched: () => void;
    registerOnChange(fn: (v: string | null) => void): void;
    registerOnTouched(fn: () => void): void;
    setDisabledState(d: boolean): void;
    protected shift(delta: number): void;
    protected pick(isoDate: string): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiDatePicker, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiDatePicker, "ui-date-picker", never, { "placeholder": { "alias": "placeholder"; "required": false; "isSignal": true; }; "size": { "alias": "size"; "required": false; "isSignal": true; }; "radius": { "alias": "radius"; "required": false; "isSignal": true; }; }, {}, never, never, true, never>;
}

/** `ui-calendar` — inline month calendar (CVA; value is an ISO `YYYY-MM-DD` string). */
declare class UiCalendar implements ControlValueAccessor {
    protected readonly weekdays: string[];
    protected readonly MONTHS: string[];
    protected readonly value: _angular_core.WritableSignal<string | null>;
    protected readonly disabled: _angular_core.WritableSignal<boolean>;
    protected readonly view: _angular_core.WritableSignal<[number, number]>;
    protected readonly leading: _angular_core.Signal<unknown[]>;
    protected readonly days: _angular_core.Signal<{
        day: number;
        iso: string;
        today: boolean;
    }[]>;
    private onChange;
    protected onTouched: () => void;
    writeValue(v: string | null): void;
    registerOnChange(fn: (v: string | null) => void): void;
    registerOnTouched(fn: () => void): void;
    setDisabledState(d: boolean): void;
    protected shift(delta: number): void;
    protected pick(isoDate: string): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiCalendar, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiCalendar, "ui-calendar", never, {}, {}, never, never, true, never>;
}

type UiDateRange = {
    start: string | null;
    end: string | null;
};
/** `ui-date-range-picker` — inline range selection (CVA; value is `{ start, end }` ISO strings). */
declare class UiDateRangePicker implements ControlValueAccessor {
    protected readonly weekdays: string[];
    protected readonly MONTHS: string[];
    protected readonly range: _angular_core.WritableSignal<UiDateRange>;
    protected readonly hover: _angular_core.WritableSignal<string | null>;
    protected readonly disabled: _angular_core.WritableSignal<boolean>;
    protected readonly view: _angular_core.WritableSignal<[number, number]>;
    protected readonly leading: _angular_core.Signal<unknown[]>;
    protected readonly days: _angular_core.Signal<{
        day: number;
        iso: string;
    }[]>;
    private onChange;
    protected onTouched: () => void;
    writeValue(v: UiDateRange | null): void;
    registerOnChange(fn: (v: UiDateRange) => void): void;
    registerOnTouched(fn: () => void): void;
    setDisabledState(d: boolean): void;
    protected shift(delta: number): void;
    protected inRange(d: string): boolean;
    protected pick(d: string): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiDateRangePicker, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiDateRangePicker, "ui-date-range-picker", never, {}, {}, never, never, true, never>;
}

export { UiCalendar, UiDatePicker, UiDateRangePicker };
export type { UiDateRange };
