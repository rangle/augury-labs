import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { TaskInfo } from '@augury/core';
import { round2 } from '../../util/misc-utils';

@Component({
  selector: 'ag-task-details',
  templateUrl: './task-details.component.html',
})
export class TaskDetailsComponent implements OnChanges {
  @Input()
  public taskInfo: TaskInfo;

  public runtimeInMilliseconds: number;
  public totalRuntimeInMilliseconds: number;
  public startTimeInMilliseconds: number;
  public targetType: string;

  public ngOnChanges(changes: SimpleChanges): void {
    const totalTime = this.taskInfo.endTimestamp - this.taskInfo.startTimestamp;

    this.runtimeInMilliseconds = round2(totalTime - this.taskInfo.drag);
    this.totalRuntimeInMilliseconds = round2(totalTime);
    this.startTimeInMilliseconds = round2(this.taskInfo.startTimestamp);
    this.targetType = this.taskInfo.task.target && this.taskInfo.task.target.constructor.name;
  }
}
