import { InjectionToken, Provider } from '@angular/core';

/** Shared primitive types used across the library. */
/** The fixed size scale. Components never accept arbitrary sizes. */
type UiSize = 'sm' | 'md' | 'lg';
/** Status/tone scale shared by badges, chips, progress, etc. */
type UiStatus = 'neutral' | 'primary' | 'success' | 'warning' | 'danger';

/**
 * Global library configuration. Consumers set defaults once via
 * `provideUiConfig({ ... })` in `app.config.ts`; every component reads these
 * defaults from {@link UI_CONFIG} and lets its own inputs override per-instance.
 */
interface UiConfig {
    /** Default glass treatment on surface components (card, window, modal, …). */
    glass: boolean;
    /** Rounded corners on/off. */
    radius: boolean;
    /** Fallback font-family applied when a component's `font` input is unset. */
    defaultFont: string;
    /** Master animation switch — disables all component animations when false. */
    animations: boolean;
}
declare const UI_CONFIG: InjectionToken<UiConfig>;
declare const defaultUiConfig: UiConfig;
declare function provideUiConfig(config?: Partial<UiConfig>): Provider;
/**
 * Convenience accessor for components. Always returns a fully-resolved config
 * (falls back to {@link defaultUiConfig} when no provider is present).
 */
declare function injectUiConfig(): UiConfig;

/**
 * Typed handles for the shared animation classes defined in
 * `ui/styles/animations.css`. Use these with Angular's modern CSS enter/leave
 * bindings so durations/easings stay token-driven and reduced-motion-safe:
 *
 *   import { UI_ANIM } from 'ui';
 *   <div [animate.enter]="UI_ANIM.scale.enter" [animate.leave]="UI_ANIM.scale.leave">
 */
declare const UI_ANIM: {
    readonly fade: {
        readonly enter: "ui-fade-enter";
        readonly leave: "ui-fade-leave";
    };
    readonly scale: {
        readonly enter: "ui-scale-enter";
        readonly leave: "ui-scale-leave";
    };
    readonly slideUp: {
        readonly enter: "ui-slide-up-enter";
        readonly leave: "ui-slide-up-leave";
    };
    readonly slideDown: {
        readonly enter: "ui-slide-down-enter";
        readonly leave: "ui-slide-down-leave";
    };
    readonly slideLeft: {
        readonly enter: "ui-slide-left-enter";
        readonly leave: "ui-slide-left-leave";
    };
    readonly slideRight: {
        readonly enter: "ui-slide-right-enter";
        readonly leave: "ui-slide-right-leave";
    };
    readonly sheet: {
        readonly enter: "ui-sheet-enter";
        readonly leave: "ui-sheet-leave";
    };
    readonly backdrop: {
        readonly enter: "ui-backdrop-enter";
        readonly leave: "ui-backdrop-leave";
    };
    readonly window: {
        readonly enter: "ui-window-open-enter";
        readonly leave: "ui-window-close-leave";
        readonly dock: "ui-window-dock";
    };
};

export { UI_ANIM, UI_CONFIG, defaultUiConfig, injectUiConfig, provideUiConfig };
export type { UiConfig, UiSize, UiStatus };
