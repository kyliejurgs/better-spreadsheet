import { Component, input } from '@angular/core';
import { Explorer } from '../../features/explorer/explorer';
import { Search } from '../../features/search/search';
import { LeftPanelContent } from '../navigation/left-panel-content.model';

@Component({
  selector: 'app-left-panel',
  imports: [Explorer, Search],
  templateUrl: './left-panel.html',
  styleUrl: './left-panel.css',
})
export class LeftPanel {
  readonly activeContent = input.required<LeftPanelContent>();
}
