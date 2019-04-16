import { Probe } from '../probes';
import { DragPeriod } from './drag-period.class';

export class AuguryEvent {
  private static NextId = 0;

  public readonly id: number;
  public readonly probeName: string;
  private timestamps: DragPeriod = null;

  constructor(probe: Probe) {
    this.id = AuguryEvent.NextId++;
    this.probeName = probe.constructor.name;
  }

  public set dragPeriod(dragPeriod: DragPeriod) {
    if (this.timestamps) {
      throw new Error('The drag period is already set!');
    }

    dragPeriod.markComplete();

    this.timestamps = dragPeriod;
  }

  public get dragPeriod(): DragPeriod {
    return this.timestamps;
  }

  public isInstanceOf(clazz: any): boolean {
    return this.constructor.name === clazz.name;
  }

  public isIdInRange(startEventId: number, endEventId: number): boolean {
    return this.id >= startEventId && this.id <= endEventId;
  }

  public getAuguryDrag() {
    return this.dragPeriod.getElapsedTime();
  }
}
