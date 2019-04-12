import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';

import {
  ChangeDetectionInfo,
  ChangeDetectionMergedComponentTree,
  Subscription,
} from '@augury/core';
import { BridgeService } from '../../services/bridge.service';
import { mapComponentTreeToFlameGraphTree } from '../../types/flame-graph-node/flame-graph-node.functions';
import { FlameGraphNode } from '../../types/flame-graph-node/flame-graph-node.interface';
import { round2 } from '../../util/misc-utils';

function getComponentChangeDetections(componentInstances): any[] {
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
  public changeDetectionInfo: ChangeDetectionInfo;

  public componentChangeDetections: any[] = null;
  public rootFlameGraphNode: FlameGraphNode = null;
  public runtimeInMilliseconds: number;

  private subscription: Subscription = null;

  constructor(private bridge: BridgeService) {}

  public ngOnChanges(changes: SimpleChanges): void {
    if (!changes.changeDetectionInfo.firstChange) {
      this.subscription.unsubscribe();
    }

    this.subscription = this.bridge.subscribe(message => {
      if (message.type === 'query-change-detection-tree:response') {
        const changeDetectionMergedComponentTree = message.payload as ChangeDetectionMergedComponentTree;

        this.componentChangeDetections = getComponentChangeDetections(
          changeDetectionMergedComponentTree.checkTimePerInstance,
        );

        this.rootFlameGraphNode = mapComponentTreeToFlameGraphTree(
          changeDetectionMergedComponentTree.mergedComponentTree,
          changeDetectionMergedComponentTree.checkTimePerInstance,
        )[0];
      }
    });

    this.bridge.send({
      type: 'query-change-detection-tree',
      startEventId: this.changeDetectionInfo.startEventId,
      endEventId: this.changeDetectionInfo.endEventId,
    });

    this.runtimeInMilliseconds = round2(
      this.changeDetectionInfo.endTimestamp -
        this.changeDetectionInfo.startTimestamp -
        this.changeDetectionInfo.drag,
    );
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
