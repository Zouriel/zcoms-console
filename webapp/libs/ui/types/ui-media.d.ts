import * as _angular_core from '@angular/core';
import { OnInit, OnDestroy } from '@angular/core';

interface UiCarouselSlide {
    image: string;
    alt?: string;
    caption?: string;
}
/** `ui-carousel` — image slideshow with arrows, dots, and optional autoplay. */
declare class UiCarousel implements OnInit, OnDestroy {
    slides: _angular_core.InputSignal<UiCarouselSlide[]>;
    /** Autoplay interval in ms; 0 disables. */
    autoplay: _angular_core.InputSignal<number>;
    protected readonly index: _angular_core.WritableSignal<number>;
    protected readonly paused: _angular_core.WritableSignal<boolean>;
    private timer?;
    constructor();
    ngOnInit(): void;
    ngOnDestroy(): void;
    protected next(): void;
    protected prev(): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiCarousel, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiCarousel, "ui-carousel", never, { "slides": { "alias": "slides"; "required": false; "isSignal": true; }; "autoplay": { "alias": "autoplay"; "required": false; "isSignal": true; }; }, {}, never, never, true, never>;
}

interface UiGalleryImage {
    src: string;
    thumb?: string;
    alt?: string;
}
/** `ui-gallery` — responsive thumbnail grid with a lightbox (prev/next, Esc to close). */
declare class UiGallery {
    images: _angular_core.InputSignal<UiGalleryImage[]>;
    minThumb: _angular_core.InputSignal<string>;
    protected readonly lightbox: _angular_core.WritableSignal<number>;
    protected readonly current: _angular_core.Signal<UiGalleryImage>;
    protected openAt(i: number): void;
    protected close(): void;
    protected step(d: number, e: Event): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiGallery, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiGallery, "ui-gallery", never, { "images": { "alias": "images"; "required": false; "isSignal": true; }; "minThumb": { "alias": "minThumb"; "required": false; "isSignal": true; }; }, {}, never, never, true, never>;
}

export { UiCarousel, UiGallery };
export type { UiCarouselSlide, UiGalleryImage };
