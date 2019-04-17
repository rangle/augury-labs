export class TimePeriod {
  public startTimestamp: number;
  public endTimestamp: number;

  constructor() {
    this.startTimestamp = performance.now();
  }

  public markComplete(): void {
    this.endTimestamp = performance.now();
  }

  public getElapsedTime(): number {
    return this.endTimestamp ? this.endTimestamp - this.startTimestamp : 0;
  }
}
