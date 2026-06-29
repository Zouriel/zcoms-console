import { DOCUMENT, NgTemplateOutlet } from '@angular/common';
import * as i0 from '@angular/core';
import { inject, input, signal, output, Directive, ElementRef, NgZone, contentChild, TemplateRef, Component } from '@angular/core';
import * as i1 from '@angular/cdk/scrolling';
import { ScrollingModule } from '@angular/cdk/scrolling';

/**
 * `uiCopyToClipboard` — copies the bound text to the clipboard on click and
 * exposes a transient `copied` state. Emits `(copied)` / `(copyFailed)`.
 */
class UiCopyToClipboard {
    doc = inject(DOCUMENT);
    text = input('', { ...(ngDevMode ? { debugName: "text" } : /* istanbul ignore next */ {}), alias: 'uiCopyToClipboard' });
    copied = signal(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "copied" }] : /* istanbul ignore next */ []));
    copyEvent = output({ alias: 'copied' });
    copyFailed = output();
    async copy() {
        const value = this.text();
        try {
            await this.doc.defaultView?.navigator.clipboard.writeText(value);
            this.copied.set(true);
            this.copyEvent.emit(value);
            setTimeout(() => this.copied.set(false), 1500);
        }
        catch (err) {
            this.copyFailed.emit(err);
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiCopyToClipboard, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "17.1.0", version: "22.0.4", type: UiCopyToClipboard, isStandalone: true, selector: "[uiCopyToClipboard]", inputs: { text: { classPropertyName: "text", publicName: "uiCopyToClipboard", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { copyEvent: "copied", copyFailed: "copyFailed" }, host: { listeners: { "click": "copy()" }, properties: { "attr.data-copied": "copied() || null" } }, exportAs: ["uiCopy"], ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiCopyToClipboard, decorators: [{
            type: Directive,
            args: [{
                    selector: '[uiCopyToClipboard]',
                    exportAs: 'uiCopy',
                    host: { '(click)': 'copy()', '[attr.data-copied]': 'copied() || null' },
                }]
        }], propDecorators: { text: [{ type: i0.Input, args: [{ isSignal: true, alias: "uiCopyToClipboard", required: false }] }], copyEvent: [{ type: i0.Output, args: ["copied"] }], copyFailed: [{ type: i0.Output, args: ["copyFailed"] }] } });

/** `uiRipple` — emits a material-style ripple from the pointer position on press. */
class UiRipple {
    host = inject(ElementRef);
    disabled = input(false, { ...(ngDevMode ? { debugName: "disabled" } : /* istanbul ignore next */ {}), alias: 'uiRippleDisabled' });
    color = input('currentColor', { ...(ngDevMode ? { debugName: "color" } : /* istanbul ignore next */ {}), alias: 'uiRippleColor' });
    spawn(e) {
        if (this.disabled())
            return;
        const el = this.host.nativeElement;
        const rect = el.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const ripple = document.createElement('span');
        ripple.style.cssText = `position:absolute;border-radius:50%;pointer-events:none;transform:scale(0);opacity:0.35;width:${size}px;height:${size}px;left:${e.clientX - rect.left - size / 2}px;top:${e.clientY - rect.top - size / 2}px;background:${this.color()};transition:transform 480ms cubic-bezier(0.2,0,0,1),opacity 600ms;`;
        el.appendChild(ripple);
        requestAnimationFrame(() => { ripple.style.transform = 'scale(2.2)'; ripple.style.opacity = '0'; });
        setTimeout(() => ripple.remove(), 620);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiRipple, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "17.1.0", version: "22.0.4", type: UiRipple, isStandalone: true, selector: "[uiRipple]", inputs: { disabled: { classPropertyName: "disabled", publicName: "uiRippleDisabled", isSignal: true, isRequired: false, transformFunction: null }, color: { classPropertyName: "color", publicName: "uiRippleColor", isSignal: true, isRequired: false, transformFunction: null } }, host: { listeners: { "pointerdown": "spawn($event)" }, properties: { "style.position": "\"relative\"", "style.overflow": "\"hidden\"" } }, ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiRipple, decorators: [{
            type: Directive,
            args: [{
                    selector: '[uiRipple]',
                    host: {
                        '(pointerdown)': 'spawn($event)',
                        '[style.position]': '"relative"',
                        '[style.overflow]': '"hidden"',
                    },
                }]
        }], propDecorators: { disabled: [{ type: i0.Input, args: [{ isSignal: true, alias: "uiRippleDisabled", required: false }] }], color: [{ type: i0.Input, args: [{ isSignal: true, alias: "uiRippleColor", required: false }] }] } });

/**
 * `uiInfiniteScroll` — emits `(scrolledToEnd)` when the host scrolls within
 * `threshold` px of the bottom. Re-arms once scrolled back up.
 */
class UiInfiniteScroll {
    host = inject(ElementRef);
    zone = inject(NgZone);
    threshold = input(120, { ...(ngDevMode ? { debugName: "threshold" } : /* istanbul ignore next */ {}), alias: 'uiInfiniteScrollThreshold' });
    disabled = input(false, { ...(ngDevMode ? { debugName: "disabled" } : /* istanbul ignore next */ {}), alias: 'uiInfiniteScrollDisabled' });
    scrolledToEnd = output();
    armed = true;
    onScroll = () => this.check();
    ngOnInit() {
        this.zone.runOutsideAngular(() => this.host.nativeElement.addEventListener('scroll', this.onScroll, { passive: true }));
    }
    ngOnDestroy() {
        this.host.nativeElement.removeEventListener('scroll', this.onScroll);
    }
    check() {
        if (this.disabled())
            return;
        const el = this.host.nativeElement;
        const remaining = el.scrollHeight - el.scrollTop - el.clientHeight;
        if (remaining <= this.threshold()) {
            if (this.armed) {
                this.armed = false;
                this.zone.run(() => this.scrolledToEnd.emit());
            }
        }
        else {
            this.armed = true;
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiInfiniteScroll, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "17.1.0", version: "22.0.4", type: UiInfiniteScroll, isStandalone: true, selector: "[uiInfiniteScroll]", inputs: { threshold: { classPropertyName: "threshold", publicName: "uiInfiniteScrollThreshold", isSignal: true, isRequired: false, transformFunction: null }, disabled: { classPropertyName: "disabled", publicName: "uiInfiniteScrollDisabled", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { scrolledToEnd: "scrolledToEnd" }, ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiInfiniteScroll, decorators: [{
            type: Directive,
            args: [{
                    selector: '[uiInfiniteScroll]',
                }]
        }], propDecorators: { threshold: [{ type: i0.Input, args: [{ isSignal: true, alias: "uiInfiniteScrollThreshold", required: false }] }], disabled: [{ type: i0.Input, args: [{ isSignal: true, alias: "uiInfiniteScrollDisabled", required: false }] }], scrolledToEnd: [{ type: i0.Output, args: ["scrolledToEnd"] }] } });

/** `uiIntersect` — emits `(intersect)` with visibility as the host enters/leaves the viewport. */
class UiIntersect {
    host = inject(ElementRef);
    zone = inject(NgZone);
    rootMargin = input('0px', { ...(ngDevMode ? { debugName: "rootMargin" } : /* istanbul ignore next */ {}), alias: 'uiIntersectRootMargin' });
    /** Emit only the first time the element becomes visible, then stop. */
    once = input(false, { ...(ngDevMode ? { debugName: "once" } : /* istanbul ignore next */ {}), alias: 'uiIntersectOnce' });
    intersect = output({ alias: 'uiIntersect' });
    observer;
    ngOnInit() {
        this.observer = new IntersectionObserver((entries) => {
            for (const entry of entries) {
                this.zone.run(() => this.intersect.emit(entry.isIntersecting));
                if (entry.isIntersecting && this.once())
                    this.observer?.disconnect();
            }
        }, { rootMargin: this.rootMargin() });
        this.observer.observe(this.host.nativeElement);
    }
    ngOnDestroy() { this.observer?.disconnect(); }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiIntersect, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "17.1.0", version: "22.0.4", type: UiIntersect, isStandalone: true, selector: "[uiIntersect]", inputs: { rootMargin: { classPropertyName: "rootMargin", publicName: "uiIntersectRootMargin", isSignal: true, isRequired: false, transformFunction: null }, once: { classPropertyName: "once", publicName: "uiIntersectOnce", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { intersect: "uiIntersect" }, ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiIntersect, decorators: [{
            type: Directive,
            args: [{
                    selector: '[uiIntersect]',
                }]
        }], propDecorators: { rootMargin: [{ type: i0.Input, args: [{ isSignal: true, alias: "uiIntersectRootMargin", required: false }] }], once: [{ type: i0.Input, args: [{ isSignal: true, alias: "uiIntersectOnce", required: false }] }], intersect: [{ type: i0.Output, args: ["uiIntersect"] }] } });

/** `uiResizeObserver` — emits `(uiResizeObserver)` with the host's content-box size on change. */
class UiResizeObserver {
    host = inject(ElementRef);
    zone = inject(NgZone);
    sizeChange = output({ alias: 'uiResizeObserver' });
    observer;
    ngOnInit() {
        this.observer = new ResizeObserver((entries) => {
            const rect = entries[0]?.contentRect;
            if (rect)
                this.zone.run(() => this.sizeChange.emit({ width: rect.width, height: rect.height }));
        });
        this.observer.observe(this.host.nativeElement);
    }
    ngOnDestroy() { this.observer?.disconnect(); }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiResizeObserver, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "22.0.4", type: UiResizeObserver, isStandalone: true, selector: "[uiResizeObserver]", outputs: { sizeChange: "uiResizeObserver" }, ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiResizeObserver, decorators: [{
            type: Directive,
            args: [{
                    selector: '[uiResizeObserver]',
                }]
        }], propDecorators: { sizeChange: [{ type: i0.Output, args: ["uiResizeObserver"] }] } });

/**
 * `ui-virtual-list` — renders only the visible slice of a large list via the
 * CDK virtual scroll. Provide an item template:
 *
 *   <ui-virtual-list [items]="rows" [itemSize]="32" height="320px">
 *     <ng-template let-item>{{ item.name }}</ng-template>
 *   </ui-virtual-list>
 */
class UiVirtualList {
    items = input([], /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "items" }] : /* istanbul ignore next */ []));
    itemSize = input(32, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "itemSize" }] : /* istanbul ignore next */ []));
    height = input('320px', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "height" }] : /* istanbul ignore next */ []));
    tpl = contentChild(TemplateRef, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "tpl" }] : /* istanbul ignore next */ []));
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiVirtualList, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.2.0", version: "22.0.4", type: UiVirtualList, isStandalone: true, selector: "ui-virtual-list", inputs: { items: { classPropertyName: "items", publicName: "items", isSignal: true, isRequired: false, transformFunction: null }, itemSize: { classPropertyName: "itemSize", publicName: "itemSize", isSignal: true, isRequired: false, transformFunction: null }, height: { classPropertyName: "height", publicName: "height", isSignal: true, isRequired: false, transformFunction: null } }, queries: [{ propertyName: "tpl", first: true, predicate: TemplateRef, descendants: true, isSignal: true }], ngImport: i0, template: `
    <cdk-virtual-scroll-viewport [itemSize]="itemSize()" [style.height]="height()" class="vp">
      <div *cdkVirtualFor="let item of items()" [style.height.px]="itemSize()" class="row">
        <ng-container [ngTemplateOutlet]="tpl()!" [ngTemplateOutletContext]="{ $implicit: item }" />
      </div>
    </cdk-virtual-scroll-viewport>
  `, isInline: true, styles: [":host{display:block}.vp{border:1px solid var(--ui-color-border);border-radius:var(--ui-radius)}.row{display:flex;align-items:center;padding:0 var(--ui-space-3);box-sizing:border-box;border-bottom:1px solid var(--ui-color-border);font-family:var(--ui-font-default);font-size:var(--ui-font-size-md);color:var(--ui-color-text)}\n"], dependencies: [{ kind: "ngmodule", type: ScrollingModule }, { kind: "directive", type: i1.CdkFixedSizeVirtualScroll, selector: "cdk-virtual-scroll-viewport[itemSize]", inputs: ["itemSize", "minBufferPx", "maxBufferPx"] }, { kind: "directive", type: i1.CdkVirtualForOf, selector: "[cdkVirtualFor][cdkVirtualForOf]", inputs: ["cdkVirtualForOf", "cdkVirtualForTrackBy", "cdkVirtualForTemplate", "cdkVirtualForTemplateCacheSize"] }, { kind: "component", type: i1.CdkVirtualScrollViewport, selector: "cdk-virtual-scroll-viewport", inputs: ["orientation", "appendOnly"], outputs: ["scrolledIndexChange"] }, { kind: "directive", type: NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiVirtualList, decorators: [{
            type: Component,
            args: [{ selector: 'ui-virtual-list', imports: [ScrollingModule, NgTemplateOutlet], template: `
    <cdk-virtual-scroll-viewport [itemSize]="itemSize()" [style.height]="height()" class="vp">
      <div *cdkVirtualFor="let item of items()" [style.height.px]="itemSize()" class="row">
        <ng-container [ngTemplateOutlet]="tpl()!" [ngTemplateOutletContext]="{ $implicit: item }" />
      </div>
    </cdk-virtual-scroll-viewport>
  `, styles: [":host{display:block}.vp{border:1px solid var(--ui-color-border);border-radius:var(--ui-radius)}.row{display:flex;align-items:center;padding:0 var(--ui-space-3);box-sizing:border-box;border-bottom:1px solid var(--ui-color-border);font-family:var(--ui-font-default);font-size:var(--ui-font-size-md);color:var(--ui-color-text)}\n"] }]
        }], propDecorators: { items: [{ type: i0.Input, args: [{ isSignal: true, alias: "items", required: false }] }], itemSize: [{ type: i0.Input, args: [{ isSignal: true, alias: "itemSize", required: false }] }], height: [{ type: i0.Input, args: [{ isSignal: true, alias: "height", required: false }] }], tpl: [{ type: i0.ContentChild, args: [i0.forwardRef(() => TemplateRef), { isSignal: true }] }] } });

/**
 * Generated bundle index. Do not edit.
 */

export { UiCopyToClipboard, UiInfiniteScroll, UiIntersect, UiResizeObserver, UiRipple, UiVirtualList };
//# sourceMappingURL=ui-behaviors.mjs.map
