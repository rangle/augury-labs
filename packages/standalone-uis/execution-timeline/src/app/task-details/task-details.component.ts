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

  // template utils
  round = round2
  consoleLog = console.log
}
