import {
  Component,
  ElementRef,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

import { BridgeService } from '../../services/bridge.service';
import { mapTreeToFlameGraphNodes } from '../../types/flame-graph-node.functions';
import { FlameGraphNode } from '../../types/flame-graph-node.interface';
import { round2 } from '../../util/misc-utils';

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
  selector: 'ag-change-detection-details',
  templateUrl: './change-detection-details.component.html',
  styleUrls: ['./change-detection-details.component.scss'],
})
export class ChangeDetectionDetailsComponent implements OnChanges, OnInit, OnDestroy {
  @Input() public segment: any;

  @ViewChild('chartContainer')
  public chartContainerElement: ElementRef;

  public aggregatesByComponentType = null;
  public treeData: FlameGraphNode = null;
  public runtimeInMilliseconds: number;

  private subscription: any;

  constructor(private bridge: BridgeService, private ngZone: NgZone) {}

  public ngOnChanges(changes: SimpleChanges): void {
    if (this.segment) {
      this.runtimeInMilliseconds = round2(
        this.segment.finishPerformanceStamp -
          this.segment.startPerformanceStamp -
          this.segment.drag,
      );

      this.bridge.send({
        type: 'get_full_cd',
        cdStartEID: this.segment.startEID,
        cdEndEID: this.segment.endEID,
      });
    }
  }

  public ngOnInit(): void {
    this.subscription = this.bridge.subscribe(message => {
      if (message.type === 'get_full_cd:response') {
        this.aggregatesByComponentType = aggregatesByComponentType(
          message.data.checkTimePerInstance,
        );

        this.treeData = mapTreeToFlameGraphNodes(
          message.data.mergedComponentTree,
          message.data.checkTimePerInstance,
        )[0];
      }
    });
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
