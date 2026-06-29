import * as i0 from '@angular/core';
import { input, Component, inject, output, computed } from '@angular/core';
import { UI_CONFIG } from 'ui';

/** `ui-badge` — small status/count label. */
class UiBadge {
    tone = input('neutral', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "tone" }] : /* istanbul ignore next */ []));
    /** Render as a bare status dot (no content). */
    dot = input(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "dot" }] : /* istanbul ignore next */ []));
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiBadge, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.1.0", version: "22.0.4", type: UiBadge, isStandalone: true, selector: "ui-badge", inputs: { tone: { classPropertyName: "tone", publicName: "tone", isSignal: true, isRequired: false, transformFunction: null }, dot: { classPropertyName: "dot", publicName: "dot", isSignal: true, isRequired: false, transformFunction: null } }, ngImport: i0, template: `<span class="ui-badge" [attr.data-tone]="tone()" [class.dot]="dot()"><ng-content /></span>`, isInline: true, styles: [":host{display:inline-flex}.ui-badge{display:inline-flex;align-items:center;gap:var(--ui-space-1);height:20px;padding:0 var(--ui-space-2);border-radius:999px;font-size:12px;font-weight:600;line-height:1;font-family:var(--ui-font-default);background:var(--ui-color-surface-raised);color:var(--ui-color-text);border:1px solid var(--ui-color-border)}.ui-badge.dot{width:8px;height:8px;padding:0}.ui-badge[data-tone=primary]{background:var(--ui-color-primary);color:var(--ui-color-primary-contrast);border-color:transparent}.ui-badge[data-tone=success]{background:var(--ui-color-success);color:#fff;border-color:transparent}.ui-badge[data-tone=warning]{background:var(--ui-color-warning);color:#1a1d23;border-color:transparent}.ui-badge[data-tone=danger]{background:var(--ui-color-danger);color:#fff;border-color:transparent}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiBadge, decorators: [{
            type: Component,
            args: [{ selector: 'ui-badge', template: `<span class="ui-badge" [attr.data-tone]="tone()" [class.dot]="dot()"><ng-content /></span>`, styles: [":host{display:inline-flex}.ui-badge{display:inline-flex;align-items:center;gap:var(--ui-space-1);height:20px;padding:0 var(--ui-space-2);border-radius:999px;font-size:12px;font-weight:600;line-height:1;font-family:var(--ui-font-default);background:var(--ui-color-surface-raised);color:var(--ui-color-text);border:1px solid var(--ui-color-border)}.ui-badge.dot{width:8px;height:8px;padding:0}.ui-badge[data-tone=primary]{background:var(--ui-color-primary);color:var(--ui-color-primary-contrast);border-color:transparent}.ui-badge[data-tone=success]{background:var(--ui-color-success);color:#fff;border-color:transparent}.ui-badge[data-tone=warning]{background:var(--ui-color-warning);color:#1a1d23;border-color:transparent}.ui-badge[data-tone=danger]{background:var(--ui-color-danger);color:#fff;border-color:transparent}\n"] }]
        }], propDecorators: { tone: [{ type: i0.Input, args: [{ isSignal: true, alias: "tone", required: false }] }], dot: [{ type: i0.Input, args: [{ isSignal: true, alias: "dot", required: false }] }] } });

/** `ui-chip` — compact, optionally-removable tag/token. */
class UiChip {
    config = inject(UI_CONFIG);
    tone = input('neutral', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "tone" }] : /* istanbul ignore next */ []));
    removable = input(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "removable" }] : /* istanbul ignore next */ []));
    /** Used to build the remove button's accessible name. */
    label = input(/* @ts-ignore */
    ...(ngDevMode ? [undefined, { debugName: "label" }] : /* istanbul ignore next */ []));
    radius = input(this.config.radius, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "radius" }] : /* istanbul ignore next */ []));
    remove = output();
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiChip, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "22.0.4", type: UiChip, isStandalone: true, selector: "ui-chip", inputs: { tone: { classPropertyName: "tone", publicName: "tone", isSignal: true, isRequired: false, transformFunction: null }, removable: { classPropertyName: "removable", publicName: "removable", isSignal: true, isRequired: false, transformFunction: null }, label: { classPropertyName: "label", publicName: "label", isSignal: true, isRequired: false, transformFunction: null }, radius: { classPropertyName: "radius", publicName: "radius", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { remove: "remove" }, ngImport: i0, template: `
    <span class="ui-chip" [attr.data-tone]="tone()" [class.no-radius]="!radius()">
      <ng-content />
      @if (removable()) {
        <button class="x" type="button" [attr.aria-label]="'Remove ' + (label() || 'chip')" (click)="remove.emit()">×</button>
      }
    </span>
  `, isInline: true, styles: [":host{display:inline-flex}.ui-chip{display:inline-flex;align-items:center;gap:var(--ui-space-1);height:var(--ui-size-sm);padding:0 var(--ui-space-3);border-radius:999px;font-size:var(--ui-font-size-sm);font-family:var(--ui-font-default);background:var(--ui-color-surface-raised);color:var(--ui-color-text);border:1px solid var(--ui-color-border)}.ui-chip.no-radius{border-radius:var(--ui-radius)}.ui-chip[data-tone=primary]{background:color-mix(in srgb,var(--ui-color-primary) 22%,transparent);border-color:var(--ui-color-primary)}.ui-chip[data-tone=success]{background:color-mix(in srgb,var(--ui-color-success) 22%,transparent);border-color:var(--ui-color-success)}.ui-chip[data-tone=warning]{background:color-mix(in srgb,var(--ui-color-warning) 22%,transparent);border-color:var(--ui-color-warning)}.ui-chip[data-tone=danger]{background:color-mix(in srgb,var(--ui-color-danger) 22%,transparent);border-color:var(--ui-color-danger)}.x{display:inline-flex;align-items:center;justify-content:center;width:16px;height:16px;border:none;border-radius:50%;background:transparent;color:inherit;cursor:pointer;font-size:14px;line-height:1}.x:hover{background:#7f7f7f40}.x:focus-visible{outline:none;box-shadow:var(--ui-focus-ring)}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiChip, decorators: [{
            type: Component,
            args: [{ selector: 'ui-chip', template: `
    <span class="ui-chip" [attr.data-tone]="tone()" [class.no-radius]="!radius()">
      <ng-content />
      @if (removable()) {
        <button class="x" type="button" [attr.aria-label]="'Remove ' + (label() || 'chip')" (click)="remove.emit()">×</button>
      }
    </span>
  `, styles: [":host{display:inline-flex}.ui-chip{display:inline-flex;align-items:center;gap:var(--ui-space-1);height:var(--ui-size-sm);padding:0 var(--ui-space-3);border-radius:999px;font-size:var(--ui-font-size-sm);font-family:var(--ui-font-default);background:var(--ui-color-surface-raised);color:var(--ui-color-text);border:1px solid var(--ui-color-border)}.ui-chip.no-radius{border-radius:var(--ui-radius)}.ui-chip[data-tone=primary]{background:color-mix(in srgb,var(--ui-color-primary) 22%,transparent);border-color:var(--ui-color-primary)}.ui-chip[data-tone=success]{background:color-mix(in srgb,var(--ui-color-success) 22%,transparent);border-color:var(--ui-color-success)}.ui-chip[data-tone=warning]{background:color-mix(in srgb,var(--ui-color-warning) 22%,transparent);border-color:var(--ui-color-warning)}.ui-chip[data-tone=danger]{background:color-mix(in srgb,var(--ui-color-danger) 22%,transparent);border-color:var(--ui-color-danger)}.x{display:inline-flex;align-items:center;justify-content:center;width:16px;height:16px;border:none;border-radius:50%;background:transparent;color:inherit;cursor:pointer;font-size:14px;line-height:1}.x:hover{background:#7f7f7f40}.x:focus-visible{outline:none;box-shadow:var(--ui-focus-ring)}\n"] }]
        }], propDecorators: { tone: [{ type: i0.Input, args: [{ isSignal: true, alias: "tone", required: false }] }], removable: [{ type: i0.Input, args: [{ isSignal: true, alias: "removable", required: false }] }], label: [{ type: i0.Input, args: [{ isSignal: true, alias: "label", required: false }] }], radius: [{ type: i0.Input, args: [{ isSignal: true, alias: "radius", required: false }] }], remove: [{ type: i0.Output, args: ["remove"] }] } });

/**
 * `ui-avatar` — user/entity image with graceful initials fallback.
 * Provide `src`+`alt`, or `name` to render initials.
 */
class UiAvatar {
    src = input(/* @ts-ignore */
    ...(ngDevMode ? [undefined, { debugName: "src" }] : /* istanbul ignore next */ []));
    alt = input(/* @ts-ignore */
    ...(ngDevMode ? [undefined, { debugName: "alt" }] : /* istanbul ignore next */ []));
    name = input(/* @ts-ignore */
    ...(ngDevMode ? [undefined, { debugName: "name" }] : /* istanbul ignore next */ []));
    size = input('md', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "size" }] : /* istanbul ignore next */ []));
    square = input(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "square" }] : /* istanbul ignore next */ []));
    initials = computed(() => {
        const n = (this.name() ?? '').trim();
        if (!n)
            return '?';
        const parts = n.split(/\s+/);
        const first = parts[0]?.[0] ?? '';
        const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
        return (first + last).toUpperCase();
    }, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "initials" }] : /* istanbul ignore next */ []));
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiAvatar, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "22.0.4", type: UiAvatar, isStandalone: true, selector: "ui-avatar", inputs: { src: { classPropertyName: "src", publicName: "src", isSignal: true, isRequired: false, transformFunction: null }, alt: { classPropertyName: "alt", publicName: "alt", isSignal: true, isRequired: false, transformFunction: null }, name: { classPropertyName: "name", publicName: "name", isSignal: true, isRequired: false, transformFunction: null }, size: { classPropertyName: "size", publicName: "size", isSignal: true, isRequired: false, transformFunction: null }, square: { classPropertyName: "square", publicName: "square", isSignal: true, isRequired: false, transformFunction: null } }, ngImport: i0, template: `
    <span class="ui-avatar" [attr.data-size]="size()" [class.square]="square()" role="img" [attr.aria-label]="alt() || name() || 'avatar'">
      @if (src()) {
        <img [src]="src()" [alt]="alt() || name() || ''" />
      } @else {
        <span class="initials" aria-hidden="true">{{ initials() }}</span>
      }
    </span>
  `, isInline: true, styles: [":host{display:inline-flex}.ui-avatar{display:inline-flex;align-items:center;justify-content:center;width:var(--ui-size-md);height:var(--ui-size-md);border-radius:50%;overflow:hidden;background:var(--ui-color-surface-raised);color:var(--ui-color-text);border:1px solid var(--ui-color-border);font-family:var(--ui-font-default);font-weight:600;font-size:var(--ui-font-size-sm);-webkit-user-select:none;user-select:none}.ui-avatar.square{border-radius:var(--ui-radius)}.ui-avatar[data-size=sm]{width:var(--ui-size-sm);height:var(--ui-size-sm);font-size:11px}.ui-avatar[data-size=lg]{width:var(--ui-size-lg);height:var(--ui-size-lg);font-size:var(--ui-font-size-md)}img{width:100%;height:100%;object-fit:cover}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiAvatar, decorators: [{
            type: Component,
            args: [{ selector: 'ui-avatar', template: `
    <span class="ui-avatar" [attr.data-size]="size()" [class.square]="square()" role="img" [attr.aria-label]="alt() || name() || 'avatar'">
      @if (src()) {
        <img [src]="src()" [alt]="alt() || name() || ''" />
      } @else {
        <span class="initials" aria-hidden="true">{{ initials() }}</span>
      }
    </span>
  `, styles: [":host{display:inline-flex}.ui-avatar{display:inline-flex;align-items:center;justify-content:center;width:var(--ui-size-md);height:var(--ui-size-md);border-radius:50%;overflow:hidden;background:var(--ui-color-surface-raised);color:var(--ui-color-text);border:1px solid var(--ui-color-border);font-family:var(--ui-font-default);font-weight:600;font-size:var(--ui-font-size-sm);-webkit-user-select:none;user-select:none}.ui-avatar.square{border-radius:var(--ui-radius)}.ui-avatar[data-size=sm]{width:var(--ui-size-sm);height:var(--ui-size-sm);font-size:11px}.ui-avatar[data-size=lg]{width:var(--ui-size-lg);height:var(--ui-size-lg);font-size:var(--ui-font-size-md)}img{width:100%;height:100%;object-fit:cover}\n"] }]
        }], propDecorators: { src: [{ type: i0.Input, args: [{ isSignal: true, alias: "src", required: false }] }], alt: [{ type: i0.Input, args: [{ isSignal: true, alias: "alt", required: false }] }], name: [{ type: i0.Input, args: [{ isSignal: true, alias: "name", required: false }] }], size: [{ type: i0.Input, args: [{ isSignal: true, alias: "size", required: false }] }], square: [{ type: i0.Input, args: [{ isSignal: true, alias: "square", required: false }] }] } });

/**
 * `ui-avatar-group` — overlapping stack of avatars. Project `ui-avatar`
 * elements; they overlap by the `--ui-avatar-overlap` amount.
 */
class UiAvatarGroup {
    /** Maximum avatars before collapsing (consumer-managed; informational). */
    max = input(/* @ts-ignore */
    ...(ngDevMode ? [undefined, { debugName: "max" }] : /* istanbul ignore next */ []));
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiAvatarGroup, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.1.0", version: "22.0.4", type: UiAvatarGroup, isStandalone: true, selector: "ui-avatar-group", inputs: { max: { classPropertyName: "max", publicName: "max", isSignal: true, isRequired: false, transformFunction: null } }, ngImport: i0, template: `<div class="grp" role="group"><ng-content /></div>`, isInline: true, styles: [":host{display:inline-flex}.grp{display:inline-flex}.grp ::ng-deep ui-avatar:not(:first-child){margin-left:calc(-1 * var(--ui-space-3))}.grp ::ng-deep ui-avatar .ui-avatar{box-shadow:0 0 0 2px var(--ui-color-bg)}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.0.4", ngImport: i0, type: UiAvatarGroup, decorators: [{
            type: Component,
            args: [{ selector: 'ui-avatar-group', template: `<div class="grp" role="group"><ng-content /></div>`, styles: [":host{display:inline-flex}.grp{display:inline-flex}.grp ::ng-deep ui-avatar:not(:first-child){margin-left:calc(-1 * var(--ui-space-3))}.grp ::ng-deep ui-avatar .ui-avatar{box-shadow:0 0 0 2px var(--ui-color-bg)}\n"] }]
        }], propDecorators: { max: [{ type: i0.Input, args: [{ isSignal: true, alias: "max", required: false }] }] } });

/**
 * Generated bundle index. Do not edit.
 */

export { UiAvatar, UiAvatarGroup, UiBadge, UiChip };
//# sourceMappingURL=ui-badge.mjs.map
