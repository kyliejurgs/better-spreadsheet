import { Component, inject, signal } from '@angular/core';
import { ThemeService } from '../../../core/theme/theme.service';
import { ApplicationUiStateService } from '../../../core/ui-state/application-ui-state.service';
import { Theme, THEMES } from '../../../core/theme/theme.model';
import { TuiDropdown, TuiIcon, TuiDataList } from '@taiga-ui/core';
import { TuiDataListDropdownManager } from '@taiga-ui/kit';

@Component({
  imports: [TuiDropdown, TuiIcon, TuiDataList, TuiDataListDropdownManager],
  selector: 'app-settings-menu',
  styleUrl: './settings-menu.css',
  templateUrl: './settings-menu.html',
})
export class SettingsMenu {
  private readonly themeService = inject(ThemeService);
  private readonly uiState = inject(ApplicationUiStateService);

  protected readonly themes = THEMES;

  protected readonly open = signal(false);
  protected readonly theme = this.uiState.theme;

  protected setTheme(theme: Theme): void {
    void this.themeService.setTheme(theme);
    this.open.set(false);
  }
}
