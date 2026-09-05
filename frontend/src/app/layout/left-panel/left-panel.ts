import { Component, input } from '@angular/core';
import { Explorer } from '../../features/explorer/explorer';
import { Search } from '../../features/search/search';
import { LeftPanelView } from '../../models/application-ui-state';

@Component({
  imports: [Explorer, Search],
  selector: 'app-left-panel',
  styleUrl: './left-panel.css',
  templateUrl: './left-panel.html',
})
export class LeftPanel {
  readonly activeView = input.required<LeftPanelView>();
}
