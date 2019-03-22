import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { OnPushListItem } from '../../types/on-push-list-item.interface';
import { OnPushList } from '../../types/on-push-list.interface';

@Component({
  selector: 'al-list-with-out-on-push',
  templateUrl: './list-with-out-on-push.component.html',
  changeDetection: ChangeDetectionStrategy.Default
})
export class ListWithOutOnPushComponent {
  @Input()
  public list;

  @Output()
  public listItemAdded = new EventEmitter<OnPushList>();

  @Output()
  public listItemRemoved = new EventEmitter<{ list: OnPushList, item: OnPushListItem }>();

  public trackByOnPushListItem(index, item: OnPushListItem) {
    return item ? item.id : null;
  }
}
