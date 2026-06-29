import * as _angular_core from '@angular/core';
import { ElementRef } from '@angular/core';

/** `ui-image-viewer` — zoom (buttons/wheel), pan (drag), and fit/reset. */
declare class UiImageViewer {
    src: _angular_core.InputSignal<string>;
    alt: _angular_core.InputSignal<string>;
    protected readonly zoom: _angular_core.WritableSignal<number>;
    protected readonly offset: _angular_core.WritableSignal<{
        x: number;
        y: number;
    }>;
    private panning;
    private last;
    protected readonly transform: _angular_core.Signal<string>;
    protected zoomBy(d: number): void;
    protected onWheel(e: WheelEvent): void;
    protected reset(): void;
    protected startPan(e: PointerEvent): void;
    protected pan(e: PointerEvent): void;
    protected endPan(): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiImageViewer, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiImageViewer, "ui-image-viewer", never, { "src": { "alias": "src"; "required": true; "isSignal": true; }; "alt": { "alias": "alt"; "required": false; "isSignal": true; }; }, {}, never, never, true, never>;
}

declare function fmt$1(s: number): string;
/** `ui-video-player` — native `<video>` with themed controls (play, scrub, time, volume, speed, fullscreen). */
declare class UiVideoPlayer {
    src: _angular_core.InputSignal<string>;
    poster: _angular_core.InputSignal<string | undefined>;
    protected readonly video: _angular_core.Signal<ElementRef<HTMLVideoElement>>;
    protected readonly wrap: _angular_core.Signal<ElementRef<HTMLElement>>;
    protected readonly playing: _angular_core.WritableSignal<boolean>;
    protected readonly time: _angular_core.WritableSignal<number>;
    protected readonly duration: _angular_core.WritableSignal<number>;
    protected readonly volume: _angular_core.WritableSignal<number>;
    protected readonly rates: number[];
    protected readonly fmt: typeof fmt$1;
    protected toggle(): void;
    protected seek(e: Event): void;
    protected setVol(e: Event): void;
    protected setRate(e: Event): void;
    protected fullscreen(): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiVideoPlayer, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiVideoPlayer, "ui-video-player", never, { "src": { "alias": "src"; "required": true; "isSignal": true; }; "poster": { "alias": "poster"; "required": false; "isSignal": true; }; }, {}, never, never, true, never>;
}

declare function fmt(s: number): string;
/** `ui-audio-player` — themed audio controls (play, scrub, time, volume). */
declare class UiAudioPlayer {
    src: _angular_core.InputSignal<string>;
    title: _angular_core.InputSignal<string | undefined>;
    protected readonly audio: _angular_core.Signal<ElementRef<HTMLAudioElement>>;
    protected readonly playing: _angular_core.WritableSignal<boolean>;
    protected readonly time: _angular_core.WritableSignal<number>;
    protected readonly duration: _angular_core.WritableSignal<number>;
    protected readonly fmt: typeof fmt;
    protected toggle(): void;
    protected seek(e: Event): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiAudioPlayer, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiAudioPlayer, "ui-audio-player", never, { "src": { "alias": "src"; "required": true; "isSignal": true; }; "title": { "alias": "title"; "required": false; "isSignal": true; }; }, {}, never, never, true, never>;
}

/** `ui-text-viewer` — displays plain text from a `content` string or a fetched `src` URL. */
declare class UiTextViewer {
    src: _angular_core.InputSignal<string | undefined>;
    content: _angular_core.InputSignal<string | undefined>;
    protected readonly fetched: _angular_core.WritableSignal<string | null>;
    protected readonly loading: _angular_core.WritableSignal<boolean>;
    protected readonly error: _angular_core.WritableSignal<string | null>;
    protected readonly text: _angular_core.Signal<string>;
    constructor();
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiTextViewer, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiTextViewer, "ui-text-viewer", never, { "src": { "alias": "src"; "required": false; "isSignal": true; }; "content": { "alias": "content"; "required": false; "isSignal": true; }; }, {}, never, never, true, never>;
}

/** `ui-code-viewer` — monospace source view with line numbers (content or fetched src). */
declare class UiCodeViewer {
    src: _angular_core.InputSignal<string | undefined>;
    content: _angular_core.InputSignal<string | undefined>;
    language: _angular_core.InputSignal<string>;
    protected readonly fetched: _angular_core.WritableSignal<string | null>;
    protected readonly loading: _angular_core.WritableSignal<boolean>;
    protected readonly error: _angular_core.WritableSignal<string | null>;
    protected readonly text: _angular_core.Signal<string>;
    protected readonly lineNumbers: _angular_core.Signal<number[]>;
    constructor();
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiCodeViewer, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiCodeViewer, "ui-code-viewer", never, { "src": { "alias": "src"; "required": false; "isSignal": true; }; "content": { "alias": "content"; "required": false; "isSignal": true; }; "language": { "alias": "language"; "required": false; "isSignal": true; }; }, {}, never, never, true, never>;
}

interface UiFileNode {
    name: string;
    type: 'file' | 'dir';
    /** File URL (for files), used when opening into a viewer. */
    url?: string;
    /** MIME/extension hint. */
    kind?: string;
    children?: UiFileNode[];
}
/** `ui-file-explorer` — directory browser: breadcrumb path + list view, typed icons, open-into-viewer. */
declare class UiFileExplorer {
    root: _angular_core.InputSignal<UiFileNode>;
    open: _angular_core.OutputEmitterRef<UiFileNode>;
    private readonly path;
    protected readonly trail: _angular_core.Signal<UiFileNode[]>;
    protected readonly entries: _angular_core.Signal<UiFileNode[]>;
    protected enter(node: UiFileNode): void;
    protected goTo(index: number): void;
    protected iconFor(node: UiFileNode): string;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiFileExplorer, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiFileExplorer, "ui-file-explorer", never, { "root": { "alias": "root"; "required": true; "isSignal": true; }; }, { "open": "open"; }, never, never, true, never>;
}

type FileType = 'image' | 'video' | 'audio' | 'pdf' | 'text' | 'code' | 'unknown';
/**
 * `ui-file-viewer` — detects a file's type from `kind`/extension and delegates
 * to the matching sub-renderer. The PDF branch lazy-loads `pdfjs-dist` via
 * `@defer` so it never ships unless a PDF is opened. Unsupported types fall
 * back to metadata + a download link. Embed inline or inside `ui-window`.
 */
declare class UiFileViewer {
    src: _angular_core.InputSignal<string>;
    name: _angular_core.InputSignal<string | undefined>;
    /** Explicit type override or MIME/extension; otherwise inferred from the URL. */
    kind: _angular_core.InputSignal<string | undefined>;
    protected readonly ext: _angular_core.Signal<string>;
    protected readonly type: _angular_core.Signal<FileType>;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiFileViewer, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiFileViewer, "ui-file-viewer", never, { "src": { "alias": "src"; "required": true; "isSignal": true; }; "name": { "alias": "name"; "required": false; "isSignal": true; }; "kind": { "alias": "kind"; "required": false; "isSignal": true; }; }, {}, never, never, true, never>;
}

export { UiAudioPlayer, UiCodeViewer, UiFileExplorer, UiFileViewer, UiImageViewer, UiTextViewer, UiVideoPlayer };
export type { UiFileNode };
