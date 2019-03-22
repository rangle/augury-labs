import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { OnPushListItemRemovedEvent } from '../../types/on-push-list-item-removed-event.interface';
import { OnPushListItem } from '../../types/on-push-list-item.interface';
import { OnPushList } from '../../types/on-push-list.interface';

@Component({
  selector: 'al-list-with-on-push',
  templateUrl: './list-with-on-push.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListWithOnPushComponent {
  @Input()
  public list;

  @Output()
  public listItemAdded = new EventEmitter<OnPushList>();

  @Output()
  public listItemRemoved = new EventEmitter<OnPushListItemRemovedEvent>();

  public trackByOnPushListItem(index, item: OnPushListItem) {
    return item ? item.id : null;
  }
}
