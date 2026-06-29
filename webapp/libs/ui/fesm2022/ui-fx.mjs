import * as i0 from '@angular/core';
import { inject, ElementRef, NgZone, input, Directive, viewChild, Component, model, output, signal } from '@angular/core';

const FROM = {
    up: 'translateY(28px)',
    down: 'translateY(-28px)',
    left: 'translateX(-40px)',
    right: 'translateX(40px)',
    blur: 'translateY(20px)',
    scale: 'scale(0.94)',
};
/**
 * `uiReveal` — reveals the host as it scrolls into view (IntersectionObserver).
 * Self-contained (applies its own inline transitions; no global CSS needed).
 * Honors `prefers-reduced-motion`.
 *
 *   <div uiReveal>…</div>
 *   <div uiReveal="blur" [revealDelay]="120">…</div>
 */
class UiReveal {
    host = inject(ElementRef);
    zone = inject(NgZone);
    mode = input('up', { ...(ngDevMode ? { debugName: "mode" } : /* istanbul ignore next */ {}), alias: 'uiReveal' });
    revealDelay = input(0, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "revealDelay" }] : /* istanbul ignore next */ []));
    revealThreshold = input(0.18, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "revealThreshold" }] : /* istanbul ignore next */ []));
    revealOnce = input(true, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "revealOnce" }] : /* istanbul ignore next */ []));
    duration = input(900, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "duration" }] : /* istanbul ignore next */ []));
    io;
    ngOnInit() {
        const el = this.host.nativeElement;
        const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduce || typeof IntersectionObserver === 'undefined')
            return;
        const mode = this.mode();
        el.style.opacity = '0';
        el.style.willChange = 'opacity, transform, filter';
        if (mode === 'blur')
            el.style.filter = 'blur(18px)';
        if (mode !== 'blur' || true)
            el.style.transform = FROM[mode] ?? FROM.up;
        this.zone.runOutsideAngular(() => {
            this.io = new IntersectionObserver((entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        this.show(el, mode);
                        if (this.revealOnce())
                            this.io?.unobserve(entry.target);
                    }
                    else if (!this.revealOnce()) {
                        this.hide(el, mode);
                    }
                }
            }, { threshold: this.revealThreshold(), rootMargin: '0px 0px -8% 0px' });
            this.io.observe(el);
        });
    }
    show(el, mode) {
        const d = this.duration();
        const ease = 'cubic-bezier(.16,1,.3,1)';
        el.style.transition = `opacity ${d}ms ${ease} ${this.revealDelay()}ms, transform ${d}ms ${ease} ${this.revealDelay()}ms, filter ${d}ms ${ease} ${this.revealDelay()}ms`;
        el.style.opacity = '1';
        el.style.transform = mode === 'scale' ? 'scale(1)' : 'translate(0,0)';
        el.style.filter = 'blur(0)';
    }
    hide(el, mode) {
        el.style.opacity = '0';
        if (mode === 'blur')
            el.style.filter = 'blur(18px)';
        el.style.transform = FROM[mode] ?? FROM.up;
    }
    ngOnDestroy() { this.io?.disconnect(); }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiReveal, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "17.1.0", version: "22.0.4", type: UiReveal, isStandalone: true, selector: "[uiReveal]", inputs: { mode: { classPropertyName: "mode", publicName: "uiReveal", isSignal: true, isRequired: false, transformFunction: null }, revealDelay: { classPropertyName: "revealDelay", publicName: "revealDelay", isSignal: true, isRequired: false, transformFunction: null }, revealThreshold: { classPropertyName: "revealThreshold", publicName: "revealThreshold", isSignal: true, isRequired: false, transformFunction: null }, revealOnce: { classPropertyName: "revealOnce", publicName: "revealOnce", isSignal: true, isRequired: false, transformFunction: null }, duration: { classPropertyName: "duration", publicName: "duration", isSignal: true, isRequired: false, transformFunction: null } }, ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiReveal, decorators: [{
            type: Directive,
            args: [{
                    selector: '[uiReveal]',
                }]
        }], propDecorators: { mode: [{ type: i0.Input, args: [{ isSignal: true, alias: "uiReveal", required: false }] }], revealDelay: [{ type: i0.Input, args: [{ isSignal: true, alias: "revealDelay", required: false }] }], revealThreshold: [{ type: i0.Input, args: [{ isSignal: true, alias: "revealThreshold", required: false }] }], revealOnce: [{ type: i0.Input, args: [{ isSignal: true, alias: "revealOnce", required: false }] }], duration: [{ type: i0.Input, args: [{ isSignal: true, alias: "duration", required: false }] }] } });

/**
 * `ui-cursor` — custom cursor: a precise dot plus a lagging ring that grows
 * over interactive elements. Mount once near the app root. Hidden on touch
 * devices and when reduced motion is requested. Pair with `body { cursor: none }`.
 */
class UiCursor {
    zone = inject(NgZone);
    /** CSS selector for elements that trigger the enlarged "hover" ring. */
    interactiveSelector = input('a, button, [data-magnetic], input, textarea, select, [role="button"]', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "interactiveSelector" }] : /* istanbul ignore next */ []));
    dot = viewChild.required('dot');
    ring = viewChild.required('ring');
    hover = false;
    down = false;
    out = false;
    tx = 0;
    ty = 0;
    rx = 0;
    ry = 0;
    raf = 0;
    onMove = (e) => { this.tx = e.clientX; this.ty = e.clientY; this.out = false; };
    onDown = () => (this.down = true);
    onUp = () => (this.down = false);
    onLeave = () => (this.out = true);
    onOver = (e) => {
        const t = e.target;
        this.hover = !!t?.closest?.(this.interactiveSelector());
    };
    ngAfterViewInit() {
        if (typeof window === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches)
            return;
        window.addEventListener('pointermove', this.onMove, { passive: true });
        window.addEventListener('pointerdown', this.onDown, { passive: true });
        window.addEventListener('pointerup', this.onUp, { passive: true });
        window.addEventListener('pointerleave', this.onLeave, { passive: true });
        document.addEventListener('pointerover', this.onOver, true);
        this.zone.runOutsideAngular(() => {
            const tick = () => {
                this.rx += (this.tx - this.rx) * 0.18;
                this.ry += (this.ty - this.ry) * 0.18;
                this.dot().nativeElement.style.transform = `translate3d(${this.tx - 3}px, ${this.ty - 3}px, 0)`;
                this.ring().nativeElement.style.transform = `translate3d(${this.rx - 19}px, ${this.ry - 19}px, 0)`;
                this.raf = requestAnimationFrame(tick);
            };
            tick();
        });
    }
    ngOnDestroy() {
        cancelAnimationFrame(this.raf);
        window.removeEventListener('pointermove', this.onMove);
        window.removeEventListener('pointerdown', this.onDown);
        window.removeEventListener('pointerup', this.onUp);
        window.removeEventListener('pointerleave', this.onLeave);
        document.removeEventListener('pointerover', this.onOver, true);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiCursor, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.2.0", version: "22.0.4", type: UiCursor, isStandalone: true, selector: "ui-cursor", inputs: { interactiveSelector: { classPropertyName: "interactiveSelector", publicName: "interactiveSelector", isSignal: true, isRequired: false, transformFunction: null } }, host: { properties: { "class.hover": "hover", "class.down": "down", "class.out": "out" } }, viewQueries: [{ propertyName: "dot", first: true, predicate: ["dot"], descendants: true, isSignal: true }, { propertyName: "ring", first: true, predicate: ["ring"], descendants: true, isSignal: true }], ngImport: i0, template: `
    <div #ring class="ring" aria-hidden="true"></div>
    <div #dot class="dot" aria-hidden="true"></div>
  `, isInline: true, styles: [":host{position:fixed;inset:0;pointer-events:none;z-index:var(--ui-z-toast, 1200)}.dot,.ring{position:fixed;top:0;left:0;pointer-events:none;will-change:transform,width,height,opacity;mix-blend-mode:difference}.dot{width:6px;height:6px;border-radius:9999px;background:#fff;transform:translate3d(-100px,-100px,0);transition:opacity .25s ease}.ring{width:38px;height:38px;border-radius:9999px;border:1px solid rgba(255,255,255,.85);transform:translate3d(-100px,-100px,0);transition:width .35s cubic-bezier(.16,1,.3,1),height .35s cubic-bezier(.16,1,.3,1),border-color .25s ease,background .25s ease,opacity .25s ease}:host(.hover) .ring{width:64px;height:64px;background:#ffffff0f;border-color:#fffffff2}:host(.down) .ring{width:28px;height:28px}:host(.out) .dot,:host(.out) .ring{opacity:0}@media(pointer:coarse){:host{display:none}}@media(prefers-reduced-motion:reduce){:host{display:none}}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiCursor, decorators: [{
            type: Component,
            args: [{ selector: 'ui-cursor', template: `
    <div #ring class="ring" aria-hidden="true"></div>
    <div #dot class="dot" aria-hidden="true"></div>
  `, host: {
                        '[class.hover]': 'hover',
                        '[class.down]': 'down',
                        '[class.out]': 'out',
                    }, styles: [":host{position:fixed;inset:0;pointer-events:none;z-index:var(--ui-z-toast, 1200)}.dot,.ring{position:fixed;top:0;left:0;pointer-events:none;will-change:transform,width,height,opacity;mix-blend-mode:difference}.dot{width:6px;height:6px;border-radius:9999px;background:#fff;transform:translate3d(-100px,-100px,0);transition:opacity .25s ease}.ring{width:38px;height:38px;border-radius:9999px;border:1px solid rgba(255,255,255,.85);transform:translate3d(-100px,-100px,0);transition:width .35s cubic-bezier(.16,1,.3,1),height .35s cubic-bezier(.16,1,.3,1),border-color .25s ease,background .25s ease,opacity .25s ease}:host(.hover) .ring{width:64px;height:64px;background:#ffffff0f;border-color:#fffffff2}:host(.down) .ring{width:28px;height:28px}:host(.out) .dot,:host(.out) .ring{opacity:0}@media(pointer:coarse){:host{display:none}}@media(prefers-reduced-motion:reduce){:host{display:none}}\n"] }]
        }], propDecorators: { interactiveSelector: [{ type: i0.Input, args: [{ isSignal: true, alias: "interactiveSelector", required: false }] }], dot: [{ type: i0.ViewChild, args: ['dot', { isSignal: true }] }], ring: [{ type: i0.ViewChild, args: ['ring', { isSignal: true }] }] } });

/** `ui-scroll-progress` — fixed top bar tracking page scroll, using the brand gradient + glow. */
class UiScrollProgress {
    zone = inject(NgZone);
    bar = viewChild.required('bar');
    onScroll = () => {
        const doc = document.documentElement;
        const max = doc.scrollHeight - window.innerHeight;
        const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
        this.bar().nativeElement.style.width = `${pct}%`;
    };
    ngAfterViewInit() {
        this.zone.runOutsideAngular(() => { window.addEventListener('scroll', this.onScroll, { passive: true }); this.onScroll(); });
    }
    ngOnDestroy() { window.removeEventListener('scroll', this.onScroll); }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiScrollProgress, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.2.0", version: "22.0.4", type: UiScrollProgress, isStandalone: true, selector: "ui-scroll-progress", viewQueries: [{ propertyName: "bar", first: true, predicate: ["bar"], descendants: true, isSignal: true }], ngImport: i0, template: `<div #bar class="bar" aria-hidden="true"></div>`, isInline: true, styles: [":host{position:fixed;top:0;left:0;right:0;height:2px;z-index:var(--ui-z-overlay, 1000);pointer-events:none;background:#ffffff0d}.bar{height:100%;width:0%;background:var(--ui-gradient-brand, linear-gradient(90deg, var(--ui-color-primary), var(--ui-color-primary-hover)));box-shadow:var(--ui-glow-amber, 0 0 12px color-mix(in srgb, var(--ui-color-primary) 60%, transparent));transform-origin:left center;will-change:width;transition:width .08s linear}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiScrollProgress, decorators: [{
            type: Component,
            args: [{ selector: 'ui-scroll-progress', template: `<div #bar class="bar" aria-hidden="true"></div>`, styles: [":host{position:fixed;top:0;left:0;right:0;height:2px;z-index:var(--ui-z-overlay, 1000);pointer-events:none;background:#ffffff0d}.bar{height:100%;width:0%;background:var(--ui-gradient-brand, linear-gradient(90deg, var(--ui-color-primary), var(--ui-color-primary-hover)));box-shadow:var(--ui-glow-amber, 0 0 12px color-mix(in srgb, var(--ui-color-primary) 60%, transparent));transform-origin:left center;will-change:width;transition:width .08s linear}\n"] }]
        }], propDecorators: { bar: [{ type: i0.ViewChild, args: ['bar', { isSignal: true }] }] } });

/** `ui-marquee` — infinite horizontal scroller with edge fade; pauses on hover. */
class UiMarquee {
    items = input([], /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "items" }] : /* istanbul ignore next */ []));
    duration = input(38, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "duration" }] : /* istanbul ignore next */ []));
    gap = input('3rem', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "gap" }] : /* istanbul ignore next */ []));
    reverse = input(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "reverse" }] : /* istanbul ignore next */ []));
    separator = input('✦', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "separator" }] : /* istanbul ignore next */ []));
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiMarquee, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "22.0.4", type: UiMarquee, isStandalone: true, selector: "ui-marquee", inputs: { items: { classPropertyName: "items", publicName: "items", isSignal: true, isRequired: false, transformFunction: null }, duration: { classPropertyName: "duration", publicName: "duration", isSignal: true, isRequired: false, transformFunction: null }, gap: { classPropertyName: "gap", publicName: "gap", isSignal: true, isRequired: false, transformFunction: null }, reverse: { classPropertyName: "reverse", publicName: "reverse", isSignal: true, isRequired: false, transformFunction: null }, separator: { classPropertyName: "separator", publicName: "separator", isSignal: true, isRequired: false, transformFunction: null } }, ngImport: i0, template: `
    <div class="marquee" [style.--dur]="duration() + 's'" [style.--gap]="gap()">
      <div class="track" [class.reverse]="reverse()">
        @for (item of items(); track $index) {
          <span class="m-item"><span class="txt">{{ item }}</span><span class="star">{{ separator() }}</span></span>
        }
      </div>
      <div class="track" [class.reverse]="reverse()" aria-hidden="true">
        @for (item of items(); track $index) {
          <span class="m-item"><span class="txt">{{ item }}</span><span class="star">{{ separator() }}</span></span>
        }
      </div>
    </div>
  `, isInline: true, styles: [":host{display:block}.marquee{display:flex;gap:var(--gap, 3rem);overflow:hidden;mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent);-webkit-mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)}.track{display:flex;gap:var(--gap, 3rem);flex-shrink:0;animation:ui-marquee var(--dur, 38s) linear infinite}.track.reverse{animation-direction:reverse}.marquee:hover .track{animation-play-state:paused}.m-item{display:inline-flex;align-items:center;gap:.85rem;white-space:nowrap;font-family:var(--ui-font-display);font-weight:500;color:var(--ui-color-text);font-size:clamp(1.1rem,2.4vw,1.9rem)}.m-item:nth-child(2n) .txt{opacity:.35}.star{color:var(--ui-color-danger);font-size:.7em}@keyframes ui-marquee{0%{transform:translate(0)}to{transform:translate(calc(-100% - var(--gap, 3rem)))}}@media(prefers-reduced-motion:reduce){.track{animation:none}}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiMarquee, decorators: [{
            type: Component,
            args: [{ selector: 'ui-marquee', template: `
    <div class="marquee" [style.--dur]="duration() + 's'" [style.--gap]="gap()">
      <div class="track" [class.reverse]="reverse()">
        @for (item of items(); track $index) {
          <span class="m-item"><span class="txt">{{ item }}</span><span class="star">{{ separator() }}</span></span>
        }
      </div>
      <div class="track" [class.reverse]="reverse()" aria-hidden="true">
        @for (item of items(); track $index) {
          <span class="m-item"><span class="txt">{{ item }}</span><span class="star">{{ separator() }}</span></span>
        }
      </div>
    </div>
  `, styles: [":host{display:block}.marquee{display:flex;gap:var(--gap, 3rem);overflow:hidden;mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent);-webkit-mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)}.track{display:flex;gap:var(--gap, 3rem);flex-shrink:0;animation:ui-marquee var(--dur, 38s) linear infinite}.track.reverse{animation-direction:reverse}.marquee:hover .track{animation-play-state:paused}.m-item{display:inline-flex;align-items:center;gap:.85rem;white-space:nowrap;font-family:var(--ui-font-display);font-weight:500;color:var(--ui-color-text);font-size:clamp(1.1rem,2.4vw,1.9rem)}.m-item:nth-child(2n) .txt{opacity:.35}.star{color:var(--ui-color-danger);font-size:.7em}@keyframes ui-marquee{0%{transform:translate(0)}to{transform:translate(calc(-100% - var(--gap, 3rem)))}}@media(prefers-reduced-motion:reduce){.track{animation:none}}\n"] }]
        }], propDecorators: { items: [{ type: i0.Input, args: [{ isSignal: true, alias: "items", required: false }] }], duration: [{ type: i0.Input, args: [{ isSignal: true, alias: "duration", required: false }] }], gap: [{ type: i0.Input, args: [{ isSignal: true, alias: "gap", required: false }] }], reverse: [{ type: i0.Input, args: [{ isSignal: true, alias: "reverse", required: false }] }], separator: [{ type: i0.Input, args: [{ isSignal: true, alias: "separator", required: false }] }] } });

/** `ui-grain` — animated film-grain overlay. Mount once near the app root (fixed, non-interactive). */
class UiGrain {
    opacity = input(0.06, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "opacity" }] : /* istanbul ignore next */ []));
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiGrain, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.1.0", version: "22.0.4", type: UiGrain, isStandalone: true, selector: "ui-grain", inputs: { opacity: { classPropertyName: "opacity", publicName: "opacity", isSignal: true, isRequired: false, transformFunction: null } }, ngImport: i0, template: `<div class="grain" aria-hidden="true" [style.opacity]="opacity()"></div>`, isInline: true, styles: [":host{display:contents}.grain{position:fixed;inset:-50%;pointer-events:none;z-index:9;mix-blend-mode:overlay;background-image:url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' seed='3'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.85'/></svg>\");animation:ui-grain-shift 8s steps(8) infinite}@keyframes ui-grain-shift{0%{transform:translate(0)}20%{transform:translate(-2%,1%)}40%{transform:translate(1%,-2%)}60%{transform:translate(-1%,2%)}80%{transform:translate(2%,-1%)}to{transform:translate(0)}}@media(prefers-reduced-motion:reduce){.grain{display:none}}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiGrain, decorators: [{
            type: Component,
            args: [{ selector: 'ui-grain', template: `<div class="grain" aria-hidden="true" [style.opacity]="opacity()"></div>`, styles: [":host{display:contents}.grain{position:fixed;inset:-50%;pointer-events:none;z-index:9;mix-blend-mode:overlay;background-image:url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' seed='3'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.85'/></svg>\");animation:ui-grain-shift 8s steps(8) infinite}@keyframes ui-grain-shift{0%{transform:translate(0)}20%{transform:translate(-2%,1%)}40%{transform:translate(1%,-2%)}60%{transform:translate(-1%,2%)}80%{transform:translate(2%,-1%)}to{transform:translate(0)}}@media(prefers-reduced-motion:reduce){.grain{display:none}}\n"] }]
        }], propDecorators: { opacity: [{ type: i0.Input, args: [{ isSignal: true, alias: "opacity", required: false }] }] } });

/** `ui-section-label` — editorial mono section marker, e.g. `[ 00 · INDEX ]`. */
class UiSectionLabel {
    index = input('', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "index" }] : /* istanbul ignore next */ []));
    label = input.required(/* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "label" }] : /* istanbul ignore next */ []));
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiSectionLabel, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "22.0.4", type: UiSectionLabel, isStandalone: true, selector: "ui-section-label", inputs: { index: { classPropertyName: "index", publicName: "index", isSignal: true, isRequired: false, transformFunction: null }, label: { classPropertyName: "label", publicName: "label", isSignal: true, isRequired: true, transformFunction: null } }, ngImport: i0, template: `
    <div class="sl">
      <span class="br">[</span>
      @if (index()) { <span class="idx">{{ index() }}</span><span class="dot">·</span> }
      <span class="label">{{ label() }}</span>
      <span class="br">]</span>
      <span class="rule"></span>
    </div>
  `, isInline: true, styles: [":host{display:block}.sl{display:inline-flex;align-items:center;gap:.75rem;font-family:var(--ui-font-mono);font-size:11px;text-transform:uppercase;letter-spacing:.4em;color:var(--ui-color-text-muted)}.br{color:color-mix(in srgb,var(--ui-color-danger) 80%,transparent)}.idx{color:var(--ui-color-text)}.dot{opacity:.4}.label{color:var(--ui-color-text)}.rule{height:1px;width:3rem;background:linear-gradient(90deg,var(--ui-color-border),transparent)}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiSectionLabel, decorators: [{
            type: Component,
            args: [{ selector: 'ui-section-label', template: `
    <div class="sl">
      <span class="br">[</span>
      @if (index()) { <span class="idx">{{ index() }}</span><span class="dot">·</span> }
      <span class="label">{{ label() }}</span>
      <span class="br">]</span>
      <span class="rule"></span>
    </div>
  `, styles: [":host{display:block}.sl{display:inline-flex;align-items:center;gap:.75rem;font-family:var(--ui-font-mono);font-size:11px;text-transform:uppercase;letter-spacing:.4em;color:var(--ui-color-text-muted)}.br{color:color-mix(in srgb,var(--ui-color-danger) 80%,transparent)}.idx{color:var(--ui-color-text)}.dot{opacity:.4}.label{color:var(--ui-color-text)}.rule{height:1px;width:3rem;background:linear-gradient(90deg,var(--ui-color-border),transparent)}\n"] }]
        }], propDecorators: { index: [{ type: i0.Input, args: [{ isSignal: true, alias: "index", required: false }] }], label: [{ type: i0.Input, args: [{ isSignal: true, alias: "label", required: true }] }] } });

/**
 * `uiSplitText` — splits the host's text into per-character spans and animates
 * them in with a stagger (Web Animations API; no global keyframes needed).
 * Best on a single line/heading. Honors `prefers-reduced-motion`.
 *
 *   <h1 uiSplitText>Mohamed</h1>
 */
class UiSplitText {
    host = inject(ElementRef);
    /** Per-character delay (ms). */
    stagger = input(35, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "stagger" }] : /* istanbul ignore next */ []));
    /** Initial delay before the first character (ms). */
    base = input(120, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "base" }] : /* istanbul ignore next */ []));
    duration = input(900, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "duration" }] : /* istanbul ignore next */ []));
    ngAfterViewInit() {
        const el = this.host.nativeElement;
        const text = el.textContent ?? '';
        if (!text.trim())
            return;
        const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        el.textContent = '';
        const frag = document.createDocumentFragment();
        const spans = [];
        for (const ch of Array.from(text)) {
            const span = document.createElement('span');
            span.textContent = ch === ' ' ? ' ' : ch;
            span.style.display = 'inline-block';
            span.style.willChange = 'transform, opacity';
            frag.appendChild(span);
            spans.push(span);
        }
        el.appendChild(frag);
        if (reduce || typeof Element.prototype.animate !== 'function')
            return;
        spans.forEach((span, i) => {
            span.animate([
                { opacity: 0, transform: 'translateY(0.9em) rotate(8deg)' },
                { opacity: 1, transform: 'translateY(0) rotate(0)' },
            ], { duration: this.duration(), delay: this.base() + i * this.stagger(), easing: 'cubic-bezier(.16,1,.3,1)', fill: 'both' });
        });
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiSplitText, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "17.1.0", version: "22.0.4", type: UiSplitText, isStandalone: true, selector: "[uiSplitText]", inputs: { stagger: { classPropertyName: "stagger", publicName: "stagger", isSignal: true, isRequired: false, transformFunction: null }, base: { classPropertyName: "base", publicName: "base", isSignal: true, isRequired: false, transformFunction: null }, duration: { classPropertyName: "duration", publicName: "duration", isSignal: true, isRequired: false, transformFunction: null } }, ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiSplitText, decorators: [{
            type: Directive,
            args: [{
                    selector: '[uiSplitText]',
                }]
        }], propDecorators: { stagger: [{ type: i0.Input, args: [{ isSignal: true, alias: "stagger", required: false }] }], base: [{ type: i0.Input, args: [{ isSignal: true, alias: "base", required: false }] }], duration: [{ type: i0.Input, args: [{ isSignal: true, alias: "duration", required: false }] }] } });

/**
 * `ui-intro-loader` — full-screen intro veil that wipes away after `duration`
 * (or when `[(open)]` is set false). Project a logo/wordmark as content.
 */
class UiIntroLoader {
    open = model(true, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "open" }] : /* istanbul ignore next */ []));
    duration = input(1400, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "duration" }] : /* istanbul ignore next */ []));
    done = output();
    leaving = signal(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "leaving" }] : /* istanbul ignore next */ []));
    ngOnInit() {
        if (typeof window === 'undefined')
            return;
        setTimeout(() => this.leaving.set(true), this.duration());
        setTimeout(() => { this.open.set(false); this.done.emit(); }, this.duration() + 650);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiIntroLoader, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "22.0.4", type: UiIntroLoader, isStandalone: true, selector: "ui-intro-loader", inputs: { open: { classPropertyName: "open", publicName: "open", isSignal: true, isRequired: false, transformFunction: null }, duration: { classPropertyName: "duration", publicName: "duration", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { open: "openChange", done: "done" }, host: { properties: { "style.--ui-intro-dur": "duration() + \"ms\"" } }, ngImport: i0, template: `
    @if (open()) {
      <div class="veil" [class.leaving]="leaving()">
        <div class="inner">
          <ng-content />
          <div class="track"><div class="fill"></div></div>
        </div>
      </div>
    }
  `, isInline: true, styles: [":host{display:contents}.veil{position:fixed;inset:0;z-index:var(--ui-z-toast, 1200);display:flex;align-items:center;justify-content:center;background:var(--ui-color-bg);transition:opacity .6s cubic-bezier(.16,1,.3,1),transform .7s cubic-bezier(.16,1,.3,1)}.veil.leaving{opacity:0;transform:translateY(-3%);pointer-events:none}.inner{display:flex;flex-direction:column;align-items:center;gap:var(--ui-space-4);font-family:var(--ui-font-display);color:var(--ui-color-text)}.track{width:160px;height:2px;background:var(--ui-color-border);border-radius:999px;overflow:hidden}.fill{height:100%;width:0;border-radius:inherit;background:var(--ui-gradient-brand, linear-gradient(90deg, var(--ui-color-primary), var(--ui-color-primary-hover)));box-shadow:var(--ui-glow-amber, none);animation:ui-intro-fill var(--ui-intro-dur, 1.4s) cubic-bezier(.16,1,.3,1) forwards}@keyframes ui-intro-fill{0%{width:0}to{width:100%}}@media(prefers-reduced-motion:reduce){.veil{transition:none}.fill{animation:none;width:100%}}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiIntroLoader, decorators: [{
            type: Component,
            args: [{ selector: 'ui-intro-loader', template: `
    @if (open()) {
      <div class="veil" [class.leaving]="leaving()">
        <div class="inner">
          <ng-content />
          <div class="track"><div class="fill"></div></div>
        </div>
      </div>
    }
  `, host: { '[style.--ui-intro-dur]': 'duration() + "ms"' }, styles: [":host{display:contents}.veil{position:fixed;inset:0;z-index:var(--ui-z-toast, 1200);display:flex;align-items:center;justify-content:center;background:var(--ui-color-bg);transition:opacity .6s cubic-bezier(.16,1,.3,1),transform .7s cubic-bezier(.16,1,.3,1)}.veil.leaving{opacity:0;transform:translateY(-3%);pointer-events:none}.inner{display:flex;flex-direction:column;align-items:center;gap:var(--ui-space-4);font-family:var(--ui-font-display);color:var(--ui-color-text)}.track{width:160px;height:2px;background:var(--ui-color-border);border-radius:999px;overflow:hidden}.fill{height:100%;width:0;border-radius:inherit;background:var(--ui-gradient-brand, linear-gradient(90deg, var(--ui-color-primary), var(--ui-color-primary-hover)));box-shadow:var(--ui-glow-amber, none);animation:ui-intro-fill var(--ui-intro-dur, 1.4s) cubic-bezier(.16,1,.3,1) forwards}@keyframes ui-intro-fill{0%{width:0}to{width:100%}}@media(prefers-reduced-motion:reduce){.veil{transition:none}.fill{animation:none;width:100%}}\n"] }]
        }], propDecorators: { open: [{ type: i0.Input, args: [{ isSignal: true, alias: "open", required: false }] }, { type: i0.Output, args: ["openChange"] }], duration: [{ type: i0.Input, args: [{ isSignal: true, alias: "duration", required: false }] }], done: [{ type: i0.Output, args: ["done"] }] } });

/**
 * `ui-glyph-field` — animated binary/glyph field rendered to a canvas. A
 * reusable, asset-free take on the portfolio's binary-face background: a grid
 * of flickering glyphs lit by a drifting intensity field, tinted along the
 * brand ramp (ember → blood → rose). Use as a fixed page backdrop (`fixed`)
 * or contained within a positioned parent. Honors `prefers-reduced-motion`.
 */
class UiGlyphField {
    zone = inject(NgZone);
    cv = viewChild.required('cv');
    fixed = input(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "fixed" }] : /* istanbul ignore next */ []));
    opacity = input(0.55, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "opacity" }] : /* istanbul ignore next */ []));
    chars = input('01', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "chars" }] : /* istanbul ignore next */ []));
    cell = input(16, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "cell" }] : /* istanbul ignore next */ []));
    speed = input(1, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "speed" }] : /* istanbul ignore next */ []));
    /** Color ramp dim → mid → bright. Defaults track the dramatic brand ramp. */
    colors = input(['#5a2832', '#e63946', '#fbbf24'], /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "colors" }] : /* istanbul ignore next */ []));
    raf = 0;
    ro;
    destroyed = false;
    ngAfterViewInit() {
        if (typeof window === 'undefined')
            return;
        const canvas = this.cv().nativeElement;
        const ctx = canvas.getContext('2d');
        if (!ctx)
            return;
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const glyphs = this.chars();
        const [cDim, cMid, cBright] = this.colors();
        let w = 0, h = 0, cols = 0, rows = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
        const size = () => {
            const r = canvas.getBoundingClientRect();
            w = Math.max(1, r.width);
            h = Math.max(1, r.height);
            canvas.width = Math.floor(w * dpr);
            canvas.height = Math.floor(h * dpr);
            const cs = this.cell();
            cols = Math.ceil(w / cs);
            rows = Math.ceil(h / cs);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.font = `700 ${Math.round(this.cell() * 0.82)}px ui-monospace, Menlo, monospace`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
        };
        size();
        this.ro = new ResizeObserver(() => size());
        this.ro.observe(canvas);
        const hash = (x, y) => {
            const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
            return s - Math.floor(s);
        };
        const lerpColor = (a, b, t) => {
            const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
            const ar = pa >> 16, ag = (pa >> 8) & 255, ab = pa & 255;
            const br = pb >> 16, bg = (pb >> 8) & 255, bb = pb & 255;
            return `rgb(${Math.round(ar + (br - ar) * t)},${Math.round(ag + (bg - ag) * t)},${Math.round(ab + (bb - ab) * t)})`;
        };
        const cs = () => this.cell();
        const draw = (time) => {
            if (this.destroyed)
                return;
            const t = time * 0.001 * this.speed();
            ctx.clearRect(0, 0, w, h);
            const c = cs();
            for (let gy = 0; gy < rows; gy++) {
                for (let gx = 0; gx < cols; gx++) {
                    // drifting intensity field, brightest toward centre
                    const nx = gx / cols - 0.5, ny = gy / rows - 0.5;
                    const wave = Math.sin(gx * 0.18 + t * 0.9) * 0.5 + Math.cos(gy * 0.21 - t * 0.7) * 0.5;
                    const radial = 1 - Math.min(1, Math.hypot(nx, ny) * 1.7);
                    let lum = radial * 0.7 + wave * 0.25 + 0.05;
                    if (lum < 0.12)
                        continue;
                    const h0 = hash(gx, gy);
                    const phase = Math.floor(t * 0.9 + h0 * 9);
                    const flick = hash(gx + phase, gy + 7) > 0.86 ? 1 : 0;
                    const idx = (Math.floor(h0 * glyphs.length) + flick) % glyphs.length;
                    const col = lum < 0.4 ? lerpColor(cDim, cMid, lum / 0.4) : lerpColor(cMid, cBright, (lum - 0.4) / 0.6);
                    ctx.globalAlpha = Math.min(1, lum * 1.2);
                    ctx.fillStyle = col;
                    ctx.fillText(glyphs[idx], gx * c + c / 2, gy * c + c / 2);
                }
            }
            ctx.globalAlpha = 1;
            if (!reduce)
                this.raf = requestAnimationFrame(draw);
        };
        this.zone.runOutsideAngular(() => {
            if (reduce) {
                draw(0);
            }
            else {
                this.raf = requestAnimationFrame(draw);
            }
        });
    }
    ngOnDestroy() {
        this.destroyed = true;
        if (this.raf)
            cancelAnimationFrame(this.raf);
        this.ro?.disconnect();
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiGlyphField, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.2.0", version: "22.0.4", type: UiGlyphField, isStandalone: true, selector: "ui-glyph-field", inputs: { fixed: { classPropertyName: "fixed", publicName: "fixed", isSignal: true, isRequired: false, transformFunction: null }, opacity: { classPropertyName: "opacity", publicName: "opacity", isSignal: true, isRequired: false, transformFunction: null }, chars: { classPropertyName: "chars", publicName: "chars", isSignal: true, isRequired: false, transformFunction: null }, cell: { classPropertyName: "cell", publicName: "cell", isSignal: true, isRequired: false, transformFunction: null }, speed: { classPropertyName: "speed", publicName: "speed", isSignal: true, isRequired: false, transformFunction: null }, colors: { classPropertyName: "colors", publicName: "colors", isSignal: true, isRequired: false, transformFunction: null } }, viewQueries: [{ propertyName: "cv", first: true, predicate: ["cv"], descendants: true, isSignal: true }], ngImport: i0, template: `<canvas #cv class="gf" [class.fixed]="fixed()" [style.opacity]="opacity()" aria-hidden="true"></canvas>`, isInline: true, styles: [":host{display:contents}.gf{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;mix-blend-mode:screen}.gf.fixed{position:fixed;z-index:0}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiGlyphField, decorators: [{
            type: Component,
            args: [{ selector: 'ui-glyph-field', template: `<canvas #cv class="gf" [class.fixed]="fixed()" [style.opacity]="opacity()" aria-hidden="true"></canvas>`, styles: [":host{display:contents}.gf{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;mix-blend-mode:screen}.gf.fixed{position:fixed;z-index:0}\n"] }]
        }], propDecorators: { cv: [{ type: i0.ViewChild, args: ['cv', { isSignal: true }] }], fixed: [{ type: i0.Input, args: [{ isSignal: true, alias: "fixed", required: false }] }], opacity: [{ type: i0.Input, args: [{ isSignal: true, alias: "opacity", required: false }] }], chars: [{ type: i0.Input, args: [{ isSignal: true, alias: "chars", required: false }] }], cell: [{ type: i0.Input, args: [{ isSignal: true, alias: "cell", required: false }] }], speed: [{ type: i0.Input, args: [{ isSignal: true, alias: "speed", required: false }] }], colors: [{ type: i0.Input, args: [{ isSignal: true, alias: "colors", required: false }] }] } });

/**
 * `uiMagnetic` — the host gently pulls toward the cursor on hover and springs
 * back on leave (a signature "dramatic" micro-interaction). Self-contained;
 * disabled on touch / reduced-motion.
 *
 *   <a uiMagnetic [magneticStrength]="0.4">…</a>
 */
class UiMagnetic {
    host = inject(ElementRef);
    zone = inject(NgZone);
    /** Fraction of the cursor offset the element follows (0–1). */
    magneticStrength = input(0.35, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "magneticStrength" }] : /* istanbul ignore next */ []));
    /** Extra px around the element that still attracts the cursor. */
    magneticRadius = input(0, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "magneticRadius" }] : /* istanbul ignore next */ []));
    onMove = (e) => this.pull(e);
    onLeave = () => this.reset();
    ngOnInit() {
        if (typeof window === 'undefined' || window.matchMedia('(pointer: coarse)').matches ||
            window.matchMedia('(prefers-reduced-motion: reduce)').matches)
            return;
        const el = this.host.nativeElement;
        el.style.transition = 'transform .35s cubic-bezier(.16,1,.3,1)';
        el.style.willChange = 'transform';
        this.zone.runOutsideAngular(() => {
            el.addEventListener('pointermove', this.onMove);
            el.addEventListener('pointerleave', this.onLeave);
        });
    }
    pull(e) {
        const el = this.host.nativeElement;
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        const s = this.magneticStrength();
        el.style.transform = `translate(${dx * s}px, ${dy * s}px)`;
    }
    reset() {
        this.host.nativeElement.style.transform = 'translate(0,0)';
    }
    ngOnDestroy() {
        const el = this.host.nativeElement;
        el.removeEventListener('pointermove', this.onMove);
        el.removeEventListener('pointerleave', this.onLeave);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiMagnetic, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "17.1.0", version: "22.0.4", type: UiMagnetic, isStandalone: true, selector: "[uiMagnetic]", inputs: { magneticStrength: { classPropertyName: "magneticStrength", publicName: "magneticStrength", isSignal: true, isRequired: false, transformFunction: null }, magneticRadius: { classPropertyName: "magneticRadius", publicName: "magneticRadius", isSignal: true, isRequired: false, transformFunction: null } }, host: { attributes: { "data-magnetic": "" } }, ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiMagnetic, decorators: [{
            type: Directive,
            args: [{
                    selector: '[uiMagnetic]',
                    host: { 'data-magnetic': '' },
                }]
        }], propDecorators: { magneticStrength: [{ type: i0.Input, args: [{ isSignal: true, alias: "magneticStrength", required: false }] }], magneticRadius: [{ type: i0.Input, args: [{ isSignal: true, alias: "magneticRadius", required: false }] }] } });

/**
 * Generated bundle index. Do not edit.
 */

export { UiCursor, UiGlyphField, UiGrain, UiIntroLoader, UiMagnetic, UiMarquee, UiReveal, UiScrollProgress, UiSectionLabel, UiSplitText };
//# sourceMappingURL=ui-fx.mjs.map
