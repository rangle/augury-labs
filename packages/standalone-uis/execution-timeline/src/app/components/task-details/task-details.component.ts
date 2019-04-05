import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { LastElapsedTask } from '@augury/core';
import { round2 } from '../../util/misc-utils';

@Component({
  selector: 'ag-task-details',
  templateUrl: './task-details.component.html',
})
export class TaskDetailsComponent implements OnChanges {
  @Input()
  public lastElapsedTask: LastElapsedTask;

  public runtimeInMilliseconds: number;
  public totalRuntimeInMilliseconds: number;
  public startTimeInMilliseconds: number;
  public targetType: string;

  public ngOnChanges(changes: SimpleChanges): void {
    const totalTime = this.lastElapsedTask.endTimestamp - this.lastElapsedTask.startTimestamp;

    this.runtimeInMilliseconds = round2(totalTime - this.lastElapsedTask.drag);
    this.totalRuntimeInMilliseconds = round2(totalTime);
    this.startTimeInMilliseconds = round2(this.lastElapsedTask.startTimestamp);
    this.targetType =
      this.lastElapsedTask.task.target && this.lastElapsedTask.task.target.constructor.name;
  }
}
