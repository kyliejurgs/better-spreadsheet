import { TuiRoot } from '@taiga-ui/core';
import { Component, inject, signal } from '@angular/core';
import { ApplicationLayout } from './layout/application-layout/application-layout';
import { ThemeService } from './core/theme/theme.service';

@Component({
  imports: [ApplicationLayout, TuiRoot],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  private readonly themeService = inject(ThemeService);

  protected readonly title = signal('frontend');
  protected readonly resolvedTheme = this.themeService.resolvedTheme;
}
