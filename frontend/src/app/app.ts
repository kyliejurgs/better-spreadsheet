import { TuiRoot } from '@taiga-ui/core';
import { Component, signal } from '@angular/core';
import { ApplicationLayout } from './layout/application-layout/application-layout';

@Component({
  imports: [ApplicationLayout, TuiRoot, TuiRoot],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('frontend');
}
