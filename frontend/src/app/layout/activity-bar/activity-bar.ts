import { Component, input, output } from '@angular/core';
import { LeftPanelContent } from '../navigation/left-panel-content.model';

@Component({
  selector: 'app-activity-bar',
  imports: [],
  templateUrl: './activity-bar.html',
  styleUrl: './activity-bar.css',
})
export class ActivityBar {
  readonly activePanelContent = input.required<LeftPanelContent>();
  readonly viewContent = output<LeftPanelContent>();

  protected selectContent(content: LeftPanelContent): void {
    this.viewContent.emit(content);
  }
}
