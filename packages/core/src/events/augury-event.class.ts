import { AuguryEventName } from './augury-event-name.type';
import { AuguryEventPayload } from './augury-event-payload.interface';
import { AuguryEventSource } from './augury-event-source.interface';

export class AuguryEvent {
  private static NextId = 0;

  public readonly id: number;
  public readonly creationAtTimestamp: number = performance.now();
  public completedAtTimestamp?: number;

  constructor(
    public readonly source: AuguryEventSource,
    public readonly name: AuguryEventName,
    public readonly payload: AuguryEventPayload = {},
  ) {
    this.id = AuguryEvent.NextId++;
  }

  public isIdInRange(startEventId: number, endEventId: number): boolean {
    return this.id >= startEventId && this.id <= endEventId;
  }

  public markComplete() {
    this.completedAtTimestamp = performance.now();
  }

  public getAuguryDrag() {
    return this.completedAtTimestamp ? this.completedAtTimestamp - this.creationAtTimestamp : 0;
  }
}
