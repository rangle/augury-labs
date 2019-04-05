import { AuguryEventName } from './augury-event-name.type';

export class AuguryEvent {
  private static NextId = 0;

  public readonly id: number;
  public readonly payload: any;
  public readonly creationAtTimestamp: number;
  public readonly completedAtTimestamp: number;

  constructor(
    public readonly probeName: string,
    public readonly name: AuguryEventName,
    createPayload: () => any,
  ) {
    this.id = AuguryEvent.NextId++;
    this.creationAtTimestamp = performance.now();
    this.payload = createPayload();
    this.completedAtTimestamp = performance.now();
  }

  public isIdInRange(startEventId: number, endEventId: number): boolean {
    return this.id >= startEventId && this.id <= endEventId;
  }

  public getAuguryDrag() {
    return this.completedAtTimestamp - this.creationAtTimestamp;
  }
}
