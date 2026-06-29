import * as i0 from '@angular/core';
import { input, Component, computed, inject, ElementRef, NgZone, signal } from '@angular/core';

/** `ui-container` — centered, max-width content wrapper with responsive padding. */
class UiContainer {
    size = input('lg', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "size" }] : /* istanbul ignore next */ []));
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiContainer, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.1.0", version: "22.0.4", type: UiContainer, isStandalone: true, selector: "ui-container", inputs: { size: { classPropertyName: "size", publicName: "size", isSignal: true, isRequired: false, transformFunction: null } }, ngImport: i0, template: `<div class="ui-container" [attr.data-size]="size()"><ng-content /></div>`, isInline: true, styles: [":host{display:block}.ui-container{margin-inline:auto;padding-inline:var(--ui-space-4);width:100%;box-sizing:border-box}.ui-container[data-size=sm]{max-width:640px}.ui-container[data-size=md]{max-width:860px}.ui-container[data-size=lg]{max-width:1100px}.ui-container[data-size=xl]{max-width:1320px}.ui-container[data-size=full]{max-width:none}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiContainer, decorators: [{
            type: Component,
            args: [{ selector: 'ui-container', template: `<div class="ui-container" [attr.data-size]="size()"><ng-content /></div>`, styles: [":host{display:block}.ui-container{margin-inline:auto;padding-inline:var(--ui-space-4);width:100%;box-sizing:border-box}.ui-container[data-size=sm]{max-width:640px}.ui-container[data-size=md]{max-width:860px}.ui-container[data-size=lg]{max-width:1100px}.ui-container[data-size=xl]{max-width:1320px}.ui-container[data-size=full]{max-width:none}\n"] }]
        }], propDecorators: { size: [{ type: i0.Input, args: [{ isSignal: true, alias: "size", required: false }] }] } });

/** `ui-grid` — CSS grid with a fixed column count and token-based gap. */
class UiGrid {
    /** Column count, or a CSS grid-template-columns string. */
    columns = input(12, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "columns" }] : /* istanbul ignore next */ []));
    /** Minimum column width for an auto-fit responsive grid (overrides columns). */
    min = input(/* @ts-ignore */
    ...(ngDevMode ? [undefined, { debugName: "min" }] : /* istanbul ignore next */ []));
    gap = input(4, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "gap" }] : /* istanbul ignore next */ []));
    cols = computed(() => {
        const min = this.min();
        if (min)
            return `repeat(auto-fit, minmax(${min}, 1fr))`;
        const c = this.columns();
        return typeof c === 'number' ? `repeat(${c}, 1fr)` : c;
    }, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "cols" }] : /* istanbul ignore next */ []));
    gapVar = computed(() => `var(--ui-space-${this.gap()})`, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "gapVar" }] : /* istanbul ignore next */ []));
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiGrid, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.1.0", version: "22.0.4", type: UiGrid, isStandalone: true, selector: "ui-grid", inputs: { columns: { classPropertyName: "columns", publicName: "columns", isSignal: true, isRequired: false, transformFunction: null }, min: { classPropertyName: "min", publicName: "min", isSignal: true, isRequired: false, transformFunction: null }, gap: { classPropertyName: "gap", publicName: "gap", isSignal: true, isRequired: false, transformFunction: null } }, ngImport: i0, template: `<div class="ui-grid" [style.grid-template-columns]="cols()" [style.gap]="gapVar()"><ng-content /></div>`, isInline: true, styles: [":host{display:block}.ui-grid{display:grid}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiGrid, decorators: [{
            type: Component,
            args: [{ selector: 'ui-grid', template: `<div class="ui-grid" [style.grid-template-columns]="cols()" [style.gap]="gapVar()"><ng-content /></div>`, styles: [":host{display:block}.ui-grid{display:grid}\n"] }]
        }], propDecorators: { columns: [{ type: i0.Input, args: [{ isSignal: true, alias: "columns", required: false }] }], min: [{ type: i0.Input, args: [{ isSignal: true, alias: "min", required: false }] }], gap: [{ type: i0.Input, args: [{ isSignal: true, alias: "gap", required: false }] }] } });

/** `ui-stack` — flexbox row/column with token gap and alignment. */
class UiStack {
    direction = input('column', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "direction" }] : /* istanbul ignore next */ []));
    gap = input(3, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "gap" }] : /* istanbul ignore next */ []));
    align = input('stretch', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "align" }] : /* istanbul ignore next */ []));
    justify = input('start', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "justify" }] : /* istanbul ignore next */ []));
    wrap = input(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "wrap" }] : /* istanbul ignore next */ []));
    gapVar = computed(() => `var(--ui-space-${this.gap()}, 0px)`, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "gapVar" }] : /* istanbul ignore next */ []));
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiStack, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.1.0", version: "22.0.4", type: UiStack, isStandalone: true, selector: "ui-stack", inputs: { direction: { classPropertyName: "direction", publicName: "direction", isSignal: true, isRequired: false, transformFunction: null }, gap: { classPropertyName: "gap", publicName: "gap", isSignal: true, isRequired: false, transformFunction: null }, align: { classPropertyName: "align", publicName: "align", isSignal: true, isRequired: false, transformFunction: null }, justify: { classPropertyName: "justify", publicName: "justify", isSignal: true, isRequired: false, transformFunction: null }, wrap: { classPropertyName: "wrap", publicName: "wrap", isSignal: true, isRequired: false, transformFunction: null } }, ngImport: i0, template: `<div class="ui-stack" [style.flex-direction]="direction()" [style.gap]="gapVar()"
                  [style.align-items]="align()" [style.justify-content]="justify()"
                  [style.flex-wrap]="wrap() ? 'wrap' : 'nowrap'"><ng-content /></div>`, isInline: true, styles: [":host{display:block}.ui-stack{display:flex}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiStack, decorators: [{
            type: Component,
            args: [{ selector: 'ui-stack', template: `<div class="ui-stack" [style.flex-direction]="direction()" [style.gap]="gapVar()"
                  [style.align-items]="align()" [style.justify-content]="justify()"
                  [style.flex-wrap]="wrap() ? 'wrap' : 'nowrap'"><ng-content /></div>`, styles: [":host{display:block}.ui-stack{display:flex}\n"] }]
        }], propDecorators: { direction: [{ type: i0.Input, args: [{ isSignal: true, alias: "direction", required: false }] }], gap: [{ type: i0.Input, args: [{ isSignal: true, alias: "gap", required: false }] }], align: [{ type: i0.Input, args: [{ isSignal: true, alias: "align", required: false }] }], justify: [{ type: i0.Input, args: [{ isSignal: true, alias: "justify", required: false }] }], wrap: [{ type: i0.Input, args: [{ isSignal: true, alias: "wrap", required: false }] }] } });

/** `ui-spacer` — flexible gap that pushes siblings apart inside a flex layout. */
class UiSpacer {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiSpacer, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "22.0.4", type: UiSpacer, isStandalone: true, selector: "ui-spacer", ngImport: i0, template: ``, isInline: true, styles: [":host{flex:1 1 auto}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiSpacer, decorators: [{
            type: Component,
            args: [{ selector: 'ui-spacer', template: ``, styles: [":host{flex:1 1 auto}\n"] }]
        }] });

/** `ui-aspect-ratio` — constrains projected content to a fixed width:height ratio. */
class UiAspectRatio {
    /** e.g. '16 / 9', '4 / 3', '1 / 1'. */
    ratio = input('16 / 9', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "ratio" }] : /* istanbul ignore next */ []));
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiAspectRatio, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.1.0", version: "22.0.4", type: UiAspectRatio, isStandalone: true, selector: "ui-aspect-ratio", inputs: { ratio: { classPropertyName: "ratio", publicName: "ratio", isSignal: true, isRequired: false, transformFunction: null } }, ngImport: i0, template: `<div class="ar" [style.aspect-ratio]="ratio()"><ng-content /></div>`, isInline: true, styles: [":host{display:block}.ar{width:100%;overflow:hidden;border-radius:inherit}.ar ::ng-deep>*{width:100%;height:100%;object-fit:cover;display:block}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiAspectRatio, decorators: [{
            type: Component,
            args: [{ selector: 'ui-aspect-ratio', template: `<div class="ar" [style.aspect-ratio]="ratio()"><ng-content /></div>`, styles: [":host{display:block}.ar{width:100%;overflow:hidden;border-radius:inherit}.ar ::ng-deep>*{width:100%;height:100%;object-fit:cover;display:block}\n"] }]
        }], propDecorators: { ratio: [{ type: i0.Input, args: [{ isSignal: true, alias: "ratio", required: false }] }] } });

/** `ui-scroll-area` — themed, thin-scrollbar scroll container with a fixed max height. */
class UiScrollArea {
    maxHeight = input('240px', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "maxHeight" }] : /* istanbul ignore next */ []));
    axis = input('y', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "axis" }] : /* istanbul ignore next */ []));
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiScrollArea, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.1.0", version: "22.0.4", type: UiScrollArea, isStandalone: true, selector: "ui-scroll-area", inputs: { maxHeight: { classPropertyName: "maxHeight", publicName: "maxHeight", isSignal: true, isRequired: false, transformFunction: null }, axis: { classPropertyName: "axis", publicName: "axis", isSignal: true, isRequired: false, transformFunction: null } }, ngImport: i0, template: `<div class="sa" [style.max-height]="maxHeight()" [style.--ui-sa-axis]="axis()"><ng-content /></div>`, isInline: true, styles: [":host{display:block}.sa{overflow:auto;scrollbar-width:thin;scrollbar-color:var(--ui-color-border) transparent}.sa::-webkit-scrollbar{width:9px;height:9px}.sa::-webkit-scrollbar-thumb{background:var(--ui-color-border);border-radius:999px;border:2px solid transparent;background-clip:padding-box}.sa::-webkit-scrollbar-thumb:hover{background:var(--ui-color-text-muted);background-clip:padding-box}.sa::-webkit-scrollbar-track{background:transparent}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiScrollArea, decorators: [{
            type: Component,
            args: [{ selector: 'ui-scroll-area', template: `<div class="sa" [style.max-height]="maxHeight()" [style.--ui-sa-axis]="axis()"><ng-content /></div>`, styles: [":host{display:block}.sa{overflow:auto;scrollbar-width:thin;scrollbar-color:var(--ui-color-border) transparent}.sa::-webkit-scrollbar{width:9px;height:9px}.sa::-webkit-scrollbar-thumb{background:var(--ui-color-border);border-radius:999px;border:2px solid transparent;background-clip:padding-box}.sa::-webkit-scrollbar-thumb:hover{background:var(--ui-color-text-muted);background-clip:padding-box}.sa::-webkit-scrollbar-track{background:transparent}\n"] }]
        }], propDecorators: { maxHeight: [{ type: i0.Input, args: [{ isSignal: true, alias: "maxHeight", required: false }] }], axis: [{ type: i0.Input, args: [{ isSignal: true, alias: "axis", required: false }] }] } });

/**
 * `ui-splitter` — two resizable panes with a draggable divider. Project two
 * elements with `[split-a]` and `[split-b]`.
 */
class UiSplitter {
    root = inject(ElementRef);
    zone = inject(NgZone);
    orientation = input('horizontal', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "orientation" }] : /* istanbul ignore next */ []));
    /** Size of the first pane as a percentage (0–100). */
    ratio = signal(50, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "ratio" }] : /* istanbul ignore next */ []));
    dragging = false;
    move = (e) => this.onMove(e);
    up = () => this.end();
    start(e) {
        e.preventDefault();
        this.dragging = true;
        this.zone.runOutsideAngular(() => {
            document.addEventListener('pointermove', this.move);
            document.addEventListener('pointerup', this.up);
        });
    }
    onMove(e) {
        if (!this.dragging)
            return;
        const el = this.root.nativeElement;
        const rect = el.getBoundingClientRect();
        const pct = this.orientation() === 'vertical'
            ? ((e.clientY - rect.top) / rect.height) * 100
            : ((e.clientX - rect.left) / rect.width) * 100;
        this.zone.run(() => this.ratio.set(Math.min(90, Math.max(10, pct))));
    }
    end() {
        this.dragging = false;
        document.removeEventListener('pointermove', this.move);
        document.removeEventListener('pointerup', this.up);
    }
    onKey(e) {
        const step = 2;
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            this.ratio.update((r) => Math.max(10, r - step));
        }
        else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            this.ratio.update((r) => Math.min(90, r + step));
        }
    }
    ngOnDestroy() { this.end(); }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiSplitter, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.1.0", version: "22.0.4", type: UiSplitter, isStandalone: true, selector: "ui-splitter", inputs: { orientation: { classPropertyName: "orientation", publicName: "orientation", isSignal: true, isRequired: false, transformFunction: null } }, ngImport: i0, template: `
    <div class="sp" [class.vertical]="orientation() === 'vertical'" #root>
      <div class="pane" [style.flex-basis.%]="ratio()"><ng-content select="[split-a]" /></div>
      <div class="gutter" role="separator" tabindex="0"
           [attr.aria-orientation]="orientation()"
           (pointerdown)="start($event)"
           (keydown)="onKey($event)"></div>
      <div class="pane"><ng-content select="[split-b]" /></div>
    </div>
  `, isInline: true, styles: [":host{display:block;height:100%}.sp{display:flex;height:100%;width:100%}.sp.vertical{flex-direction:column}.pane{overflow:auto;flex:1 1 0;min-width:0;min-height:0}.sp>.pane:first-child{flex:0 0 auto}.gutter{flex:none;background:var(--ui-color-border);position:relative}.sp:not(.vertical) .gutter{width:1px;cursor:col-resize}.sp.vertical .gutter{height:1px;cursor:row-resize}.gutter:after{content:\"\";position:absolute;inset:-3px}.gutter:hover,.gutter:focus-visible{background:var(--ui-color-primary);outline:none}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiSplitter, decorators: [{
            type: Component,
            args: [{ selector: 'ui-splitter', template: `
    <div class="sp" [class.vertical]="orientation() === 'vertical'" #root>
      <div class="pane" [style.flex-basis.%]="ratio()"><ng-content select="[split-a]" /></div>
      <div class="gutter" role="separator" tabindex="0"
           [attr.aria-orientation]="orientation()"
           (pointerdown)="start($event)"
           (keydown)="onKey($event)"></div>
      <div class="pane"><ng-content select="[split-b]" /></div>
    </div>
  `, styles: [":host{display:block;height:100%}.sp{display:flex;height:100%;width:100%}.sp.vertical{flex-direction:column}.pane{overflow:auto;flex:1 1 0;min-width:0;min-height:0}.sp>.pane:first-child{flex:0 0 auto}.gutter{flex:none;background:var(--ui-color-border);position:relative}.sp:not(.vertical) .gutter{width:1px;cursor:col-resize}.sp.vertical .gutter{height:1px;cursor:row-resize}.gutter:after{content:\"\";position:absolute;inset:-3px}.gutter:hover,.gutter:focus-visible{background:var(--ui-color-primary);outline:none}\n"] }]
        }], propDecorators: { orientation: [{ type: i0.Input, args: [{ isSignal: true, alias: "orientation", required: false }] }] } });

/**
 * Generated bundle index. Do not edit.
 */

export { UiAspectRatio, UiContainer, UiGrid, UiScrollArea, UiSpacer, UiSplitter, UiStack };
//# sourceMappingURL=ui-layout.mjs.map
