import { Component } from '@angular/core';

@Component({
  selector: 'ag-header-menu',
  templateUrl: './header-menu.component.html',
  styleUrls: ['./header-menu.component.scss'],
})
export class HeaderMenuComponent {
  public tabs = ['Performance Profiler'];
  public activeTabId = 0;
}
