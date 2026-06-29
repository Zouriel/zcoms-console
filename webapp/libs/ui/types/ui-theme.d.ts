import * as i0 from '@angular/core';

/**
 * Built-in theme names. `dark` (default) and `light` are the professional
 * themes; `dramatic` is the cinematic ink/ember skin (requires
 * `ui/styles/theme-dramatic.css`). Consumers may register their own theme
 * names too — any string is accepted by {@link UiThemeService.set}.
 */
type UiTheme = 'dark' | 'light' | 'dramatic' | (string & {});
/**
 * Global theme controller. Drives `data-theme` on the document root so the
 * token overrides in `ui/styles/tokens.css` take effect app-wide. For scoped
 * theming of a subtree, use {@link UiThemeProvider} instead.
 */
declare class UiThemeService {
    private readonly doc;
    /** Current global theme. Defaults to dark (the library's base palette). */
    readonly theme: i0.WritableSignal<UiTheme>;
    constructor();
    set(theme: UiTheme): void;
    toggle(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<UiThemeService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<UiThemeService>;
}

/**
 * Scoped theme boundary. Wrap any subtree to override the theme for just that
 * region — the token custom properties cascade to descendants. Uses
 * `display: contents` so it never introduces layout of its own.
 *
 *   <ui-theme-provider theme="light"> ... </ui-theme-provider>
 */
declare class UiThemeProvider {
    theme: i0.ModelSignal<UiTheme>;
    static ɵfac: i0.ɵɵFactoryDeclaration<UiThemeProvider, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<UiThemeProvider, "ui-theme-provider", never, { "theme": { "alias": "theme"; "required": false; "isSignal": true; }; }, { "theme": "themeChange"; }, never, ["*"], true, never>;
}

export { UiThemeProvider, UiThemeService };
export type { UiTheme };
