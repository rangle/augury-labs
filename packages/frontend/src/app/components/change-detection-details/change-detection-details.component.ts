import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';

import {
  ChangeDetectionInfo,
  ComponentTreeChangesInfo,
  ComponentTypeChangeDetectionFrequency,
  Subscription,
} from '@augury/core';
import { BridgeService } from '../../services/bridge.service';
import { mapComponentTreeToFlameGraphTree } from '../../types/flame-graph-node/flame-graph-node.functions';
import { FlameGraphNode } from '../../types/flame-graph-node/flame-graph-node.interface';
import { round2 } from '../../util/misc-utils';

@Component({
  selector: 'ag-change-detection-details',
  templateUrl: './change-detection-details.component.html',
  styleUrls: ['./change-detection-details.component.scss'],
})
export class ChangeDetectionDetailsComponent implements OnChanges, OnDestroy {
  @Input()
  public changeDetectionInfo: ChangeDetectionInfo;

  public componentTypeChangeDetectionFrequencies: ComponentTypeChangeDetectionFrequency[] = null;
  public rootFlameGraphNode: FlameGraphNode = null;
  public runtimeInMilliseconds: number;

  private subscription: Subscription = null;

  constructor(private bridge: BridgeService) {}

  public ngOnChanges(changes: SimpleChanges): void {
    if (!changes.changeDetectionInfo.firstChange) {
      this.subscription.unsubscribe();
    }

    this.subscription = this.bridge.subscribe(message => {
      if (message.type === 'component-tree-changes:response') {
        const componentTreeChangesInfo = message.payload as ComponentTreeChangesInfo;

        this.componentTypeChangeDetectionFrequencies =
          componentTreeChangesInfo.componentTypeChangeDetectionFrequencies;

        this.rootFlameGraphNode = mapComponentTreeToFlameGraphTree(
          componentTreeChangesInfo.mergedComponentTree,
          componentTreeChangesInfo.lifeCycleChecksPerComponentInstance,
        )[0];
      }
    });

    this.bridge.send({
      type: 'component-tree-changes',
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
