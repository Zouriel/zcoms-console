import * as i0 from '@angular/core';
import { input, Component } from '@angular/core';

/** `ui-empty-state` — placeholder for empty content. Slots: `[empty-icon]`, `[empty-actions]`. */
class UiEmptyState {
    heading = input('Nothing here yet', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "heading" }] : /* istanbul ignore next */ []));
    description = input(/* @ts-ignore */
    ...(ngDevMode ? [undefined, { debugName: "description" }] : /* istanbul ignore next */ []));
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiEmptyState, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "22.0.4", type: UiEmptyState, isStandalone: true, selector: "ui-empty-state", inputs: { heading: { classPropertyName: "heading", publicName: "heading", isSignal: true, isRequired: false, transformFunction: null }, description: { classPropertyName: "description", publicName: "description", isSignal: true, isRequired: false, transformFunction: null } }, ngImport: i0, template: `
    <div class="ui-empty">
      <div class="icon"><ng-content select="[empty-icon]" /></div>
      <div class="title">{{ heading() }}</div>
      @if (description()) { <div class="desc">{{ description() }}</div> }
      <div class="actions"><ng-content select="[empty-actions]" /></div>
    </div>
  `, isInline: true, styles: [":host{display:block}.ui-empty{display:flex;flex-direction:column;align-items:center;text-align:center;gap:var(--ui-space-2);padding:var(--ui-space-6) var(--ui-space-4);font-family:var(--ui-font-default)}.icon{font-size:32px;line-height:1;color:var(--ui-color-text-muted)}.icon:empty{display:none}.title{font-size:var(--ui-font-size-md);font-weight:600;color:var(--ui-color-text)}.desc{font-size:var(--ui-font-size-sm);color:var(--ui-color-text-muted);max-width:360px}.actions{display:flex;gap:var(--ui-space-2);margin-top:var(--ui-space-2)}.actions:empty{display:none}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiEmptyState, decorators: [{
            type: Component,
            args: [{ selector: 'ui-empty-state', template: `
    <div class="ui-empty">
      <div class="icon"><ng-content select="[empty-icon]" /></div>
      <div class="title">{{ heading() }}</div>
      @if (description()) { <div class="desc">{{ description() }}</div> }
      <div class="actions"><ng-content select="[empty-actions]" /></div>
    </div>
  `, styles: [":host{display:block}.ui-empty{display:flex;flex-direction:column;align-items:center;text-align:center;gap:var(--ui-space-2);padding:var(--ui-space-6) var(--ui-space-4);font-family:var(--ui-font-default)}.icon{font-size:32px;line-height:1;color:var(--ui-color-text-muted)}.icon:empty{display:none}.title{font-size:var(--ui-font-size-md);font-weight:600;color:var(--ui-color-text)}.desc{font-size:var(--ui-font-size-sm);color:var(--ui-color-text-muted);max-width:360px}.actions{display:flex;gap:var(--ui-space-2);margin-top:var(--ui-space-2)}.actions:empty{display:none}\n"] }]
        }], propDecorators: { heading: [{ type: i0.Input, args: [{ isSignal: true, alias: "heading", required: false }] }], description: [{ type: i0.Input, args: [{ isSignal: true, alias: "description", required: false }] }] } });

/** `ui-result` — full-page outcome state (success / error / 404 / 500). */
class UiResult {
    status = input('info', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "status" }] : /* istanbul ignore next */ []));
    title = input('', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "title" }] : /* istanbul ignore next */ []));
    subtitle = input(/* @ts-ignore */
    ...(ngDevMode ? [undefined, { debugName: "subtitle" }] : /* istanbul ignore next */ []));
    glyph = {
        success: '✓', error: '✕', info: 'ℹ', warning: '⚠', '404': '?', '500': '!',
    };
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiResult, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "22.0.4", type: UiResult, isStandalone: true, selector: "ui-result", inputs: { status: { classPropertyName: "status", publicName: "status", isSignal: true, isRequired: false, transformFunction: null }, title: { classPropertyName: "title", publicName: "title", isSignal: true, isRequired: false, transformFunction: null }, subtitle: { classPropertyName: "subtitle", publicName: "subtitle", isSignal: true, isRequired: false, transformFunction: null } }, ngImport: i0, template: `
    <div class="ui-result">
      <div class="glyph" [attr.data-status]="status()" aria-hidden="true">{{ glyph[status()] }}</div>
      <div class="title">{{ title() }}</div>
      @if (subtitle()) { <div class="subtitle">{{ subtitle() }}</div> }
      <div class="actions"><ng-content /></div>
    </div>
  `, isInline: true, styles: [":host{display:block}.ui-result{display:flex;flex-direction:column;align-items:center;text-align:center;gap:var(--ui-space-2);padding:var(--ui-space-6);font-family:var(--ui-font-default)}.glyph{display:flex;align-items:center;justify-content:center;width:56px;height:56px;border-radius:50%;font-size:28px;background:var(--ui-color-surface-raised)}.glyph[data-status=success]{color:var(--ui-color-success)}.glyph[data-status=error],.glyph[data-status=\"500\"]{color:var(--ui-color-danger)}.glyph[data-status=warning]{color:var(--ui-color-warning)}.glyph[data-status=info],.glyph[data-status=\"404\"]{color:var(--ui-color-primary)}.title{font-size:var(--ui-font-size-lg);font-weight:600;color:var(--ui-color-text);margin-top:var(--ui-space-2)}.subtitle{font-size:var(--ui-font-size-sm);color:var(--ui-color-text-muted);max-width:420px}.actions{display:flex;gap:var(--ui-space-2);margin-top:var(--ui-space-3)}.actions:empty{display:none}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiResult, decorators: [{
            type: Component,
            args: [{ selector: 'ui-result', template: `
    <div class="ui-result">
      <div class="glyph" [attr.data-status]="status()" aria-hidden="true">{{ glyph[status()] }}</div>
      <div class="title">{{ title() }}</div>
      @if (subtitle()) { <div class="subtitle">{{ subtitle() }}</div> }
      <div class="actions"><ng-content /></div>
    </div>
  `, styles: [":host{display:block}.ui-result{display:flex;flex-direction:column;align-items:center;text-align:center;gap:var(--ui-space-2);padding:var(--ui-space-6);font-family:var(--ui-font-default)}.glyph{display:flex;align-items:center;justify-content:center;width:56px;height:56px;border-radius:50%;font-size:28px;background:var(--ui-color-surface-raised)}.glyph[data-status=success]{color:var(--ui-color-success)}.glyph[data-status=error],.glyph[data-status=\"500\"]{color:var(--ui-color-danger)}.glyph[data-status=warning]{color:var(--ui-color-warning)}.glyph[data-status=info],.glyph[data-status=\"404\"]{color:var(--ui-color-primary)}.title{font-size:var(--ui-font-size-lg);font-weight:600;color:var(--ui-color-text);margin-top:var(--ui-space-2)}.subtitle{font-size:var(--ui-font-size-sm);color:var(--ui-color-text-muted);max-width:420px}.actions{display:flex;gap:var(--ui-space-2);margin-top:var(--ui-space-3)}.actions:empty{display:none}\n"] }]
        }], propDecorators: { status: [{ type: i0.Input, args: [{ isSignal: true, alias: "status", required: false }] }], title: [{ type: i0.Input, args: [{ isSignal: true, alias: "title", required: false }] }], subtitle: [{ type: i0.Input, args: [{ isSignal: true, alias: "subtitle", required: false }] }] } });

/**
 * `ui-loading-overlay` — covers its positioned parent with a dimmed, blurred
 * veil + spinner while `loading` is true. Place inside a `position: relative`
 * container.
 */
class UiLoadingOverlay {
    loading = input(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "loading" }] : /* istanbul ignore next */ []));
    label = input('Loading…', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "label" }] : /* istanbul ignore next */ []));
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiLoadingOverlay, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "22.0.4", type: UiLoadingOverlay, isStandalone: true, selector: "ui-loading-overlay", inputs: { loading: { classPropertyName: "loading", publicName: "loading", isSignal: true, isRequired: false, transformFunction: null }, label: { classPropertyName: "label", publicName: "label", isSignal: true, isRequired: false, transformFunction: null } }, ngImport: i0, template: `
    @if (loading()) {
      <div class="veil" role="status" [attr.aria-label]="label()" animate.enter="ui-fade-enter" animate.leave="ui-fade-leave">
        <span class="spin" aria-hidden="true"></span>
        @if (label()) { <span class="lbl">{{ label() }}</span> }
      </div>
    }
  `, isInline: true, styles: [":host{position:absolute;inset:0;display:contents}.veil{position:absolute;inset:0;z-index:2;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:var(--ui-space-2);background:color-mix(in srgb,var(--ui-color-bg) 55%,transparent);-webkit-backdrop-filter:blur(2px);backdrop-filter:blur(2px);font-family:var(--ui-font-default)}.spin{width:26px;height:26px;border-radius:50%;border:3px solid var(--ui-color-border);border-top-color:var(--ui-color-primary);animation:ui-lo-spin var(--ui-motion-slow) linear infinite}.lbl{font-size:var(--ui-font-size-sm);color:var(--ui-color-text-muted)}@keyframes ui-lo-spin{to{transform:rotate(360deg)}}@media(prefers-reduced-motion:reduce){.spin{animation-duration:1.2s}}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiLoadingOverlay, decorators: [{
            type: Component,
            args: [{ selector: 'ui-loading-overlay', template: `
    @if (loading()) {
      <div class="veil" role="status" [attr.aria-label]="label()" animate.enter="ui-fade-enter" animate.leave="ui-fade-leave">
        <span class="spin" aria-hidden="true"></span>
        @if (label()) { <span class="lbl">{{ label() }}</span> }
      </div>
    }
  `, styles: [":host{position:absolute;inset:0;display:contents}.veil{position:absolute;inset:0;z-index:2;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:var(--ui-space-2);background:color-mix(in srgb,var(--ui-color-bg) 55%,transparent);-webkit-backdrop-filter:blur(2px);backdrop-filter:blur(2px);font-family:var(--ui-font-default)}.spin{width:26px;height:26px;border-radius:50%;border:3px solid var(--ui-color-border);border-top-color:var(--ui-color-primary);animation:ui-lo-spin var(--ui-motion-slow) linear infinite}.lbl{font-size:var(--ui-font-size-sm);color:var(--ui-color-text-muted)}@keyframes ui-lo-spin{to{transform:rotate(360deg)}}@media(prefers-reduced-motion:reduce){.spin{animation-duration:1.2s}}\n"] }]
        }], propDecorators: { loading: [{ type: i0.Input, args: [{ isSignal: true, alias: "loading", required: false }] }], label: [{ type: i0.Input, args: [{ isSignal: true, alias: "label", required: false }] }] } });

/**
 * Generated bundle index. Do not edit.
 */

export { UiEmptyState, UiLoadingOverlay, UiResult };
//# sourceMappingURL=ui-feedback.mjs.map
