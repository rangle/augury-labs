import { Component, ElementRef, Input, NgZone, ViewChild } from '@angular/core';

import { FlameGraphData } from 'app/flame-graph';
import { BridgeService } from '../bridge.service';
import { round2 } from '../misc-utils';

function flameGraphDataFromCDTree(tree = [] as any[], checkTimePerInstance = new Map()) {
  return tree.map(node => ({
    name: node.componentInstance.constructor.name,
    value: checkTimePerInstance.get(node.componentInstance),
    children: flameGraphDataFromCDTree(node.childNodes, checkTimePerInstance),
  }));
}

function aggregatesByComponentType(checkTimePerInstance) {
  const abct = new Map();
  checkTimePerInstance.forEach((checkTime, instance) => {
    if (!abct.has(instance.constructor)) {
      abct.set(instance.constructor, { numChecks: 0 });
    }

    const entry = abct.get(instance.constructor);

    entry.numChecks++;
  });

  return Array.from(abct.entries()).map(([componentType, entry]) => ({ componentType, entry }));
}

@Component({
  selector: 'ag-cd-details',
  templateUrl: './cd-details.component.html',
  styleUrls: ['./cd-details.component.css'],
})
export class ChangeDetectionDetailsComponent {
  @Input() public segment: any;
  @ViewChild('chartContainer') public chartContainerElement: ElementRef;

  public round = round2;

  public aggregatesByComponentType;

  public treeData: FlameGraphData;

  private didInit = false;

  constructor(private bridge: BridgeService, private ngZone: NgZone) {}

  public ngOnChanges({ segment }) {
    if (!this.didInit) {
      // @todo: unsubscribe on unmount
      this.init();
    }

    if (segment && segment.currentValue) {
      this.bridge.send({
        type: 'get_full_cd',
        cdStartEID: segment.currentValue.startEID,
        cdEndEID: segment.currentValue.endEID,
      });
    }
  }

  public init() {
    this.bridge.subscribe(message => {
      if (message.type === 'get_full_cd:response') {
        this.aggregatesByComponentType = aggregatesByComponentType(
          message.data.checkTimePerInstance,
        );

        this.treeData = flameGraphDataFromCDTree(
          message.data.mergedComponentTree,
          message.data.checkTimePerInstance,
        )[0];
      }
    });
    this.didInit = true;
  }
  public runtime() {
    return round2(
      this.segment.finishPerformanceStamp - this.segment.startPerformanceStamp - this.segment.drag,
    );
  }
}
