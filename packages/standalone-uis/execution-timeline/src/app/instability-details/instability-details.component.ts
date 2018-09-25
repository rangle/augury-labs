import { Component, Input } from '@angular/core'

import { round2 } from '../misc-utils'

@Component({
  selector: 'ag-instability-details',
  templateUrl: './instability-details.component.html',
  styleUrls: ['./instability-details.component.css']
})
export class InstabilityDetailsComponent {
  @Input() segment: any

  ngAfterViewInit() {
    console.log(this.segment)
  }

  // template utils
  round = round2
  consoleLog = console.log
}
