import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { OnPushListItem } from '../../types/on-push-list-item.interface';

@Component({
  selector: 'al-list-item-with-out-on-push',
  templateUrl: './list-item-with-out-on-push.component.html',
  changeDetection: ChangeDetectionStrategy.Default
})
export class ListItemWithOutOnPushComponent {
  @Input()
  public item: OnPushListItem;
}
