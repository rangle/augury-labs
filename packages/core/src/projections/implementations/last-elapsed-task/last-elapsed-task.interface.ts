export interface LastElapsedTask {
  zone: string;
  task: any; // ZoneTask
  flamegraph: any[];
  startEventId: number;
  startTimestamp: number;
  endTimestamp: number;
  drag: number;
}
