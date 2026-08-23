import { Component } from '@angular/core';
import { Logo } from '../../shared/logo/logo';

@Component({
  selector: 'app-top-bar',
  imports: [Logo],
  templateUrl: './top-bar.html',
  styleUrl: './top-bar.css',
})
export class TopBar {}
