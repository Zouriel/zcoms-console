import * as _angular_core from '@angular/core';
import { OnInit, OnDestroy, AfterViewInit } from '@angular/core';

type UiRevealMode = 'up' | 'down' | 'left' | 'right' | 'blur' | 'scale';
/**
 * `uiReveal` — reveals the host as it scrolls into view (IntersectionObserver).
 * Self-contained (applies its own inline transitions; no global CSS needed).
 * Honors `prefers-reduced-motion`.
 *
 *   <div uiReveal>…</div>
 *   <div uiReveal="blur" [revealDelay]="120">…</div>
 */
declare class UiReveal implements OnInit, OnDestroy {
    private host;
    private zone;
    mode: _angular_core.InputSignal<UiRevealMode>;
    revealDelay: _angular_core.InputSignal<number>;
    revealThreshold: _angular_core.InputSignal<number>;
    revealOnce: _angular_core.InputSignal<boolean>;
    duration: _angular_core.InputSignal<number>;
    private io?;
    ngOnInit(): void;
    private show;
    private hide;
    ngOnDestroy(): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiReveal, never>;
    static ɵdir: _angular_core.ɵɵDirectiveDeclaration<UiReveal, "[uiReveal]", never, { "mode": { "alias": "uiReveal"; "required": false; "isSignal": true; }; "revealDelay": { "alias": "revealDelay"; "required": false; "isSignal": true; }; "revealThreshold": { "alias": "revealThreshold"; "required": false; "isSignal": true; }; "revealOnce": { "alias": "revealOnce"; "required": false; "isSignal": true; }; "duration": { "alias": "duration"; "required": false; "isSignal": true; }; }, {}, never, never, true, never>;
}

/**
 * `ui-cursor` — custom cursor: a precise dot plus a lagging ring that grows
 * over interactive elements. Mount once near the app root. Hidden on touch
 * devices and when reduced motion is requested. Pair with `body { cursor: none }`.
 */
declare class UiCursor implements AfterViewInit, OnDestroy {
    private zone;
    /** CSS selector for elements that trigger the enlarged "hover" ring. */
    interactiveSelector: _angular_core.InputSignal<string>;
    private dot;
    private ring;
    protected hover: boolean;
    protected down: boolean;
    protected out: boolean;
    private tx;
    private ty;
    private rx;
    private ry;
    private raf;
    private readonly onMove;
    private readonly onDown;
    private readonly onUp;
    private readonly onLeave;
    private readonly onOver;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiCursor, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiCursor, "ui-cursor", never, { "interactiveSelector": { "alias": "interactiveSelector"; "required": false; "isSignal": true; }; }, {}, never, never, true, never>;
}

/** `ui-scroll-progress` — fixed top bar tracking page scroll, using the brand gradient + glow. */
declare class UiScrollProgress implements AfterViewInit, OnDestroy {
    private zone;
    private bar;
    private readonly onScroll;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiScrollProgress, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiScrollProgress, "ui-scroll-progress", never, {}, {}, never, never, true, never>;
}

/** `ui-marquee` — infinite horizontal scroller with edge fade; pauses on hover. */
declare class UiMarquee {
    items: _angular_core.InputSignal<string[]>;
    duration: _angular_core.InputSignal<number>;
    gap: _angular_core.InputSignal<string>;
    reverse: _angular_core.InputSignal<boolean>;
    separator: _angular_core.InputSignal<string>;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiMarquee, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiMarquee, "ui-marquee", never, { "items": { "alias": "items"; "required": false; "isSignal": true; }; "duration": { "alias": "duration"; "required": false; "isSignal": true; }; "gap": { "alias": "gap"; "required": false; "isSignal": true; }; "reverse": { "alias": "reverse"; "required": false; "isSignal": true; }; "separator": { "alias": "separator"; "required": false; "isSignal": true; }; }, {}, never, never, true, never>;
}

/** `ui-grain` — animated film-grain overlay. Mount once near the app root (fixed, non-interactive). */
declare class UiGrain {
    opacity: _angular_core.InputSignal<number>;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiGrain, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiGrain, "ui-grain", never, { "opacity": { "alias": "opacity"; "required": false; "isSignal": true; }; }, {}, never, never, true, never>;
}

/** `ui-section-label` — editorial mono section marker, e.g. `[ 00 · INDEX ]`. */
declare class UiSectionLabel {
    index: _angular_core.InputSignal<string>;
    label: _angular_core.InputSignal<string>;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiSectionLabel, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiSectionLabel, "ui-section-label", never, { "index": { "alias": "index"; "required": false; "isSignal": true; }; "label": { "alias": "label"; "required": true; "isSignal": true; }; }, {}, never, never, true, never>;
}

/**
 * `uiSplitText` — splits the host's text into per-character spans and animates
 * them in with a stagger (Web Animations API; no global keyframes needed).
 * Best on a single line/heading. Honors `prefers-reduced-motion`.
 *
 *   <h1 uiSplitText>Mohamed</h1>
 */
declare class UiSplitText implements AfterViewInit {
    private host;
    /** Per-character delay (ms). */
    stagger: _angular_core.InputSignal<number>;
    /** Initial delay before the first character (ms). */
    base: _angular_core.InputSignal<number>;
    duration: _angular_core.InputSignal<number>;
    ngAfterViewInit(): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiSplitText, never>;
    static ɵdir: _angular_core.ɵɵDirectiveDeclaration<UiSplitText, "[uiSplitText]", never, { "stagger": { "alias": "stagger"; "required": false; "isSignal": true; }; "base": { "alias": "base"; "required": false; "isSignal": true; }; "duration": { "alias": "duration"; "required": false; "isSignal": true; }; }, {}, never, never, true, never>;
}

/**
 * `ui-intro-loader` — full-screen intro veil that wipes away after `duration`
 * (or when `[(open)]` is set false). Project a logo/wordmark as content.
 */
declare class UiIntroLoader implements OnInit {
    open: _angular_core.ModelSignal<boolean>;
    duration: _angular_core.InputSignal<number>;
    done: _angular_core.OutputEmitterRef<void>;
    protected readonly leaving: _angular_core.WritableSignal<boolean>;
    ngOnInit(): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiIntroLoader, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiIntroLoader, "ui-intro-loader", never, { "open": { "alias": "open"; "required": false; "isSignal": true; }; "duration": { "alias": "duration"; "required": false; "isSignal": true; }; }, { "open": "openChange"; "done": "done"; }, never, ["*"], true, never>;
}

/**
 * `ui-glyph-field` — animated binary/glyph field rendered to a canvas. A
 * reusable, asset-free take on the portfolio's binary-face background: a grid
 * of flickering glyphs lit by a drifting intensity field, tinted along the
 * brand ramp (ember → blood → rose). Use as a fixed page backdrop (`fixed`)
 * or contained within a positioned parent. Honors `prefers-reduced-motion`.
 */
declare class UiGlyphField implements AfterViewInit, OnDestroy {
    private zone;
    private cv;
    fixed: _angular_core.InputSignal<boolean>;
    opacity: _angular_core.InputSignal<number>;
    chars: _angular_core.InputSignal<string>;
    cell: _angular_core.InputSignal<number>;
    speed: _angular_core.InputSignal<number>;
    /** Color ramp dim → mid → bright. Defaults track the dramatic brand ramp. */
    colors: _angular_core.InputSignal<[string, string, string]>;
    private raf;
    private ro?;
    private destroyed;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiGlyphField, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiGlyphField, "ui-glyph-field", never, { "fixed": { "alias": "fixed"; "required": false; "isSignal": true; }; "opacity": { "alias": "opacity"; "required": false; "isSignal": true; }; "chars": { "alias": "chars"; "required": false; "isSignal": true; }; "cell": { "alias": "cell"; "required": false; "isSignal": true; }; "speed": { "alias": "speed"; "required": false; "isSignal": true; }; "colors": { "alias": "colors"; "required": false; "isSignal": true; }; }, {}, never, never, true, never>;
}

/**
 * `uiMagnetic` — the host gently pulls toward the cursor on hover and springs
 * back on leave (a signature "dramatic" micro-interaction). Self-contained;
 * disabled on touch / reduced-motion.
 *
 *   <a uiMagnetic [magneticStrength]="0.4">…</a>
 */
declare class UiMagnetic implements OnInit, OnDestroy {
    private host;
    private zone;
    /** Fraction of the cursor offset the element follows (0–1). */
    magneticStrength: _angular_core.InputSignal<number>;
    /** Extra px around the element that still attracts the cursor. */
    magneticRadius: _angular_core.InputSignal<number>;
    private readonly onMove;
    private readonly onLeave;
    ngOnInit(): void;
    private pull;
    private reset;
    ngOnDestroy(): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiMagnetic, never>;
    static ɵdir: _angular_core.ɵɵDirectiveDeclaration<UiMagnetic, "[uiMagnetic]", never, { "magneticStrength": { "alias": "magneticStrength"; "required": false; "isSignal": true; }; "magneticRadius": { "alias": "magneticRadius"; "required": false; "isSignal": true; }; }, {}, never, never, true, never>;
}

export { UiCursor, UiGlyphField, UiGrain, UiIntroLoader, UiMagnetic, UiMarquee, UiReveal, UiScrollProgress, UiSectionLabel, UiSplitText };
export type { UiRevealMode };
