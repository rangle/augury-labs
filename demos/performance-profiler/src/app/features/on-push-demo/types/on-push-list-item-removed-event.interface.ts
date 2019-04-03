import { OnPushListItem } from './on-push-list-item.interface';
import { OnPushList } from './on-push-list.interface';

export interface OnPushListItemRemovedEvent {
  list: OnPushList;
  item: OnPushListItem;
}
