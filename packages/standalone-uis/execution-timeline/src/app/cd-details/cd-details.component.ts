import { Component, Input, ViewChild, ElementRef } from '@angular/core'

import { round2 } from '../misc-utils'
import { SunburstUI } from './sunburst-ui'
import { BridgeService } from '../bridge.service';

function createSunburstFromCDTree(tree = <any[]>[], checkTimePerInstance = new Map()) {
  return tree.map(node => ({
    name: node.componentInstance.constructor.name,
    size: checkTimePerInstance.get(node.componentInstance),
    children: createSunburstFromCDTree(node.childNodes, checkTimePerInstance)
  }))
}

@Component({
  selector: 'ag-cd-details',
  templateUrl: './cd-details.component.html',
  styleUrls: ['./cd-details.component.css']
})
export class ChangeDetectionDetailsComponent {
  @Input() segment: any
  @ViewChild('sunburst') sunburstSVG: ElementRef

  private sunburstUI: SunburstUI
  private didInit = false

  // template utils
  round = round2
  consoleLog = console.log

  constructor(
    private bridge: BridgeService
  ) { }

  ngOnChanges({ segment }) {
    if (!this.didInit)// @todo: unsubscribe on unmount
      this.init()

    if (segment && segment.currentValue)
      this.bridge.send({
        type: 'get_full_cd',
        cdStartEID: segment.currentValue.startEID,
        cdEndEID: segment.currentValue.endEID
      })
  }

  init() {
    this.sunburstUI = new SunburstUI(this.sunburstSVG.nativeElement)
    this.bridge.subscribe(message => {
      if (message.type === 'get_full_cd:response') {
        this.sunburstUI.updateData(
          createSunburstFromCDTree(
            message.data.mergedComponentTree,
            message.data.checkTimePerInstance
          )
        )
      }
    })
    this.didInit = true
  }

  onResizeSVG() {
    this.sunburstUI.repaint()
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
}
