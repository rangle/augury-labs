import { createDefaultOnPushListItems } from './on-push-list-item.functions';
import { OnPushList } from './on-push-list.interface';

const NumberOfItems = 10;
let nextListId = 0;

export function createDefaultOnPushLists(): OnPushList[] {
  return Array.apply(null, { length: NumberOfItems }).reduce(lists => addOnPushList(lists), []);
}

export function addOnPushList(lists: OnPushList[]): OnPushList[] {
  return [createOnPushList()].concat(lists);
}

export function removeOnPushList(lists: OnPushList[], listToRemove: OnPushList): OnPushList[] {
  return lists.filter(list => list !== listToRemove);
}

function createOnPushList(): OnPushList {
  return {
    id: nextListId++,
    items: createDefaultOnPushListItems(NumberOfItems),
  };
}
