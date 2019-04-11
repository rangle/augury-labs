import { AuguryEvent } from '../../events';
import { AuguryEventProjection } from '../augury-event-projection.interface';
import { EventDragInfo } from './event-drag-info.interface';

export class EventDragInfoProjection implements AuguryEventProjection<EventDragInfo> {
  public transform(event: AuguryEvent): EventDragInfo | null {
    return {
      startTimestamp: event.creationAtTimestamp,
      endTimestamp: event.completedAtTimestamp,
    };
  }
}
