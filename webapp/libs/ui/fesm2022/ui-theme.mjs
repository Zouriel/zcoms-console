import { DOCUMENT } from '@angular/common';
import * as i0 from '@angular/core';
import { inject, signal, effect, Injectable, model, Component } from '@angular/core';

/**
 * Global theme controller. Drives `data-theme` on the document root so the
 * token overrides in `ui/styles/tokens.css` take effect app-wide. For scoped
 * theming of a subtree, use {@link UiThemeProvider} instead.
 */
class UiThemeService {
    doc = inject(DOCUMENT);
    /** Current global theme. Defaults to dark (the library's base palette). */
    theme = signal('dark', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "theme" }] : /* istanbul ignore next */ []));
    constructor() {
        effect(() => {
            const root = this.doc.documentElement;
            if (root) {
                root.dataset['theme'] = this.theme();
            }
        });
    }
    set(theme) {
        this.theme.set(theme);
    }
    toggle() {
        this.theme.update((t) => (t === 'dark' ? 'light' : 'dark'));
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiThemeService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiThemeService, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiThemeService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [] });

/**
 * Scoped theme boundary. Wrap any subtree to override the theme for just that
 * region — the token custom properties cascade to descendants. Uses
 * `display: contents` so it never introduces layout of its own.
 *
 *   <ui-theme-provider theme="light"> ... </ui-theme-provider>
 */
class UiThemeProvider {
    theme = model('dark', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "theme" }] : /* istanbul ignore next */ []));
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiThemeProvider, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.1.0", version: "22.0.4", type: UiThemeProvider, isStandalone: true, selector: "ui-theme-provider", inputs: { theme: { classPropertyName: "theme", publicName: "theme", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { theme: "themeChange" }, host: { properties: { "attr.data-theme": "theme()" } }, ngImport: i0, template: `<ng-content />`, isInline: true, styles: [":host{display:contents}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiThemeProvider, decorators: [{
            type: Component,
            args: [{ selector: 'ui-theme-provider', template: `<ng-content />`, host: { '[attr.data-theme]': 'theme()' }, styles: [":host{display:contents}\n"] }]
        }], propDecorators: { theme: [{ type: i0.Input, args: [{ isSignal: true, alias: "theme", required: false }] }, { type: i0.Output, args: ["themeChange"] }] } });

/**
 * Generated bundle index. Do not edit.
 */

export { UiThemeProvider, UiThemeService };
//# sourceMappingURL=ui-theme.mjs.map
