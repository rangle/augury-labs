import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

import { BridgeService } from '../../services/bridge.service';
import { mapComponentTreeToFlameGraphTree } from '../../types/flame-graph-node.functions';
import { FlameGraphNode } from '../../types/flame-graph-node.interface';
import { round2 } from '../../util/misc-utils';

function getComponentChangeDetections(componentInstances) {
  const componentChangeDetections = new Map();
  componentInstances.forEach((checkTime, instance) => {
    if (!componentChangeDetections.has(instance.constructor)) {
      componentChangeDetections.set(instance.constructor, { numChecks: 0 });
    }

    const entry = componentChangeDetections.get(instance.constructor);

    entry.numChecks++;
  });

  return Array.from(componentChangeDetections.entries()).map(([componentType, entry]) => ({
    componentType,
    entry,
  }));
}

@Component({
  selector: 'ag-change-detection-details',
  templateUrl: './change-detection-details.component.html',
  styleUrls: ['./change-detection-details.component.scss'],
})
export class ChangeDetectionDetailsComponent implements OnChanges, OnDestroy {
  @Input()
  public segment: any;

  public componentChangeDetections = null;
  public rootFlameGraphNode: FlameGraphNode = null;
  public runtimeInMilliseconds: number;

  private subscription: any;

  constructor(private bridge: BridgeService) {}

  public ngOnChanges(changes: SimpleChanges): void {
    this.subscription = this.bridge.subscribe(message => {
      if (message.type === 'get_full_cd:response') {
        this.componentChangeDetections = getComponentChangeDetections(
          message.data.checkTimePerInstance,
        );

        this.rootFlameGraphNode = mapComponentTreeToFlameGraphTree(
          message.data.mergedComponentTree,
          message.data.checkTimePerInstance,
        )[0];
      }
    });

    this.bridge.send({
      type: 'get_full_cd',
      cdStartEID: this.segment.startEID,
      cdEndEID: this.segment.endEID,
    });

    this.runtimeInMilliseconds = round2(
      this.segment.finishPerformanceStamp - this.segment.startPerformanceStamp - this.segment.drag,
    );
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
