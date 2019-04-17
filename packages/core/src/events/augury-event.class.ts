import { EventClassType } from './event-class-type.type';
import { TimePeriod } from './time-period.class';

export class AuguryEvent {
  private static NextId = 0;

  public readonly id: number;
  private timestamps: TimePeriod = null;

  constructor() {
    this.id = AuguryEvent.NextId++;
  }

  public set timePeriod(timePeriod: TimePeriod) {
    if (this.timestamps) {
      throw new Error('The drag period is already set!');
    }

    timePeriod.markComplete();

    this.timestamps = timePeriod;
  }

  public get timePeriod(): TimePeriod {
    return this.timestamps;
  }

  public isInstanceOf(clazz: EventClassType): boolean {
    return this.constructor.name === clazz.name;
  }

  public isIdInRange(startEventId: number, endEventId: number): boolean {
    return this.id >= startEventId && this.id <= endEventId;
  }

  public getAuguryDrag() {
    return this.timePeriod.getElapsedTime();
  }
}
