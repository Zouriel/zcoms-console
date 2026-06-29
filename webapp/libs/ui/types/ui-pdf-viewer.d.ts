import * as _angular_core from '@angular/core';

/**
 * `ui-pdf-viewer` — renders a PDF with page navigation and zoom. `pdfjs-dist`
 * is loaded via a dynamic import so it ships only when this component is used
 * (its own secondary entry point; pair with `@defer` for full lazy loading).
 * Override `workerSrc` to self-host the worker instead of the CDN default.
 */
declare class UiPdfViewer {
    src: _angular_core.InputSignal<string>;
    workerSrc: _angular_core.InputSignal<string | undefined>;
    protected readonly page: _angular_core.WritableSignal<number>;
    protected readonly pages: _angular_core.WritableSignal<number>;
    protected readonly scale: _angular_core.WritableSignal<number>;
    protected readonly loading: _angular_core.WritableSignal<boolean>;
    protected readonly error: _angular_core.WritableSignal<string | null>;
    private readonly canvas;
    private doc;
    constructor();
    private load;
    private render;
    protected prev(): void;
    protected next(): void;
    protected zoomBy(d: number): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiPdfViewer, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiPdfViewer, "ui-pdf-viewer", never, { "src": { "alias": "src"; "required": true; "isSignal": true; }; "workerSrc": { "alias": "workerSrc"; "required": false; "isSignal": true; }; }, {}, never, never, true, never>;
}

export { UiPdfViewer };
