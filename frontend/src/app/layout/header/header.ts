import { Component } from '@angular/core';
import { TitleBar } from './title-bar/title-bar';
import { MenuBar } from './menu-bar/menu-bar';

@Component({
  imports: [TitleBar, MenuBar],
  selector: 'app-header',
  styleUrl: './header.css',
  templateUrl: './header.html',
})
export class Header {}
