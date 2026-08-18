import { Component } from '@angular/core';
import { ApplicationLayout } from './layout/application-layout/application-layout';

@Component({
  selector: 'app-root',
  imports: [ApplicationLayout],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
