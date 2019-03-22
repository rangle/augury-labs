import { Component, Input } from '@angular/core';

import { round2 } from '../misc-utils';

@Component({
  selector: 'ag-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.css'],
})
export class TaskDetailsComponent {
  @Input() public segment: any;

  // template utils
  public round = round2;
  public consoleLog = console.log;

  public formatZoneName(zoneCode) {
    if (zoneCode === 'root') {
      return 'root';
    }
    if (zoneCode === 'ng') {
      return 'ngZone';
    }
  }

  public runtime() {
    return round2(
      this.segment.finishPerformanceStamp - this.segment.startPerformanceStamp - this.segment.drag,
    );
  }

  public drag() {
    return round2(this.segment.drag);
  }
}
