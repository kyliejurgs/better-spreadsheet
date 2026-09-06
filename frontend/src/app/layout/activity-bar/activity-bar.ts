import { Component, input, output } from '@angular/core';
import { TuiIcon } from '@taiga-ui/core';
import { LeftPanelView } from '../../models/application-ui-state';

@Component({
  imports: [TuiIcon],
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
