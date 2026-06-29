import * as i0 from '@angular/core';
import { input, Component } from '@angular/core';

/** `ui-link` — themed anchor. External links get safe rel + a visual marker. */
class UiLink {
    href = input(/* @ts-ignore */
    ...(ngDevMode ? [undefined, { debugName: "href" }] : /* istanbul ignore next */ []));
    external = input(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "external" }] : /* istanbul ignore next */ []));
    tone = input('primary', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "tone" }] : /* istanbul ignore next */ []));
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiLink, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "22.0.4", type: UiLink, isStandalone: true, selector: "ui-link", inputs: { href: { classPropertyName: "href", publicName: "href", isSignal: true, isRequired: false, transformFunction: null }, external: { classPropertyName: "external", publicName: "external", isSignal: true, isRequired: false, transformFunction: null }, tone: { classPropertyName: "tone", publicName: "tone", isSignal: true, isRequired: false, transformFunction: null } }, ngImport: i0, template: `
    <a
      class="ui-link"
      [attr.href]="href()"
      [attr.target]="external() ? '_blank' : null"
      [attr.rel]="external() ? 'noopener noreferrer' : null"
      [attr.data-tone]="tone()">
      <ng-content />
      @if (external()) { <span class="ext" aria-hidden="true">↗</span> }
    </a>
  `, isInline: true, styles: [":host{display:inline}.ui-link{color:var(--ui-color-primary);text-decoration:none;font-family:var(--ui-font-default);cursor:pointer;border-radius:3px;transition:color var(--ui-motion-fast) var(--ui-ease-standard)}.ui-link:hover{text-decoration:underline;color:var(--ui-color-primary-hover)}.ui-link:focus-visible{outline:none;box-shadow:var(--ui-focus-ring)}.ui-link[data-tone=muted]{color:var(--ui-color-text-muted)}.ui-link[data-tone=plain]{color:inherit}.ext{font-size:.85em}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiLink, decorators: [{
            type: Component,
            args: [{ selector: 'ui-link', template: `
    <a
      class="ui-link"
      [attr.href]="href()"
      [attr.target]="external() ? '_blank' : null"
      [attr.rel]="external() ? 'noopener noreferrer' : null"
      [attr.data-tone]="tone()">
      <ng-content />
      @if (external()) { <span class="ext" aria-hidden="true">↗</span> }
    </a>
  `, styles: [":host{display:inline}.ui-link{color:var(--ui-color-primary);text-decoration:none;font-family:var(--ui-font-default);cursor:pointer;border-radius:3px;transition:color var(--ui-motion-fast) var(--ui-ease-standard)}.ui-link:hover{text-decoration:underline;color:var(--ui-color-primary-hover)}.ui-link:focus-visible{outline:none;box-shadow:var(--ui-focus-ring)}.ui-link[data-tone=muted]{color:var(--ui-color-text-muted)}.ui-link[data-tone=plain]{color:inherit}.ext{font-size:.85em}\n"] }]
        }], propDecorators: { href: [{ type: i0.Input, args: [{ isSignal: true, alias: "href", required: false }] }], external: [{ type: i0.Input, args: [{ isSignal: true, alias: "external", required: false }] }], tone: [{ type: i0.Input, args: [{ isSignal: true, alias: "tone", required: false }] }] } });

/** `ui-kbd` — keyboard key hint. */
class UiKbd {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiKbd, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "22.0.4", type: UiKbd, isStandalone: true, selector: "ui-kbd", ngImport: i0, template: `<kbd class="ui-kbd"><ng-content /></kbd>`, isInline: true, styles: [":host{display:inline-flex}.ui-kbd{display:inline-flex;align-items:center;min-width:1.4em;height:1.5em;padding:0 .4em;box-sizing:border-box;font-family:var(--ui-font-mono);font-size:.82em;line-height:1;color:var(--ui-color-text);background:var(--ui-color-surface-raised);border:1px solid var(--ui-color-border);border-bottom-width:2px;border-radius:5px}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiKbd, decorators: [{
            type: Component,
            args: [{ selector: 'ui-kbd', template: `<kbd class="ui-kbd"><ng-content /></kbd>`, styles: [":host{display:inline-flex}.ui-kbd{display:inline-flex;align-items:center;min-width:1.4em;height:1.5em;padding:0 .4em;box-sizing:border-box;font-family:var(--ui-font-mono);font-size:.82em;line-height:1;color:var(--ui-color-text);background:var(--ui-color-surface-raised);border:1px solid var(--ui-color-border);border-bottom-width:2px;border-radius:5px}\n"] }]
        }] });

/** `ui-inline-code` — inline code token. */
class UiInlineCode {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiInlineCode, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "22.0.4", type: UiInlineCode, isStandalone: true, selector: "ui-inline-code", ngImport: i0, template: `<code class="ui-code"><ng-content /></code>`, isInline: true, styles: [":host{display:inline}.ui-code{font-family:var(--ui-font-mono);font-size:.88em;padding:.1em .35em;border-radius:5px;color:var(--ui-color-text);background:var(--ui-color-surface-raised);border:1px solid var(--ui-color-border)}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiInlineCode, decorators: [{
            type: Component,
            args: [{ selector: 'ui-inline-code', template: `<code class="ui-code"><ng-content /></code>`, styles: [":host{display:inline}.ui-code{font-family:var(--ui-font-mono);font-size:.88em;padding:.1em .35em;border-radius:5px;color:var(--ui-color-text);background:var(--ui-color-surface-raised);border:1px solid var(--ui-color-border)}\n"] }]
        }] });

/** `ui-blockquote` — quotation block with optional citation. */
class UiBlockquote {
    cite = input(/* @ts-ignore */
    ...(ngDevMode ? [undefined, { debugName: "cite" }] : /* istanbul ignore next */ []));
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiBlockquote, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "22.0.4", type: UiBlockquote, isStandalone: true, selector: "ui-blockquote", inputs: { cite: { classPropertyName: "cite", publicName: "cite", isSignal: true, isRequired: false, transformFunction: null } }, ngImport: i0, template: `
    <blockquote class="ui-quote">
      <ng-content />
      @if (cite()) { <footer class="cite">— {{ cite() }}</footer> }
    </blockquote>
  `, isInline: true, styles: [":host{display:block}.ui-quote{margin:0;padding:var(--ui-space-2) var(--ui-space-4);border-left:3px solid var(--ui-color-primary);color:var(--ui-color-text);font-family:var(--ui-font-default);font-style:italic}.cite{margin-top:var(--ui-space-1);font-style:normal;font-size:var(--ui-font-size-sm);color:var(--ui-color-text-muted)}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiBlockquote, decorators: [{
            type: Component,
            args: [{ selector: 'ui-blockquote', template: `
    <blockquote class="ui-quote">
      <ng-content />
      @if (cite()) { <footer class="cite">— {{ cite() }}</footer> }
    </blockquote>
  `, styles: [":host{display:block}.ui-quote{margin:0;padding:var(--ui-space-2) var(--ui-space-4);border-left:3px solid var(--ui-color-primary);color:var(--ui-color-text);font-family:var(--ui-font-default);font-style:italic}.cite{margin-top:var(--ui-space-1);font-style:normal;font-size:var(--ui-font-size-sm);color:var(--ui-color-text-muted)}\n"] }]
        }], propDecorators: { cite: [{ type: i0.Input, args: [{ isSignal: true, alias: "cite", required: false }] }] } });

/**
 * Generated bundle index. Do not edit.
 */

export { UiBlockquote, UiInlineCode, UiKbd, UiLink };
//# sourceMappingURL=ui-link.mjs.map
