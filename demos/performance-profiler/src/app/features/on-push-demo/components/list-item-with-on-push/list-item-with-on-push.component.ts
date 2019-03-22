import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { OnPushListItem } from '../../types/on-push-list-item.interface';

@Component({
  selector: 'al-list-item-with-on-push',
  templateUrl: './list-item-with-on-push.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListItemWithOnPushComponent {
  @Input()
  public item: OnPushListItem;
}
