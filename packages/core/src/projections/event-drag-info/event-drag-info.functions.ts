import { EventDragInfo } from './event-drag-info.interface';

export function hasDragOccured(eventDragInfo: EventDragInfo) {
  return eventDragInfo.endTimestamp - eventDragInfo.startTimestamp > 0;
}
