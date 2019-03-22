import { Component, ElementRef, Input, NgZone, ViewChild } from '@angular/core';

import { BridgeService } from '../bridge.service';
import { round2 } from '../misc-utils';
import { ComponentTreeUI } from './component-tree-ui';

function createHierarchyDataFromNodeArray(nodes = [] as any[]) {
  return nodes.map(node => ({
    name: node.componentInstance.constructor.name,
    change: node.change,
    children: createHierarchyDataFromNodeArray(node.childNodes),
  }));
}

function createHierarchyDataFromTree(tree = [] as any[]) {
  return createHierarchyDataFromNodeArray(tree)[0];
}

@Component({
  selector: 'ag-instability-details',
  templateUrl: './instability-details.component.html',
  styleUrls: ['./instability-details.component.css'],
})
export class InstabilityDetailsComponent {
  @Input() public segment: any;
  @ViewChild('componentTreeSvg') public componentTreeSvg: ElementRef;

  public didInit = false;
  public componentTreeUI: ComponentTreeUI;

  // template utils
  public round = round2;
  public consoleLog = console.log;

  constructor(private bridge: BridgeService, private zone: NgZone) {}

  public ngOnChanges({ segment }) {
    if (!this.didInit) {
      this.init();
    }

    // @todo: get just component trees
    //        full CD reducer should use before/after component tree reducer
    if (segment && segment.currentValue) {
      this.bridge.send({
        type: 'get_full_cd',
        cdStartEID: segment.currentValue.startEID + 10, // @todo: hack because of above ^
        cdEndEID: segment.currentValue.finishEID - 10,
      });
    }
  }

  public init() {
    this.componentTreeUI = new ComponentTreeUI(this.zone, this.componentTreeSvg.nativeElement);
    // @todo: unsubscribe on unmounts
    this.bridge.subscribe(message => {
      if (message.type === 'get_full_cd:response') {
        console.log(message.data.mergedComponentTree);
        this.componentTreeUI.updateData(
          createHierarchyDataFromTree(message.data.mergedComponentTree), // @todo: mark new/removed nodes
        );
      }
    });
    this.didInit = true;
  }

  public onResizeSVG() {
    this.componentTreeUI.repaint();
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
