import { Component } from '@angular/core';

import { OnPushListItemRemovedEvent } from '../../types/on-push-list-item-removed-event.interface';
import { addOnPushListItem, removeOnPushListItem } from '../../types/on-push-list-item.functions';
import { addOnPushList, createDefaultOnPushLists, removeOnPushList } from '../../types/on-push-list.functions';
import { OnPushList } from '../../types/on-push-list.interface';

@Component({
  selector: 'al-on-push-demo',
  templateUrl: './on-push-demo.component.html'
})
export class OnPushDemoComponent {
  public useOnPush = false;
  public counter = 0;
  public lists: OnPushList[] = createDefaultOnPushLists();

  public incrementCounter() {
    this.counter++;
  }

  public addList() {
    this.lists = addOnPushList(this.lists);
  }

  public removeList(list: OnPushList) {
    this.lists = removeOnPushList(this.lists, list);
  }

  public addListItem(list: OnPushList) {
    addOnPushListItem(list);
  }

  public removeListItem(event: OnPushListItemRemovedEvent) {
    removeOnPushListItem(event.list, event.item);
  }
}
