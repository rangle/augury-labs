import { ChangeDetectionStrategy, Component } from '@angular/core';

interface MenuTab {
  id: number;
  tabName: string;
  active?: boolean;
}

@Component({
  selector: 'ag-header-menu',
  templateUrl: './header-menu.component.html',
  styleUrls: ['./header-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderMenuComponent {
  public tabs: MenuTab[] = [{ id: 0, tabName: 'Performance Profiler', active: true }];

  public trackByTabId(index, tab: MenuTab) {
    return tab ? tab.id : null;
  }

  public onSetActiveTab(id: number) {
    this.changeTabActiveStatus(this.tabs.find(tab => tab.active), false);
    this.changeTabActiveStatus(this.tabs.find(tab => tab.id === id), true);
  }

  private changeTabActiveStatus(tab: MenuTab, active: boolean) {
    if (tab) {
      tab.active = active;
    }
  }
}
