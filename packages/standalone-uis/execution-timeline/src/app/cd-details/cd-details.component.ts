import { Component, Input } from '@angular/core'

import { round2 } from '../misc-utils'

@Component({
  selector: 'ag-cd-details',
  templateUrl: './cd-details.component.html',
  styleUrls: ['./cd-details.component.css']
})
export class ChangeDetectionDetailsComponent {
  @Input() segment: any

  // template utils
  round = round2
  consoleLog = console.log
}
