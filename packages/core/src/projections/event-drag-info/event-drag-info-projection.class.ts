import { AuguryEvent } from '../../events';
import { AuguryEventProjection } from '../augury-event-projection.class';
import { EventDragInfo } from './event-drag-info.interface';

export class EventDragInfoProjection extends AuguryEventProjection<EventDragInfo> {
  private eventDragInfo: EventDragInfo;

  public process(event: AuguryEvent): boolean {
    this.eventDragInfo = {
      startTimestamp: event.creationAtTimestamp,
      endTimestamp: event.completedAtTimestamp,
    };

    return true;
  }

  protected getOutput(): EventDragInfo | null {
    return this.eventDragInfo;
  }

  protected cleanup() {
    this.eventDragInfo = null;
  }
}
