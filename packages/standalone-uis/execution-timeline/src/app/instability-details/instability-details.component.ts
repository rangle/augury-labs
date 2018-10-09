import { Component, Input, ViewChild, ElementRef } from '@angular/core'

import { BridgeService } from '../bridge.service'
import { ComponentTreeUI } from './component-tree-ui'
import { round2 } from '../misc-utils'

function createHierarchyDataFromNodeArray(nodes = <any[]>[]) {
  return nodes.map(node => ({
    name: node.componentInstance.constructor.name,
    change: node.change,
    children: createHierarchyDataFromNodeArray(node.childNodes)
  }))
}

function createHierarchyDataFromTree(tree = <any[]>[]) {
  return createHierarchyDataFromNodeArray(tree)[0]
}

@Component({
  selector: 'ag-instability-details',
  templateUrl: './instability-details.component.html',
  styleUrls: ['./instability-details.component.css']
})
export class InstabilityDetailsComponent {
  @Input() segment: any
  @ViewChild('componentTreeSvg') componentTreeSvg: ElementRef

  didInit = false
  componentTreeUI: ComponentTreeUI

  // template utils
  round = round2
  consoleLog = console.log

  constructor(
    private bridge: BridgeService
  ) { }

  ngOnChanges({ segment }) {
    if (!this.didInit)
      this.init()

    // @todo: get just component trees
    //        full CD reducer should use before/after component tree reducer
    if (segment && segment.currentValue)
      this.bridge.send({
        type: 'get_full_cd',
        cdStartEID: segment.currentValue.startEID + 10, // @todo: hack because of above ^
        cdEndEID: segment.currentValue.finishEID - 10
      })

  }

  init() {
    this.componentTreeUI = new ComponentTreeUI(this.componentTreeSvg.nativeElement)
    // @todo: unsubscribe on unmounts
    this.bridge.subscribe(message => {
      if (message.type === 'get_full_cd:response') {
        console.log(message.data.mergedComponentTree)
        this.componentTreeUI.updateData(
          createHierarchyDataFromTree(message.data.mergedComponentTree) // @todo: mark new/removed nodes
        )
      }
    })
    this.didInit = true
  }

  onResizeSVG() {
    this.componentTreeUI.repaint()
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
