// Barrel of the ui-library standalone components used across the console, so a
// page can `imports: [...UI]` instead of listing each. Services (UiToastService)
// are injected directly from 'ui/dialog' where needed.
import { UiButton, UiIconButton } from 'ui/button';
import { UiCard } from 'ui/card';
import { UiTable } from 'ui/table';
import {
  UiInput, UiSelect, UiTextarea, UiFormField, UiSwitch, UiPasswordInput, UiSearchInput,
} from 'ui/form';
import { UiText } from 'ui/text';
import { UiBadge, UiChip } from 'ui/badge';
import { UiModal, UiToastHost } from 'ui/dialog';
import { UiAlert } from 'ui/alert';
import { UiStack, UiGrid, UiContainer, UiSidebarLayout } from 'ui/layout';
import { UiSideNav } from 'ui/navigation';
import { UiSpinner } from 'ui/spinner';

export const UI = [
  UiButton, UiIconButton, UiCard, UiTable,
  UiInput, UiSelect, UiTextarea, UiFormField, UiSwitch, UiPasswordInput, UiSearchInput,
  UiText, UiBadge, UiChip, UiModal, UiToastHost, UiAlert,
  UiStack, UiGrid, UiContainer, UiSidebarLayout, UiSideNav, UiSpinner,
];
