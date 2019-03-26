import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { round2 } from '../../util/misc-utils';

@Component({
  selector: 'ag-task-details',
  templateUrl: './task-details.component.html',
})
export class TaskDetailsComponent implements OnChanges {
  @Input()
  public segment: any;

  public runtimeInMilliseconds: number;
  public totalRuntimeInMilliseconds: number;
  public startTimeInMilliseconds: number;
  public targetType: string;

  public ngOnChanges(changes: SimpleChanges): void {
    const totalTime = this.segment.finishPerformanceStamp - this.segment.startPerformanceStamp;

    this.runtimeInMilliseconds = round2(totalTime - this.segment.drag);
    this.totalRuntimeInMilliseconds = round2(totalTime);
    this.startTimeInMilliseconds = round2(this.segment.startPerformanceStamp);
    this.targetType = this.segment.task.target && this.segment.task.target.constructor.name;
  }
}
