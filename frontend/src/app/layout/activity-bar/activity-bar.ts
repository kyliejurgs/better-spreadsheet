import { Component, input, output } from '@angular/core';
import { TuiIcon } from '@taiga-ui/core';
import { LeftPanelView } from '../../core/ui-state/application-ui-state.model';
import { SettingsMenu } from '../../features/settings/settings-menu/settings-menu';

@Component({
  imports: [TuiIcon, SettingsMenu],
  selector: 'app-activity-bar',
  styleUrl: './activity-bar.css',
  templateUrl: './activity-bar.html',
})
export class ActivityBar {
  readonly activeView = input.required<LeftPanelView>();
  readonly viewSelected = output<LeftPanelView>();

  protected selectView(view: LeftPanelView): void {
    this.viewSelected.emit(view);
  }
}
