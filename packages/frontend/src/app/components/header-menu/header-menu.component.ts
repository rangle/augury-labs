import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MenuTab, TabService } from 'app/services/tab.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'ag-header-menu',
  templateUrl: './header-menu.component.html',
  styleUrls: ['./header-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderMenuComponent {
  public tabs$: Observable<MenuTab[]>;

  constructor(private tabService: TabService) {
    this.tabs$ = this.tabService.tabs$;
  }

  public trackByTabId(index, tab: MenuTab) {
    return tab ? tab.id : null;
  }

  public onSetActiveTab(id: number) {
    this.tabService.setActiveTab(id);
  }
}
