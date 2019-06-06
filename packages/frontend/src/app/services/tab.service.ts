import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface MenuTab {
  id: number;
  tabName: string;
  active?: boolean;
}

@Injectable()
export class TabService {
  private tabs = new BehaviorSubject<MenuTab[]>([
    { id: 0, tabName: 'Performance Profiler', active: true },
    { id: 1, tabName: 'Insights', active: false },
  ]);

  get tabs$(): Observable<MenuTab[]> {
    return this.tabs.asObservable();
  }

  get activeTab$(): Observable<MenuTab> {
    return this.tabs$.pipe(map(tabs => tabs.find(tab => tab.active)));
  }

  public setActiveTab(tabId: number) {
    const tabs = this.tabs.value.map(tab => ({ ...tab, active: tab.id === tabId }));
    this.tabs.next(tabs);
  }
}
