import { Component, EventEmitter, Input, Output } from '@angular/core';

import { OnPushListItemRemovedEvent } from '../../types/on-push-list-item-removed-event.interface';
import { OnPushList } from '../../types/on-push-list.interface';

@Component({
  selector: 'al-on-push-demo-lists',
  templateUrl: './on-push-demo-lists.component.html',
})
export class OnPushDemoListsComponent {
  @Input()
  public lists;

  @Input()
  public useOnPush: boolean;

  @Output()
  public listRemoved = new EventEmitter<OnPushList>();

  @Output()
  public listItemAdded = new EventEmitter<OnPushList>();

  @Output()
  public listItemRemoved = new EventEmitter<OnPushListItemRemovedEvent>();

  public trackByList(index, list: OnPushList) {
    return list ? list.id : null;
  }
}
