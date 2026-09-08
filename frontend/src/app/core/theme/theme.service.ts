import { DOCUMENT, inject, Injectable, signal } from '@angular/core';
import { ApplicationUiStateService } from '../ui-state/application-ui-state.service';
import { ResolvedTheme, Theme } from './theme.model';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly uiState = inject(ApplicationUiStateService);

  private readonly systemThemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
  readonly resolvedTheme = signal<ResolvedTheme>('light');

  initialize(): void {
    this.applyTheme();
    this.systemThemeQuery.addEventListener('change', () => {
      if (this.uiState.theme() === 'system') {
        this.applyTheme();
      }
    });
  }

  async setTheme(theme: Theme): Promise<void> {
    this.uiState.theme.set(theme);
    this.applyTheme();
    await this.uiState.save();
  }

  private applyTheme(): void {
    const resolvedTheme = this.resolveTheme(this.uiState.theme());
    this.resolvedTheme.set(resolvedTheme);
    this.document.documentElement.dataset['theme'] = resolvedTheme;
  }

  private resolveTheme(theme: Theme): ResolvedTheme {
    if (theme !== 'system') {
      return theme;
    }

    return this.systemThemeQuery.matches ? 'dark' : 'light';
  }
}
