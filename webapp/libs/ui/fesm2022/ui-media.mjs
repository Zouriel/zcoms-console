import * as i0 from '@angular/core';
import { input, signal, effect, Component, computed } from '@angular/core';

/** `ui-carousel` — image slideshow with arrows, dots, and optional autoplay. */
class UiCarousel {
    slides = input([], /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "slides" }] : /* istanbul ignore next */ []));
    /** Autoplay interval in ms; 0 disables. */
    autoplay = input(0, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "autoplay" }] : /* istanbul ignore next */ []));
    index = signal(0, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "index" }] : /* istanbul ignore next */ []));
    paused = signal(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "paused" }] : /* istanbul ignore next */ []));
    timer;
    constructor() {
        effect(() => {
            const n = this.slides().length;
            if (this.index() >= n && n > 0)
                this.index.set(0);
        });
    }
    ngOnInit() {
        const ms = this.autoplay();
        if (ms > 0)
            this.timer = setInterval(() => { if (!this.paused())
                this.next(); }, ms);
    }
    ngOnDestroy() { if (this.timer)
        clearInterval(this.timer); }
    next() { this.index.update((i) => (i + 1) % Math.max(1, this.slides().length)); }
    prev() { this.index.update((i) => (i - 1 + this.slides().length) % Math.max(1, this.slides().length)); }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiCarousel, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "22.0.4", type: UiCarousel, isStandalone: true, selector: "ui-carousel", inputs: { slides: { classPropertyName: "slides", publicName: "slides", isSignal: true, isRequired: false, transformFunction: null }, autoplay: { classPropertyName: "autoplay", publicName: "autoplay", isSignal: true, isRequired: false, transformFunction: null } }, ngImport: i0, template: `
    <div class="cz" (pointerenter)="paused.set(true)" (pointerleave)="paused.set(false)">
      <div class="track" [style.transform]="'translateX(' + (-index() * 100) + '%)'">
        @for (s of slides(); track $index) {
          <div class="slide">
            <img [src]="s.image" [alt]="s.alt || ''" />
            @if (s.caption) { <div class="caption">{{ s.caption }}</div> }
          </div>
        }
      </div>
      @if (slides().length > 1) {
        <button type="button" class="arrow prev" aria-label="Previous slide" (click)="prev()">‹</button>
        <button type="button" class="arrow next" aria-label="Next slide" (click)="next()">›</button>
        <div class="dots">
          @for (s of slides(); track $index) {
            <button type="button" class="dot" [class.active]="$index === index()" [attr.aria-label]="'Go to slide ' + ($index + 1)" (click)="index.set($index)"></button>
          }
        </div>
      }
    </div>
  `, isInline: true, styles: [":host{display:block}.cz{position:relative;overflow:hidden;border-radius:var(--ui-radius);background:var(--ui-color-bg)}.track{display:flex;transition:transform var(--ui-motion-slow) var(--ui-ease-standard)}.slide{position:relative;flex:0 0 100%}.slide img{width:100%;height:100%;max-height:360px;object-fit:cover;display:block}.caption{position:absolute;left:0;right:0;bottom:0;padding:var(--ui-space-3);background:linear-gradient(transparent,#0009);color:#fff;font-family:var(--ui-font-default);font-size:var(--ui-font-size-sm)}.arrow{position:absolute;top:50%;transform:translateY(-50%);width:34px;height:34px;border-radius:50%;border:none;background:#00000073;color:#fff;cursor:pointer;font-size:18px}.arrow:hover{background:#000000a6}.prev{left:var(--ui-space-2)}.next{right:var(--ui-space-2)}.dots{position:absolute;bottom:var(--ui-space-2);left:0;right:0;display:flex;justify-content:center;gap:6px}.dot{width:8px;height:8px;border-radius:50%;border:none;background:#ffffff80;cursor:pointer;padding:0}.dot.active{background:#fff}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiCarousel, decorators: [{
            type: Component,
            args: [{ selector: 'ui-carousel', template: `
    <div class="cz" (pointerenter)="paused.set(true)" (pointerleave)="paused.set(false)">
      <div class="track" [style.transform]="'translateX(' + (-index() * 100) + '%)'">
        @for (s of slides(); track $index) {
          <div class="slide">
            <img [src]="s.image" [alt]="s.alt || ''" />
            @if (s.caption) { <div class="caption">{{ s.caption }}</div> }
          </div>
        }
      </div>
      @if (slides().length > 1) {
        <button type="button" class="arrow prev" aria-label="Previous slide" (click)="prev()">‹</button>
        <button type="button" class="arrow next" aria-label="Next slide" (click)="next()">›</button>
        <div class="dots">
          @for (s of slides(); track $index) {
            <button type="button" class="dot" [class.active]="$index === index()" [attr.aria-label]="'Go to slide ' + ($index + 1)" (click)="index.set($index)"></button>
          }
        </div>
      }
    </div>
  `, styles: [":host{display:block}.cz{position:relative;overflow:hidden;border-radius:var(--ui-radius);background:var(--ui-color-bg)}.track{display:flex;transition:transform var(--ui-motion-slow) var(--ui-ease-standard)}.slide{position:relative;flex:0 0 100%}.slide img{width:100%;height:100%;max-height:360px;object-fit:cover;display:block}.caption{position:absolute;left:0;right:0;bottom:0;padding:var(--ui-space-3);background:linear-gradient(transparent,#0009);color:#fff;font-family:var(--ui-font-default);font-size:var(--ui-font-size-sm)}.arrow{position:absolute;top:50%;transform:translateY(-50%);width:34px;height:34px;border-radius:50%;border:none;background:#00000073;color:#fff;cursor:pointer;font-size:18px}.arrow:hover{background:#000000a6}.prev{left:var(--ui-space-2)}.next{right:var(--ui-space-2)}.dots{position:absolute;bottom:var(--ui-space-2);left:0;right:0;display:flex;justify-content:center;gap:6px}.dot{width:8px;height:8px;border-radius:50%;border:none;background:#ffffff80;cursor:pointer;padding:0}.dot.active{background:#fff}\n"] }]
        }], ctorParameters: () => [], propDecorators: { slides: [{ type: i0.Input, args: [{ isSignal: true, alias: "slides", required: false }] }], autoplay: [{ type: i0.Input, args: [{ isSignal: true, alias: "autoplay", required: false }] }] } });

/** `ui-gallery` — responsive thumbnail grid with a lightbox (prev/next, Esc to close). */
class UiGallery {
    images = input([], /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "images" }] : /* istanbul ignore next */ []));
    minThumb = input('120px', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "minThumb" }] : /* istanbul ignore next */ []));
    lightbox = signal(-1, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "lightbox" }] : /* istanbul ignore next */ []));
    current = computed(() => this.images()[this.lightbox()], /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "current" }] : /* istanbul ignore next */ []));
    openAt(i) { this.lightbox.set(i); }
    close() { this.lightbox.set(-1); }
    step(d, e) {
        e.stopPropagation();
        const n = this.images().length;
        this.lightbox.update((i) => (i + d + n) % n);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiGallery, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "22.0.4", type: UiGallery, isStandalone: true, selector: "ui-gallery", inputs: { images: { classPropertyName: "images", publicName: "images", isSignal: true, isRequired: false, transformFunction: null }, minThumb: { classPropertyName: "minThumb", publicName: "minThumb", isSignal: true, isRequired: false, transformFunction: null } }, ngImport: i0, template: `
    <div class="grid" [style.--ui-gallery-min]="minThumb()">
      @for (img of images(); track $index) {
        <button type="button" class="thumb" (click)="openAt($index)" [attr.aria-label]="img.alt || 'Open image'">
          <img [src]="img.thumb || img.src" [alt]="img.alt || ''" loading="lazy" />
        </button>
      }
    </div>
    @if (lightbox() >= 0) {
      <div class="lb" (click)="close()" (keydown.escape)="close()" tabindex="0" role="dialog" aria-label="Image viewer"
           animate.enter="ui-fade-enter" animate.leave="ui-fade-leave">
        <img [src]="current()?.src" [alt]="current()?.alt || ''" (click)="$event.stopPropagation()" />
        <button type="button" class="nav prev" aria-label="Previous" (click)="step(-1, $event)">‹</button>
        <button type="button" class="nav next" aria-label="Next" (click)="step(1, $event)">›</button>
        <button type="button" class="x" aria-label="Close" (click)="close()">✕</button>
      </div>
    }
  `, isInline: true, styles: [":host{display:block}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(var(--ui-gallery-min, 120px),1fr));gap:var(--ui-space-2)}.thumb{padding:0;border:1px solid var(--ui-color-border);border-radius:var(--ui-radius);overflow:hidden;cursor:pointer;background:none;aspect-ratio:1}.thumb:hover{border-color:var(--ui-color-primary)}.thumb:focus-visible{outline:none;box-shadow:var(--ui-focus-ring)}.thumb img{width:100%;height:100%;object-fit:cover;display:block}.lb{position:fixed;inset:0;z-index:var(--ui-z-overlay);display:flex;align-items:center;justify-content:center;background:#000000d9}.lb>img{max-width:86vw;max-height:86vh;border-radius:var(--ui-radius);box-shadow:var(--ui-shadow-3)}.nav,.x{position:absolute;border:none;background:#ffffff1f;color:#fff;cursor:pointer;border-radius:50%}.nav{top:50%;transform:translateY(-50%);width:44px;height:44px;font-size:22px}.prev{left:var(--ui-space-4)}.next{right:var(--ui-space-4)}.x{top:var(--ui-space-4);right:var(--ui-space-4);width:36px;height:36px;font-size:16px}.nav:hover,.x:hover{background:#ffffff40}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiGallery, decorators: [{
            type: Component,
            args: [{ selector: 'ui-gallery', template: `
    <div class="grid" [style.--ui-gallery-min]="minThumb()">
      @for (img of images(); track $index) {
        <button type="button" class="thumb" (click)="openAt($index)" [attr.aria-label]="img.alt || 'Open image'">
          <img [src]="img.thumb || img.src" [alt]="img.alt || ''" loading="lazy" />
        </button>
      }
    </div>
    @if (lightbox() >= 0) {
      <div class="lb" (click)="close()" (keydown.escape)="close()" tabindex="0" role="dialog" aria-label="Image viewer"
           animate.enter="ui-fade-enter" animate.leave="ui-fade-leave">
        <img [src]="current()?.src" [alt]="current()?.alt || ''" (click)="$event.stopPropagation()" />
        <button type="button" class="nav prev" aria-label="Previous" (click)="step(-1, $event)">‹</button>
        <button type="button" class="nav next" aria-label="Next" (click)="step(1, $event)">›</button>
        <button type="button" class="x" aria-label="Close" (click)="close()">✕</button>
      </div>
    }
  `, styles: [":host{display:block}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(var(--ui-gallery-min, 120px),1fr));gap:var(--ui-space-2)}.thumb{padding:0;border:1px solid var(--ui-color-border);border-radius:var(--ui-radius);overflow:hidden;cursor:pointer;background:none;aspect-ratio:1}.thumb:hover{border-color:var(--ui-color-primary)}.thumb:focus-visible{outline:none;box-shadow:var(--ui-focus-ring)}.thumb img{width:100%;height:100%;object-fit:cover;display:block}.lb{position:fixed;inset:0;z-index:var(--ui-z-overlay);display:flex;align-items:center;justify-content:center;background:#000000d9}.lb>img{max-width:86vw;max-height:86vh;border-radius:var(--ui-radius);box-shadow:var(--ui-shadow-3)}.nav,.x{position:absolute;border:none;background:#ffffff1f;color:#fff;cursor:pointer;border-radius:50%}.nav{top:50%;transform:translateY(-50%);width:44px;height:44px;font-size:22px}.prev{left:var(--ui-space-4)}.next{right:var(--ui-space-4)}.x{top:var(--ui-space-4);right:var(--ui-space-4);width:36px;height:36px;font-size:16px}.nav:hover,.x:hover{background:#ffffff40}\n"] }]
        }], propDecorators: { images: [{ type: i0.Input, args: [{ isSignal: true, alias: "images", required: false }] }], minThumb: [{ type: i0.Input, args: [{ isSignal: true, alias: "minThumb", required: false }] }] } });

/**
 * Generated bundle index. Do not edit.
 */

export { UiCarousel, UiGallery };
//# sourceMappingURL=ui-media.mjs.map
