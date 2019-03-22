import { OnPushListItem } from './on-push-list-item.interface';
import { OnPushList } from './on-push-list.interface';

let nextId = 0;

export function createDefaultOnPushListItems(NumberOfItems: number): OnPushListItem[] {
  return Array.apply(null, {length: NumberOfItems})
    .reduce(items => [{ id: nextId++ }].concat(items), []);
}

export function addOnPushListItem(list: OnPushList) {
  list.items = [{ id: nextId++ }].concat(list.items);
}

export function removeOnPushListItem(list: OnPushList, itemToRemove: OnPushListItem) {
  list.items = list.items.filter(item => item.id !== itemToRemove.id);
}
