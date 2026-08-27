import { Component, signal } from '@angular/core';
import { ApplicationLayout } from './app/layout/application-layout/application-layout';

@Component({
  imports: [ApplicationLayout],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('frontend');
}
