import { Component, Input } from '@angular/core'

import { round2 } from '../misc-utils'

@Component({
  selector: 'ag-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.css']
})
export class TaskDetailsComponent {
  @Input() segment: any

  ngAfterViewInit() { }

  formatZoneName(zoneCode) {
    if (zoneCode === 'root') return 'root'
    if (zoneCode === 'ng') return 'ngZone'
  }

  runtime() {
    return round2(
      this.segment.finishPerformanceStamp
      - this.segment.startPerformanceStamp
      - this.segment.drag
    )
  }

  drag() {
    return round2(this.segment.drag)
  }

  // template utils
  round = round2
  consoleLog = console.log
}
