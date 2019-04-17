import { AuguryEvent } from '../../events';
import { EventProjection } from '../event-projection.class';
import { EventDragInfo } from './event-drag-info.interface';

export class EventDragInfoProjection extends EventProjection<EventDragInfo> {
  private eventDragInfo: EventDragInfo;

  public process(event: AuguryEvent): boolean {
    this.eventDragInfo = {
      startTimestamp: event.timePeriod.startTimestamp,
      endTimestamp: event.timePeriod.endTimestamp,
    };

    return true;
  }

  protected getResult(): EventDragInfo | null {
    return this.eventDragInfo;
  }

  protected cleanup() {
    this.eventDragInfo = null;
  }
}
