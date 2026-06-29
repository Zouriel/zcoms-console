import * as _angular_core from '@angular/core';
import { OnInit, OnDestroy } from '@angular/core';
import { ConnectedPosition } from '@angular/cdk/overlay';

/**
 * `ui-navbar` — top navigation surface (glass-capable). Slots:
 * `[navbar-brand]`, default (center/links), `[navbar-actions]`.
 */
declare class UiNavbar {
    private config;
    sticky: _angular_core.InputSignal<boolean>;
    glass: _angular_core.InputSignal<boolean>;
    radius: _angular_core.InputSignal<boolean>;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiNavbar, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiNavbar, "ui-navbar", never, { "sticky": { "alias": "sticky"; "required": false; "isSignal": true; }; "glass": { "alias": "glass"; "required": false; "isSignal": true; }; "radius": { "alias": "radius"; "required": false; "isSignal": true; }; }, {}, never, ["[navbar-brand]", "*", "[navbar-actions]"], true, never>;
}

/** `ui-pagination` — page navigation with truncation and prev/next. */
declare class UiPagination {
    page: _angular_core.ModelSignal<number>;
    total: _angular_core.InputSignal<number>;
    /** Sibling pages to show around current. */
    siblings: _angular_core.InputSignal<number>;
    label: _angular_core.InputSignal<string>;
    protected readonly items: _angular_core.Signal<number[]>;
    protected go(p: number): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiPagination, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiPagination, "ui-pagination", never, { "page": { "alias": "page"; "required": false; "isSignal": true; }; "total": { "alias": "total"; "required": false; "isSignal": true; }; "siblings": { "alias": "siblings"; "required": false; "isSignal": true; }; "label": { "alias": "label"; "required": false; "isSignal": true; }; }, { "page": "pageChange"; }, never, never, true, never>;
}

interface UiBreadcrumb {
    label: string;
    href?: string;
    value?: string;
}
/** `ui-breadcrumbs` — hierarchical trail. Emits `(navigate)` for items without href. */
declare class UiBreadcrumbs {
    items: _angular_core.InputSignal<UiBreadcrumb[]>;
    separator: _angular_core.InputSignal<string>;
    navigate: _angular_core.OutputEmitterRef<UiBreadcrumb>;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiBreadcrumbs, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiBreadcrumbs, "ui-breadcrumbs", never, { "items": { "alias": "items"; "required": false; "isSignal": true; }; "separator": { "alias": "separator"; "required": false; "isSignal": true; }; }, { "navigate": "navigate"; }, never, never, true, never>;
}

interface UiStep {
    label: string;
    description?: string;
}
/** `ui-stepper` — horizontal progress through ordered steps. */
declare class UiStepper {
    steps: _angular_core.InputSignal<UiStep[]>;
    active: _angular_core.InputSignal<number>;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiStepper, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiStepper, "ui-stepper", never, { "steps": { "alias": "steps"; "required": false; "isSignal": true; }; "active": { "alias": "active"; "required": false; "isSignal": true; }; }, {}, never, never, true, never>;
}

interface UiBottomNavItem {
    label: string;
    value: string;
    icon?: string;
    badge?: string | number;
}
/** `ui-bottom-nav` — mobile-style bottom navigation bar (glass-capable). */
declare class UiBottomNav {
    private config;
    items: _angular_core.InputSignal<UiBottomNavItem[]>;
    active: _angular_core.ModelSignal<string>;
    glass: _angular_core.InputSignal<boolean>;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiBottomNav, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiBottomNav, "ui-bottom-nav", never, { "items": { "alias": "items"; "required": false; "isSignal": true; }; "active": { "alias": "active"; "required": false; "isSignal": true; }; "glass": { "alias": "glass"; "required": false; "isSignal": true; }; }, { "active": "activeChange"; }, never, never, true, never>;
}

interface UiAnchorItem {
    id: string;
    label: string;
}
/** `ui-anchor-nav` — scrollspy navigation: highlights the section in view and scrolls to it on click. */
declare class UiAnchorNav implements OnInit, OnDestroy {
    private doc;
    private zone;
    items: _angular_core.InputSignal<UiAnchorItem[]>;
    /** CSS scroll-margin offset applied when scrolling to a section. */
    offset: _angular_core.InputSignal<number>;
    protected readonly active: _angular_core.WritableSignal<string>;
    private observer?;
    ngOnInit(): void;
    ngOnDestroy(): void;
    protected scrollTo(id: string): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiAnchorNav, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiAnchorNav, "ui-anchor-nav", never, { "items": { "alias": "items"; "required": false; "isSignal": true; }; "offset": { "alias": "offset"; "required": false; "isSignal": true; }; }, {}, never, never, true, never>;
}

interface UiMenubarItem {
    label: string;
    value: string;
    disabled?: boolean;
}
interface UiMenubarMenu {
    label: string;
    items: UiMenubarItem[];
}
/** `ui-menubar` — application-style horizontal menu bar with dropdown menus (one open at a time). */
declare class UiMenubar {
    menus: _angular_core.InputSignal<UiMenubarMenu[]>;
    select: _angular_core.OutputEmitterRef<UiMenubarItem>;
    protected readonly openIndex: _angular_core.WritableSignal<number | null>;
    protected readonly positions: ConnectedPosition[];
    protected toggle(i: number): void;
    protected hoverOpen(i: number): void;
    protected choose(item: UiMenubarItem): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiMenubar, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiMenubar, "ui-menubar", never, { "menus": { "alias": "menus"; "required": false; "isSignal": true; }; }, { "select": "select"; }, never, never, true, never>;
}

interface UiSideNavItem {
    label: string;
    value: string;
    icon?: string;
    badge?: string | number;
    disabled?: boolean;
}
interface UiSideNavGroup {
    label?: string;
    items: UiSideNavItem[];
}
/**
 * `ui-side-nav` — vertical, grouped navigation rail (docs/app sidebar). Bind
 * `[(active)]` to the selected value and listen to `(navigate)`. Router-
 * agnostic: map the emitted item to a route yourself.
 */
declare class UiSideNav {
    groups: _angular_core.InputSignal<UiSideNavGroup[]>;
    active: _angular_core.ModelSignal<string>;
    label: _angular_core.InputSignal<string>;
    navigate: _angular_core.OutputEmitterRef<UiSideNavItem>;
    protected choose(item: UiSideNavItem): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<UiSideNav, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<UiSideNav, "ui-side-nav", never, { "groups": { "alias": "groups"; "required": false; "isSignal": true; }; "active": { "alias": "active"; "required": false; "isSignal": true; }; "label": { "alias": "label"; "required": false; "isSignal": true; }; }, { "active": "activeChange"; "navigate": "navigate"; }, never, never, true, never>;
}

export { UiAnchorNav, UiBottomNav, UiBreadcrumbs, UiMenubar, UiNavbar, UiPagination, UiSideNav, UiStepper };
export type { UiAnchorItem, UiBottomNavItem, UiBreadcrumb, UiMenubarItem, UiMenubarMenu, UiSideNavGroup, UiSideNavItem, UiStep };
