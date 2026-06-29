import { DecimalPipe } from '@angular/common';
import * as i0 from '@angular/core';
import { input, signal, computed, Component, viewChild, effect, output } from '@angular/core';

/** `ui-image-viewer` — zoom (buttons/wheel), pan (drag), and fit/reset. */
class UiImageViewer {
    src = input.required(/* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "src" }] : /* istanbul ignore next */ []));
    alt = input('', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "alt" }] : /* istanbul ignore next */ []));
    zoom = signal(1, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "zoom" }] : /* istanbul ignore next */ []));
    offset = signal({ x: 0, y: 0 }, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "offset" }] : /* istanbul ignore next */ []));
    panning = false;
    last = { x: 0, y: 0 };
    transform = computed(() => {
        const o = this.offset();
        return `translate(${o.x}px, ${o.y}px) scale(${this.zoom()})`;
    }, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "transform" }] : /* istanbul ignore next */ []));
    zoomBy(d) {
        this.zoom.update((z) => Math.min(6, Math.max(0.25, +(z + d).toFixed(2))));
    }
    onWheel(e) {
        e.preventDefault();
        this.zoomBy(e.deltaY < 0 ? 0.15 : -0.15);
    }
    reset() {
        this.zoom.set(1);
        this.offset.set({ x: 0, y: 0 });
    }
    startPan(e) {
        this.panning = true;
        this.last = { x: e.clientX, y: e.clientY };
    }
    pan(e) {
        if (!this.panning)
            return;
        const dx = e.clientX - this.last.x;
        const dy = e.clientY - this.last.y;
        this.last = { x: e.clientX, y: e.clientY };
        this.offset.update((o) => ({ x: o.x + dx, y: o.y + dy }));
    }
    endPan() { this.panning = false; }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiImageViewer, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.1.0", version: "22.0.4", type: UiImageViewer, isStandalone: true, selector: "ui-image-viewer", inputs: { src: { classPropertyName: "src", publicName: "src", isSignal: true, isRequired: true, transformFunction: null }, alt: { classPropertyName: "alt", publicName: "alt", isSignal: true, isRequired: false, transformFunction: null } }, ngImport: i0, template: `
    <div class="iv">
      <div class="stage" (wheel)="onWheel($event)" (pointerdown)="startPan($event)"
           (pointermove)="pan($event)" (pointerup)="endPan()" (pointerleave)="endPan()">
        <img [src]="src()" [alt]="alt()" [style.transform]="transform()" draggable="false" />
      </div>
      <div class="bar">
        <button type="button" (click)="zoomBy(-0.25)" aria-label="Zoom out">−</button>
        <span class="pct">{{ (zoom() * 100) | number:'1.0-0' }}%</span>
        <button type="button" (click)="zoomBy(0.25)" aria-label="Zoom in">+</button>
        <button type="button" (click)="reset()" aria-label="Reset view">Fit</button>
      </div>
    </div>
  `, isInline: true, styles: [":host{display:block;height:100%}.iv{display:flex;flex-direction:column;height:100%;min-height:200px}.stage{flex:1;overflow:hidden;display:flex;align-items:center;justify-content:center;background:var(--ui-color-bg);cursor:grab;touch-action:none}.stage:active{cursor:grabbing}img{max-width:100%;max-height:100%;-webkit-user-select:none;user-select:none;transition:transform 60ms linear}.bar{display:flex;align-items:center;gap:var(--ui-space-2);justify-content:center;padding:var(--ui-space-2);border-top:1px solid var(--ui-color-border);background:var(--ui-color-surface)}.bar button{width:28px;height:26px;border:1px solid var(--ui-color-border);background:var(--ui-color-surface);color:var(--ui-color-text);border-radius:var(--ui-radius);cursor:pointer;font-family:var(--ui-font-default)}.bar button:hover{background:var(--ui-color-surface-raised)}.pct{font-family:var(--ui-font-mono);font-size:var(--ui-font-size-sm);color:var(--ui-color-text-muted);min-width:42px;text-align:center}\n"], dependencies: [{ kind: "pipe", type: DecimalPipe, name: "number" }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiImageViewer, decorators: [{
            type: Component,
            args: [{ selector: 'ui-image-viewer', imports: [DecimalPipe], template: `
    <div class="iv">
      <div class="stage" (wheel)="onWheel($event)" (pointerdown)="startPan($event)"
           (pointermove)="pan($event)" (pointerup)="endPan()" (pointerleave)="endPan()">
        <img [src]="src()" [alt]="alt()" [style.transform]="transform()" draggable="false" />
      </div>
      <div class="bar">
        <button type="button" (click)="zoomBy(-0.25)" aria-label="Zoom out">−</button>
        <span class="pct">{{ (zoom() * 100) | number:'1.0-0' }}%</span>
        <button type="button" (click)="zoomBy(0.25)" aria-label="Zoom in">+</button>
        <button type="button" (click)="reset()" aria-label="Reset view">Fit</button>
      </div>
    </div>
  `, styles: [":host{display:block;height:100%}.iv{display:flex;flex-direction:column;height:100%;min-height:200px}.stage{flex:1;overflow:hidden;display:flex;align-items:center;justify-content:center;background:var(--ui-color-bg);cursor:grab;touch-action:none}.stage:active{cursor:grabbing}img{max-width:100%;max-height:100%;-webkit-user-select:none;user-select:none;transition:transform 60ms linear}.bar{display:flex;align-items:center;gap:var(--ui-space-2);justify-content:center;padding:var(--ui-space-2);border-top:1px solid var(--ui-color-border);background:var(--ui-color-surface)}.bar button{width:28px;height:26px;border:1px solid var(--ui-color-border);background:var(--ui-color-surface);color:var(--ui-color-text);border-radius:var(--ui-radius);cursor:pointer;font-family:var(--ui-font-default)}.bar button:hover{background:var(--ui-color-surface-raised)}.pct{font-family:var(--ui-font-mono);font-size:var(--ui-font-size-sm);color:var(--ui-color-text-muted);min-width:42px;text-align:center}\n"] }]
        }], propDecorators: { src: [{ type: i0.Input, args: [{ isSignal: true, alias: "src", required: true }] }], alt: [{ type: i0.Input, args: [{ isSignal: true, alias: "alt", required: false }] }] } });

function fmt$1(s) {
    if (!isFinite(s))
        return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${String(sec).padStart(2, '0')}`;
}
/** `ui-video-player` — native `<video>` with themed controls (play, scrub, time, volume, speed, fullscreen). */
class UiVideoPlayer {
    src = input.required(/* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "src" }] : /* istanbul ignore next */ []));
    poster = input(/* @ts-ignore */
    ...(ngDevMode ? [undefined, { debugName: "poster" }] : /* istanbul ignore next */ []));
    video = viewChild.required('video');
    wrap = viewChild.required('wrap');
    playing = signal(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "playing" }] : /* istanbul ignore next */ []));
    time = signal(0, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "time" }] : /* istanbul ignore next */ []));
    duration = signal(0, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "duration" }] : /* istanbul ignore next */ []));
    volume = signal(1, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "volume" }] : /* istanbul ignore next */ []));
    rates = [0.5, 1, 1.5, 2];
    fmt = fmt$1;
    toggle() {
        const v = this.video().nativeElement;
        v.paused ? v.play() : v.pause();
    }
    seek(e) { this.video().nativeElement.currentTime = Number(e.target.value); }
    setVol(e) { const v = Number(e.target.value); this.video().nativeElement.volume = v; this.volume.set(v); }
    setRate(e) { this.video().nativeElement.playbackRate = Number(e.target.value); }
    fullscreen() { this.wrap().nativeElement.requestFullscreen?.(); }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiVideoPlayer, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "22.0.4", type: UiVideoPlayer, isStandalone: true, selector: "ui-video-player", inputs: { src: { classPropertyName: "src", publicName: "src", isSignal: true, isRequired: true, transformFunction: null }, poster: { classPropertyName: "poster", publicName: "poster", isSignal: true, isRequired: false, transformFunction: null } }, viewQueries: [{ propertyName: "video", first: true, predicate: ["video"], descendants: true, isSignal: true }, { propertyName: "wrap", first: true, predicate: ["wrap"], descendants: true, isSignal: true }], ngImport: i0, template: `
    <div class="vp" #wrap>
      <video #video [src]="src()" [poster]="poster()" (click)="toggle()"
             (timeupdate)="time.set(video.currentTime)"
             (loadedmetadata)="duration.set(video.duration)"
             (play)="playing.set(true)" (pause)="playing.set(false)"></video>
      <div class="controls">
        <button type="button" class="ic" (click)="toggle()" [attr.aria-label]="playing() ? 'Pause' : 'Play'">{{ playing() ? '❚❚' : '▶' }}</button>
        <span class="t">{{ fmt(time()) }}</span>
        <input class="seek" type="range" min="0" [max]="duration() || 0" step="0.1" [value]="time()"
               aria-label="Seek" (input)="seek($event)" />
        <span class="t">{{ fmt(duration()) }}</span>
        <input class="vol" type="range" min="0" max="1" step="0.05" [value]="volume()" aria-label="Volume" (input)="setVol($event)" />
        <select class="rate" aria-label="Playback speed" (change)="setRate($event)">
          @for (r of rates; track r) { <option [value]="r" [selected]="r === 1">{{ r }}×</option> }
        </select>
        <button type="button" class="ic" (click)="fullscreen()" aria-label="Fullscreen">⛶</button>
      </div>
    </div>
  `, isInline: true, styles: [":host{display:block}.vp{position:relative;background:#000;border-radius:var(--ui-radius);overflow:hidden}video{display:block;width:100%;max-height:60vh}.controls{display:flex;align-items:center;gap:var(--ui-space-2);padding:var(--ui-space-2) var(--ui-space-3);background:var(--ui-color-surface);border-top:1px solid var(--ui-color-border)}.ic{width:30px;height:26px;border:none;background:transparent;color:var(--ui-color-text);cursor:pointer;border-radius:6px}.ic:hover{background:var(--ui-color-surface-raised)}.t{font-family:var(--ui-font-mono);font-size:12px;color:var(--ui-color-text-muted);min-width:38px;text-align:center}.seek{flex:1;accent-color:var(--ui-color-primary)}.vol{width:70px;accent-color:var(--ui-color-primary)}.rate{height:24px;background:var(--ui-color-surface);color:var(--ui-color-text);border:1px solid var(--ui-color-border);border-radius:6px;font-size:12px}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiVideoPlayer, decorators: [{
            type: Component,
            args: [{ selector: 'ui-video-player', template: `
    <div class="vp" #wrap>
      <video #video [src]="src()" [poster]="poster()" (click)="toggle()"
             (timeupdate)="time.set(video.currentTime)"
             (loadedmetadata)="duration.set(video.duration)"
             (play)="playing.set(true)" (pause)="playing.set(false)"></video>
      <div class="controls">
        <button type="button" class="ic" (click)="toggle()" [attr.aria-label]="playing() ? 'Pause' : 'Play'">{{ playing() ? '❚❚' : '▶' }}</button>
        <span class="t">{{ fmt(time()) }}</span>
        <input class="seek" type="range" min="0" [max]="duration() || 0" step="0.1" [value]="time()"
               aria-label="Seek" (input)="seek($event)" />
        <span class="t">{{ fmt(duration()) }}</span>
        <input class="vol" type="range" min="0" max="1" step="0.05" [value]="volume()" aria-label="Volume" (input)="setVol($event)" />
        <select class="rate" aria-label="Playback speed" (change)="setRate($event)">
          @for (r of rates; track r) { <option [value]="r" [selected]="r === 1">{{ r }}×</option> }
        </select>
        <button type="button" class="ic" (click)="fullscreen()" aria-label="Fullscreen">⛶</button>
      </div>
    </div>
  `, styles: [":host{display:block}.vp{position:relative;background:#000;border-radius:var(--ui-radius);overflow:hidden}video{display:block;width:100%;max-height:60vh}.controls{display:flex;align-items:center;gap:var(--ui-space-2);padding:var(--ui-space-2) var(--ui-space-3);background:var(--ui-color-surface);border-top:1px solid var(--ui-color-border)}.ic{width:30px;height:26px;border:none;background:transparent;color:var(--ui-color-text);cursor:pointer;border-radius:6px}.ic:hover{background:var(--ui-color-surface-raised)}.t{font-family:var(--ui-font-mono);font-size:12px;color:var(--ui-color-text-muted);min-width:38px;text-align:center}.seek{flex:1;accent-color:var(--ui-color-primary)}.vol{width:70px;accent-color:var(--ui-color-primary)}.rate{height:24px;background:var(--ui-color-surface);color:var(--ui-color-text);border:1px solid var(--ui-color-border);border-radius:6px;font-size:12px}\n"] }]
        }], propDecorators: { src: [{ type: i0.Input, args: [{ isSignal: true, alias: "src", required: true }] }], poster: [{ type: i0.Input, args: [{ isSignal: true, alias: "poster", required: false }] }], video: [{ type: i0.ViewChild, args: ['video', { isSignal: true }] }], wrap: [{ type: i0.ViewChild, args: ['wrap', { isSignal: true }] }] } });

function fmt(s) {
    if (!isFinite(s))
        return '0:00';
    return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
}
/** `ui-audio-player` — themed audio controls (play, scrub, time, volume). */
class UiAudioPlayer {
    src = input.required(/* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "src" }] : /* istanbul ignore next */ []));
    title = input(/* @ts-ignore */
    ...(ngDevMode ? [undefined, { debugName: "title" }] : /* istanbul ignore next */ []));
    audio = viewChild.required('audio');
    playing = signal(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "playing" }] : /* istanbul ignore next */ []));
    time = signal(0, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "time" }] : /* istanbul ignore next */ []));
    duration = signal(0, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "duration" }] : /* istanbul ignore next */ []));
    fmt = fmt;
    toggle() { const a = this.audio().nativeElement; a.paused ? a.play() : a.pause(); }
    seek(e) { this.audio().nativeElement.currentTime = Number(e.target.value); }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiAudioPlayer, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "22.0.4", type: UiAudioPlayer, isStandalone: true, selector: "ui-audio-player", inputs: { src: { classPropertyName: "src", publicName: "src", isSignal: true, isRequired: true, transformFunction: null }, title: { classPropertyName: "title", publicName: "title", isSignal: true, isRequired: false, transformFunction: null } }, viewQueries: [{ propertyName: "audio", first: true, predicate: ["audio"], descendants: true, isSignal: true }], ngImport: i0, template: `
    <div class="ap">
      <audio #audio [src]="src()" (timeupdate)="time.set(audio.currentTime)"
             (loadedmetadata)="duration.set(audio.duration)"
             (play)="playing.set(true)" (pause)="playing.set(false)" (ended)="playing.set(false)"></audio>
      <button type="button" class="play" (click)="toggle()" [attr.aria-label]="playing() ? 'Pause' : 'Play'">{{ playing() ? '❚❚' : '▶' }}</button>
      @if (title()) { <span class="title">{{ title() }}</span> }
      <span class="t">{{ fmt(time()) }}</span>
      <input class="seek" type="range" min="0" [max]="duration() || 0" step="0.1" [value]="time()" aria-label="Seek" (input)="seek($event)" />
      <span class="t">{{ fmt(duration()) }}</span>
    </div>
  `, isInline: true, styles: [":host{display:block}.ap{display:flex;align-items:center;gap:var(--ui-space-2);padding:var(--ui-space-2) var(--ui-space-3);background:var(--ui-color-surface);border:1px solid var(--ui-color-border);border-radius:var(--ui-radius);font-family:var(--ui-font-default)}.play{width:32px;height:32px;border-radius:50%;border:none;background:var(--ui-color-primary);color:var(--ui-color-primary-contrast);cursor:pointer;font-size:12px;flex:none}.title{font-size:var(--ui-font-size-sm);color:var(--ui-color-text);white-space:nowrap;max-width:120px;overflow:hidden;text-overflow:ellipsis}.t{font-family:var(--ui-font-mono);font-size:12px;color:var(--ui-color-text-muted);min-width:38px;text-align:center}.seek{flex:1;accent-color:var(--ui-color-primary)}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiAudioPlayer, decorators: [{
            type: Component,
            args: [{ selector: 'ui-audio-player', template: `
    <div class="ap">
      <audio #audio [src]="src()" (timeupdate)="time.set(audio.currentTime)"
             (loadedmetadata)="duration.set(audio.duration)"
             (play)="playing.set(true)" (pause)="playing.set(false)" (ended)="playing.set(false)"></audio>
      <button type="button" class="play" (click)="toggle()" [attr.aria-label]="playing() ? 'Pause' : 'Play'">{{ playing() ? '❚❚' : '▶' }}</button>
      @if (title()) { <span class="title">{{ title() }}</span> }
      <span class="t">{{ fmt(time()) }}</span>
      <input class="seek" type="range" min="0" [max]="duration() || 0" step="0.1" [value]="time()" aria-label="Seek" (input)="seek($event)" />
      <span class="t">{{ fmt(duration()) }}</span>
    </div>
  `, styles: [":host{display:block}.ap{display:flex;align-items:center;gap:var(--ui-space-2);padding:var(--ui-space-2) var(--ui-space-3);background:var(--ui-color-surface);border:1px solid var(--ui-color-border);border-radius:var(--ui-radius);font-family:var(--ui-font-default)}.play{width:32px;height:32px;border-radius:50%;border:none;background:var(--ui-color-primary);color:var(--ui-color-primary-contrast);cursor:pointer;font-size:12px;flex:none}.title{font-size:var(--ui-font-size-sm);color:var(--ui-color-text);white-space:nowrap;max-width:120px;overflow:hidden;text-overflow:ellipsis}.t{font-family:var(--ui-font-mono);font-size:12px;color:var(--ui-color-text-muted);min-width:38px;text-align:center}.seek{flex:1;accent-color:var(--ui-color-primary)}\n"] }]
        }], propDecorators: { src: [{ type: i0.Input, args: [{ isSignal: true, alias: "src", required: true }] }], title: [{ type: i0.Input, args: [{ isSignal: true, alias: "title", required: false }] }], audio: [{ type: i0.ViewChild, args: ['audio', { isSignal: true }] }] } });

/** `ui-text-viewer` — displays plain text from a `content` string or a fetched `src` URL. */
class UiTextViewer {
    src = input(/* @ts-ignore */
    ...(ngDevMode ? [undefined, { debugName: "src" }] : /* istanbul ignore next */ []));
    content = input(/* @ts-ignore */
    ...(ngDevMode ? [undefined, { debugName: "content" }] : /* istanbul ignore next */ []));
    fetched = signal(null, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "fetched" }] : /* istanbul ignore next */ []));
    loading = signal(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "loading" }] : /* istanbul ignore next */ []));
    error = signal(null, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "error" }] : /* istanbul ignore next */ []));
    text = computed(() => this.content() ?? this.fetched() ?? '', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "text" }] : /* istanbul ignore next */ []));
    constructor() {
        effect(() => {
            const url = this.src();
            if (!url || this.content() !== undefined)
                return;
            this.loading.set(true);
            this.error.set(null);
            fetch(url)
                .then((r) => (r.ok ? r.text() : Promise.reject(new Error(`HTTP ${r.status}`))))
                .then((t) => this.fetched.set(t))
                .catch((e) => this.error.set(String(e)))
                .finally(() => this.loading.set(false));
        });
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiTextViewer, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "22.0.4", type: UiTextViewer, isStandalone: true, selector: "ui-text-viewer", inputs: { src: { classPropertyName: "src", publicName: "src", isSignal: true, isRequired: false, transformFunction: null }, content: { classPropertyName: "content", publicName: "content", isSignal: true, isRequired: false, transformFunction: null } }, ngImport: i0, template: `
    <div class="tv">
      @if (loading()) { <div class="msg">Loading…</div> }
      @else if (error()) { <div class="msg err">{{ error() }}</div> }
      @else { <pre class="text">{{ text() }}</pre> }
    </div>
  `, isInline: true, styles: [":host{display:block;height:100%}.tv{height:100%;overflow:auto;background:var(--ui-color-surface);border-radius:var(--ui-radius)}.text{margin:0;padding:var(--ui-space-3);font-family:var(--ui-font-mono);font-size:var(--ui-font-size-sm);color:var(--ui-color-text);white-space:pre-wrap;word-break:break-word;line-height:1.5}.msg{padding:var(--ui-space-4);color:var(--ui-color-text-muted);font-family:var(--ui-font-default)}.msg.err{color:var(--ui-color-danger)}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiTextViewer, decorators: [{
            type: Component,
            args: [{ selector: 'ui-text-viewer', template: `
    <div class="tv">
      @if (loading()) { <div class="msg">Loading…</div> }
      @else if (error()) { <div class="msg err">{{ error() }}</div> }
      @else { <pre class="text">{{ text() }}</pre> }
    </div>
  `, styles: [":host{display:block;height:100%}.tv{height:100%;overflow:auto;background:var(--ui-color-surface);border-radius:var(--ui-radius)}.text{margin:0;padding:var(--ui-space-3);font-family:var(--ui-font-mono);font-size:var(--ui-font-size-sm);color:var(--ui-color-text);white-space:pre-wrap;word-break:break-word;line-height:1.5}.msg{padding:var(--ui-space-4);color:var(--ui-color-text-muted);font-family:var(--ui-font-default)}.msg.err{color:var(--ui-color-danger)}\n"] }]
        }], ctorParameters: () => [], propDecorators: { src: [{ type: i0.Input, args: [{ isSignal: true, alias: "src", required: false }] }], content: [{ type: i0.Input, args: [{ isSignal: true, alias: "content", required: false }] }] } });

/** `ui-code-viewer` — monospace source view with line numbers (content or fetched src). */
class UiCodeViewer {
    src = input(/* @ts-ignore */
    ...(ngDevMode ? [undefined, { debugName: "src" }] : /* istanbul ignore next */ []));
    content = input(/* @ts-ignore */
    ...(ngDevMode ? [undefined, { debugName: "content" }] : /* istanbul ignore next */ []));
    language = input('text', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "language" }] : /* istanbul ignore next */ []));
    fetched = signal(null, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "fetched" }] : /* istanbul ignore next */ []));
    loading = signal(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "loading" }] : /* istanbul ignore next */ []));
    error = signal(null, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "error" }] : /* istanbul ignore next */ []));
    text = computed(() => this.content() ?? this.fetched() ?? '', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "text" }] : /* istanbul ignore next */ []));
    lineNumbers = computed(() => {
        const lines = this.text().split('\n').length;
        return Array.from({ length: Math.max(1, lines) }, (_, i) => i + 1);
    }, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "lineNumbers" }] : /* istanbul ignore next */ []));
    constructor() {
        effect(() => {
            const url = this.src();
            if (!url || this.content() !== undefined)
                return;
            this.loading.set(true);
            this.error.set(null);
            fetch(url)
                .then((r) => (r.ok ? r.text() : Promise.reject(new Error(`HTTP ${r.status}`))))
                .then((t) => this.fetched.set(t))
                .catch((e) => this.error.set(String(e)))
                .finally(() => this.loading.set(false));
        });
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiCodeViewer, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "22.0.4", type: UiCodeViewer, isStandalone: true, selector: "ui-code-viewer", inputs: { src: { classPropertyName: "src", publicName: "src", isSignal: true, isRequired: false, transformFunction: null }, content: { classPropertyName: "content", publicName: "content", isSignal: true, isRequired: false, transformFunction: null }, language: { classPropertyName: "language", publicName: "language", isSignal: true, isRequired: false, transformFunction: null } }, ngImport: i0, template: `
    <div class="cv">
      <div class="bar"><span class="lang">{{ language() }}</span></div>
      @if (loading()) { <div class="msg">Loading…</div> }
      @else if (error()) { <div class="msg err">{{ error() }}</div> }
      @else {
        <div class="body">
          <div class="gutter" aria-hidden="true">@for (n of lineNumbers(); track n) { <span>{{ n }}</span> }</div>
          <pre class="code"><code>{{ text() }}</code></pre>
        </div>
      }
    </div>
  `, isInline: true, styles: [":host{display:block;height:100%}.cv{display:flex;flex-direction:column;height:100%;background:var(--ui-color-surface);border-radius:var(--ui-radius);overflow:hidden}.bar{padding:var(--ui-space-1) var(--ui-space-3);background:var(--ui-color-surface-raised);border-bottom:1px solid var(--ui-color-border)}.lang{font-family:var(--ui-font-default);font-size:11px;text-transform:uppercase;letter-spacing:.04em;color:var(--ui-color-text-muted)}.body{display:flex;flex:1;overflow:auto}.gutter{display:flex;flex-direction:column;padding:var(--ui-space-3) var(--ui-space-2);text-align:right;color:var(--ui-color-text-muted);font-family:var(--ui-font-mono);font-size:var(--ui-font-size-sm);line-height:1.5;-webkit-user-select:none;user-select:none;border-right:1px solid var(--ui-color-border);background:var(--ui-color-surface)}.code{margin:0;padding:var(--ui-space-3);flex:1}code{font-family:var(--ui-font-mono);font-size:var(--ui-font-size-sm);color:var(--ui-color-text);white-space:pre;line-height:1.5}.msg{padding:var(--ui-space-4);color:var(--ui-color-text-muted);font-family:var(--ui-font-default)}.msg.err{color:var(--ui-color-danger)}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiCodeViewer, decorators: [{
            type: Component,
            args: [{ selector: 'ui-code-viewer', template: `
    <div class="cv">
      <div class="bar"><span class="lang">{{ language() }}</span></div>
      @if (loading()) { <div class="msg">Loading…</div> }
      @else if (error()) { <div class="msg err">{{ error() }}</div> }
      @else {
        <div class="body">
          <div class="gutter" aria-hidden="true">@for (n of lineNumbers(); track n) { <span>{{ n }}</span> }</div>
          <pre class="code"><code>{{ text() }}</code></pre>
        </div>
      }
    </div>
  `, styles: [":host{display:block;height:100%}.cv{display:flex;flex-direction:column;height:100%;background:var(--ui-color-surface);border-radius:var(--ui-radius);overflow:hidden}.bar{padding:var(--ui-space-1) var(--ui-space-3);background:var(--ui-color-surface-raised);border-bottom:1px solid var(--ui-color-border)}.lang{font-family:var(--ui-font-default);font-size:11px;text-transform:uppercase;letter-spacing:.04em;color:var(--ui-color-text-muted)}.body{display:flex;flex:1;overflow:auto}.gutter{display:flex;flex-direction:column;padding:var(--ui-space-3) var(--ui-space-2);text-align:right;color:var(--ui-color-text-muted);font-family:var(--ui-font-mono);font-size:var(--ui-font-size-sm);line-height:1.5;-webkit-user-select:none;user-select:none;border-right:1px solid var(--ui-color-border);background:var(--ui-color-surface)}.code{margin:0;padding:var(--ui-space-3);flex:1}code{font-family:var(--ui-font-mono);font-size:var(--ui-font-size-sm);color:var(--ui-color-text);white-space:pre;line-height:1.5}.msg{padding:var(--ui-space-4);color:var(--ui-color-text-muted);font-family:var(--ui-font-default)}.msg.err{color:var(--ui-color-danger)}\n"] }]
        }], ctorParameters: () => [], propDecorators: { src: [{ type: i0.Input, args: [{ isSignal: true, alias: "src", required: false }] }], content: [{ type: i0.Input, args: [{ isSignal: true, alias: "content", required: false }] }], language: [{ type: i0.Input, args: [{ isSignal: true, alias: "language", required: false }] }] } });

/** `ui-file-explorer` — directory browser: breadcrumb path + list view, typed icons, open-into-viewer. */
class UiFileExplorer {
    root = input.required(/* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "root" }] : /* istanbul ignore next */ []));
    open = output();
    path = signal([], /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "path" }] : /* istanbul ignore next */ []));
    trail = computed(() => this.path(), /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "trail" }] : /* istanbul ignore next */ []));
    entries = computed(() => {
        const dir = this.path().at(-1) ?? this.root();
        const kids = [...(dir.children ?? [])];
        return kids.sort((a, b) => (a.type === b.type ? a.name.localeCompare(b.name) : a.type === 'dir' ? -1 : 1));
    }, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "entries" }] : /* istanbul ignore next */ []));
    enter(node) { this.path.update((p) => [...p, node]); }
    goTo(index) {
        this.path.update((p) => (index < 0 ? [] : p.slice(0, index + 1)));
    }
    iconFor(node) {
        if (node.type === 'dir')
            return '📁';
        const k = (node.kind || node.name.split('.').pop() || '').toLowerCase();
        if (/(png|jpe?g|gif|webp|svg|image)/.test(k))
            return '🖼️';
        if (/(mp4|webm|mov|video)/.test(k))
            return '🎬';
        if (/(mp3|wav|ogg|audio)/.test(k))
            return '🎵';
        if (/pdf/.test(k))
            return '📕';
        if (/(ts|js|json|css|html|code)/.test(k))
            return '📜';
        return '📄';
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiFileExplorer, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "22.0.4", type: UiFileExplorer, isStandalone: true, selector: "ui-file-explorer", inputs: { root: { classPropertyName: "root", publicName: "root", isSignal: true, isRequired: true, transformFunction: null } }, outputs: { open: "open" }, ngImport: i0, template: `
    <div class="fx">
      <nav class="crumbs" aria-label="Path">
        <button type="button" class="crumb" (click)="goTo(-1)">{{ root().name || 'root' }}</button>
        @for (seg of trail(); track $index) {
          <span class="sep" aria-hidden="true">/</span>
          <button type="button" class="crumb" (click)="goTo($index)">{{ seg.name }}</button>
        }
      </nav>
      <ul class="list" role="list">
        @for (node of entries(); track node.name) {
          <li>
            <button type="button" class="row" [class.dir]="node.type === 'dir'"
                    (click)="node.type === 'dir' ? enter(node) : open.emit(node)">
              <span class="icon" aria-hidden="true">{{ iconFor(node) }}</span>
              <span class="name">{{ node.name }}</span>
              @if (node.type === 'dir') { <span class="chev" aria-hidden="true">›</span> }
            </button>
          </li>
        } @empty {
          <li class="empty">Empty folder</li>
        }
      </ul>
    </div>
  `, isInline: true, styles: [":host{display:block}.fx{border:1px solid var(--ui-color-border);border-radius:var(--ui-radius);overflow:hidden;font-family:var(--ui-font-default)}.crumbs{display:flex;flex-wrap:wrap;align-items:center;gap:2px;padding:var(--ui-space-2) var(--ui-space-3);background:var(--ui-color-surface-raised);border-bottom:1px solid var(--ui-color-border)}.crumb{background:none;border:none;color:var(--ui-color-text-muted);cursor:pointer;font:inherit;font-size:var(--ui-font-size-sm);padding:2px 4px;border-radius:4px}.crumb:hover{color:var(--ui-color-text);background:var(--ui-color-surface)}.sep{color:var(--ui-color-text-muted)}.list{margin:0;padding:var(--ui-space-1);list-style:none;max-height:280px;overflow:auto}.row{display:flex;align-items:center;gap:var(--ui-space-2);width:100%;padding:var(--ui-space-2) var(--ui-space-3);background:none;border:none;border-radius:6px;cursor:pointer;color:var(--ui-color-text);font:inherit;text-align:left}.row:hover{background:var(--ui-color-surface-raised)}.row:focus-visible{outline:none;box-shadow:var(--ui-focus-ring)}.icon{font-size:15px}.name{flex:1;font-size:var(--ui-font-size-md)}.chev{color:var(--ui-color-text-muted)}.empty{padding:var(--ui-space-4);text-align:center;color:var(--ui-color-text-muted);font-size:var(--ui-font-size-sm)}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiFileExplorer, decorators: [{
            type: Component,
            args: [{ selector: 'ui-file-explorer', template: `
    <div class="fx">
      <nav class="crumbs" aria-label="Path">
        <button type="button" class="crumb" (click)="goTo(-1)">{{ root().name || 'root' }}</button>
        @for (seg of trail(); track $index) {
          <span class="sep" aria-hidden="true">/</span>
          <button type="button" class="crumb" (click)="goTo($index)">{{ seg.name }}</button>
        }
      </nav>
      <ul class="list" role="list">
        @for (node of entries(); track node.name) {
          <li>
            <button type="button" class="row" [class.dir]="node.type === 'dir'"
                    (click)="node.type === 'dir' ? enter(node) : open.emit(node)">
              <span class="icon" aria-hidden="true">{{ iconFor(node) }}</span>
              <span class="name">{{ node.name }}</span>
              @if (node.type === 'dir') { <span class="chev" aria-hidden="true">›</span> }
            </button>
          </li>
        } @empty {
          <li class="empty">Empty folder</li>
        }
      </ul>
    </div>
  `, styles: [":host{display:block}.fx{border:1px solid var(--ui-color-border);border-radius:var(--ui-radius);overflow:hidden;font-family:var(--ui-font-default)}.crumbs{display:flex;flex-wrap:wrap;align-items:center;gap:2px;padding:var(--ui-space-2) var(--ui-space-3);background:var(--ui-color-surface-raised);border-bottom:1px solid var(--ui-color-border)}.crumb{background:none;border:none;color:var(--ui-color-text-muted);cursor:pointer;font:inherit;font-size:var(--ui-font-size-sm);padding:2px 4px;border-radius:4px}.crumb:hover{color:var(--ui-color-text);background:var(--ui-color-surface)}.sep{color:var(--ui-color-text-muted)}.list{margin:0;padding:var(--ui-space-1);list-style:none;max-height:280px;overflow:auto}.row{display:flex;align-items:center;gap:var(--ui-space-2);width:100%;padding:var(--ui-space-2) var(--ui-space-3);background:none;border:none;border-radius:6px;cursor:pointer;color:var(--ui-color-text);font:inherit;text-align:left}.row:hover{background:var(--ui-color-surface-raised)}.row:focus-visible{outline:none;box-shadow:var(--ui-focus-ring)}.icon{font-size:15px}.name{flex:1;font-size:var(--ui-font-size-md)}.chev{color:var(--ui-color-text-muted)}.empty{padding:var(--ui-space-4);text-align:center;color:var(--ui-color-text-muted);font-size:var(--ui-font-size-sm)}\n"] }]
        }], propDecorators: { root: [{ type: i0.Input, args: [{ isSignal: true, alias: "root", required: true }] }], open: [{ type: i0.Output, args: ["open"] }] } });

const EXT = {
    png: 'image', jpg: 'image', jpeg: 'image', gif: 'image', webp: 'image', svg: 'image', bmp: 'image', avif: 'image',
    mp4: 'video', webm: 'video', mov: 'video', ogv: 'video', m4v: 'video',
    mp3: 'audio', wav: 'audio', ogg: 'audio', m4a: 'audio', flac: 'audio', aac: 'audio',
    pdf: 'pdf',
    txt: 'text', md: 'text', log: 'text', csv: 'text', rtf: 'text',
    ts: 'code', tsx: 'code', js: 'code', jsx: 'code', json: 'code', css: 'code', scss: 'code', html: 'code', xml: 'code', yml: 'code', yaml: 'code', py: 'code', java: 'code', go: 'code', rs: 'code', sh: 'code',
};
/**
 * `ui-file-viewer` — detects a file's type from `kind`/extension and delegates
 * to the matching sub-renderer. The PDF branch lazy-loads `pdfjs-dist` via
 * `@defer` so it never ships unless a PDF is opened. Unsupported types fall
 * back to metadata + a download link. Embed inline or inside `ui-window`.
 */
class UiFileViewer {
    src = input.required(/* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "src" }] : /* istanbul ignore next */ []));
    name = input(/* @ts-ignore */
    ...(ngDevMode ? [undefined, { debugName: "name" }] : /* istanbul ignore next */ []));
    /** Explicit type override or MIME/extension; otherwise inferred from the URL. */
    kind = input(/* @ts-ignore */
    ...(ngDevMode ? [undefined, { debugName: "kind" }] : /* istanbul ignore next */ []));
    ext = computed(() => {
        const k = this.kind();
        if (k && !k.includes('/'))
            return k.toLowerCase();
        const fromName = (this.name() || this.src()).split('?')[0].split('.').pop() || '';
        return fromName.toLowerCase();
    }, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "ext" }] : /* istanbul ignore next */ []));
    type = computed(() => {
        const k = this.kind();
        if (k && ['image', 'video', 'audio', 'pdf', 'text', 'code'].includes(k))
            return k;
        if (k?.startsWith('image/'))
            return 'image';
        if (k?.startsWith('video/'))
            return 'video';
        if (k?.startsWith('audio/'))
            return 'audio';
        if (k === 'application/pdf')
            return 'pdf';
        return EXT[this.ext()] ?? 'unknown';
    }, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "type" }] : /* istanbul ignore next */ []));
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiFileViewer, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "22.0.4", type: UiFileViewer, isStandalone: true, selector: "ui-file-viewer", inputs: { src: { classPropertyName: "src", publicName: "src", isSignal: true, isRequired: true, transformFunction: null }, name: { classPropertyName: "name", publicName: "name", isSignal: true, isRequired: false, transformFunction: null }, kind: { classPropertyName: "kind", publicName: "kind", isSignal: true, isRequired: false, transformFunction: null } }, ngImport: i0, template: `
    <div class="fv">
      @switch (type()) {
        @case ('image') { <ui-image-viewer [src]="src()" [alt]="name() || ''" /> }
        @case ('video') { <ui-video-player [src]="src()" /> }
        @case ('audio') { <ui-audio-player [src]="src()" [title]="name()" /> }
        @case ('text')  { <ui-text-viewer [src]="src()" /> }
        @case ('code')  { <ui-code-viewer [src]="src()" [language]="ext()" /> }
        @case ('pdf') {
          @defer (on immediate) {
            <ui-pdf-viewer [src]="src()" />
          } @placeholder {
            <div class="fallback"><span class="big">📕</span><span>Loading PDF viewer…</span></div>
          }
        }
        @default {
          <div class="fallback">
            <span class="big">📄</span>
            <span class="nm">{{ name() || src() }}</span>
            <span class="muted">Preview not available for this file type.</span>
            <a class="dl" [href]="src()" [attr.download]="name() || true">Download</a>
          </div>
        }
      }
    </div>
  `, isInline: true, styles: [":host{display:block;height:100%}.fv{height:100%;min-height:200px}.fallback{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:var(--ui-space-2);height:100%;padding:var(--ui-space-6);text-align:center;font-family:var(--ui-font-default);color:var(--ui-color-text-muted)}.big{font-size:40px}.nm{color:var(--ui-color-text);word-break:break-all}.dl{color:var(--ui-color-primary);text-decoration:none;font-size:var(--ui-font-size-sm)}.dl:hover{text-decoration:underline}\n"], dependencies: [{ kind: "component", type: UiImageViewer, selector: "ui-image-viewer", inputs: ["src", "alt"] }, { kind: "component", type: UiVideoPlayer, selector: "ui-video-player", inputs: ["src", "poster"] }, { kind: "component", type: UiAudioPlayer, selector: "ui-audio-player", inputs: ["src", "title"] }, { kind: "component", type: UiTextViewer, selector: "ui-text-viewer", inputs: ["src", "content"] }, { kind: "component", type: UiCodeViewer, selector: "ui-code-viewer", inputs: ["src", "content", "language"] }], deferBlockDependencies: [() => [/* @ts-ignore */
                import('ui/pdf-viewer').then(m => m.UiPdfViewer)]] });
}
i0.ɵɵngDeclareClassMetadataAsync({ minVersion: "18.0.0", version: "22.0.4", ngImport: i0, type: UiFileViewer, resolveDeferredDeps: () => [/* @ts-ignore */
        import('ui/pdf-viewer').then(m => m.UiPdfViewer)], resolveMetadata: UiPdfViewer => ({ decorators: [{
                type: Component,
                args: [{ selector: 'ui-file-viewer', imports: [UiImageViewer, UiVideoPlayer, UiAudioPlayer, UiTextViewer, UiCodeViewer, UiPdfViewer], template: `
    <div class="fv">
      @switch (type()) {
        @case ('image') { <ui-image-viewer [src]="src()" [alt]="name() || ''" /> }
        @case ('video') { <ui-video-player [src]="src()" /> }
        @case ('audio') { <ui-audio-player [src]="src()" [title]="name()" /> }
        @case ('text')  { <ui-text-viewer [src]="src()" /> }
        @case ('code')  { <ui-code-viewer [src]="src()" [language]="ext()" /> }
        @case ('pdf') {
          @defer (on immediate) {
            <ui-pdf-viewer [src]="src()" />
          } @placeholder {
            <div class="fallback"><span class="big">📕</span><span>Loading PDF viewer…</span></div>
          }
        }
        @default {
          <div class="fallback">
            <span class="big">📄</span>
            <span class="nm">{{ name() || src() }}</span>
            <span class="muted">Preview not available for this file type.</span>
            <a class="dl" [href]="src()" [attr.download]="name() || true">Download</a>
          </div>
        }
      }
    </div>
  `, styles: [":host{display:block;height:100%}.fv{height:100%;min-height:200px}.fallback{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:var(--ui-space-2);height:100%;padding:var(--ui-space-6);text-align:center;font-family:var(--ui-font-default);color:var(--ui-color-text-muted)}.big{font-size:40px}.nm{color:var(--ui-color-text);word-break:break-all}.dl{color:var(--ui-color-primary);text-decoration:none;font-size:var(--ui-font-size-sm)}.dl:hover{text-decoration:underline}\n"] }]
            }], ctorParameters: null, propDecorators: { src: [{ type: i0.Input, args: [{ isSignal: true, alias: "src", required: true }] }], name: [{ type: i0.Input, args: [{ isSignal: true, alias: "name", required: false }] }], kind: [{ type: i0.Input, args: [{ isSignal: true, alias: "kind", required: false }] }] } }) });

/**
 * Generated bundle index. Do not edit.
 */

export { UiAudioPlayer, UiCodeViewer, UiFileExplorer, UiFileViewer, UiImageViewer, UiTextViewer, UiVideoPlayer };
//# sourceMappingURL=ui-file-viewer.mjs.map
