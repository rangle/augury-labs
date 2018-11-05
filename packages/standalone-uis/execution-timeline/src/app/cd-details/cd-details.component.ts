import { Component, ElementRef, Input, ViewChild, NgZone } from '@angular/core'

import { BridgeService } from '../bridge.service';
import { round2 } from '../misc-utils'
import { SunburstUI } from './sunburst-ui'

function createSunburstFromCDTree(tree = [] as any[], checkTimePerInstance = new Map()) {
  return tree.map(node => ({
    name: node.componentInstance.constructor.name,
    size: checkTimePerInstance.get(node.componentInstance),
    children: createSunburstFromCDTree(node.childNodes, checkTimePerInstance)
  }))
}

function aggregatesByComponentType(checkTimePerInstance) {
  const abct = new Map()
  checkTimePerInstance.forEach((checkTime, instance) => {

    if (!abct.has(instance.constructor)) {
      abct.set(instance.constructor, { numChecks: 0 })
    }

    const entry = abct.get(instance.constructor)

    entry.numChecks++

  })

  return Array.from(abct.entries())
    .map(([componentType, entry]) => ({ componentType, entry }))
}

@Component({
  selector: 'ag-cd-details',
  templateUrl: './cd-details.component.html',
  styleUrls: ['./cd-details.component.css']
})
export class ChangeDetectionDetailsComponent {
  @Input() public segment: any
  @ViewChild('sunburst') public sunburstSVG: ElementRef

  // template utils
  public round = round2
  public consoleLog = console.log

  public aggregatesByComponentType

  private sunburstUI: SunburstUI
  private didInit = false

  constructor(
    private zone: NgZone,
    private bridge: BridgeService
  ) { }

  public ngOnChanges({ segment }) {
    if (!this.didInit) {// @todo: unsubscribe on unmount
      this.init()
    }

    if (segment && segment.currentValue) {
      this.bridge.send({
        type: 'get_full_cd',
        cdStartEID: segment.currentValue.startEID,
        cdEndEID: segment.currentValue.endEID
      })
    }
  }

  public init() {
    this.sunburstUI = new SunburstUI(this.zone, this.sunburstSVG.nativeElement)
    this.bridge.subscribe(message => {
      if (message.type === 'get_full_cd:response') {

        this.aggregatesByComponentType =
          aggregatesByComponentType(
            message.data.checkTimePerInstance
          )

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

  public onResizeSVG() {
    this.sunburstUI.repaint()
  }

  public runtime() {
    return round2(
      this.segment.finishPerformanceStamp
      - this.segment.startPerformanceStamp
      - this.segment.drag
    )
  }

  public drag() {
    return round2(this.segment.drag)
  }
}
