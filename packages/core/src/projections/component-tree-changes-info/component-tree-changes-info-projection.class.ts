import { AuguryEvent } from '../../events';
import { mergeComponentTrees } from '../../probes/types/component-tree-node';
import {
  getComponentTypeChangeDetectionFrequency,
  getLifeCycleChecksPerComponentInstance,
} from '../../probes/types/component-tree-node/merged-component-tree-node.functions';
import { AuguryEventProjection } from '../augury-event-projection.class';
import { CollectedComponentTreeChangeInfo } from './collected-component-tree-change-info.interface';
import { ComponentTreeChangesInfo } from './component-tree-changes-info.interface';

export class ComponentTreeChangesInfoProjection extends AuguryEventProjection<
  ComponentTreeChangesInfo
> {
  private result: CollectedComponentTreeChangeInfo = this.createInitialResultValue();

  constructor(private startEventId: number, private endEventId: number) {
    super();
  }

  public process(event: AuguryEvent): boolean {
    if (event.name === 'onStable') {
      if (event.id < this.startEventId) {
        this.result.previousComponentTree = event.payload.componentTree;
      } else if (event.id >= this.endEventId) {
        if (this.result.nextComponentTree.length === 0) {
          this.result.nextComponentTree = event.payload.componentTree;
        } else {
          return true;
        }
      }
    } else if (
      event.name === 'component_lifecycle_hook_invoked' &&
      event.isIdInRange(this.startEventId, this.endEventId)
    ) {
      this.result.lifeCycleMethodCallEvents.push(event);
    }

    return false;
  }

  protected getOutput(): ComponentTreeChangesInfo | null {
    const mergedComponentTree = mergeComponentTrees(
      this.result.previousComponentTree,
      this.result.nextComponentTree,
    );

    const lifeCycleChecksPerComponentInstance = getLifeCycleChecksPerComponentInstance(
      mergedComponentTree,
      this.result.lifeCycleMethodCallEvents,
    );

    return {
      mergedComponentTree,
      lifeCycleChecksPerComponentInstance,
      componentTypeChangeDetectionFrequencies: getComponentTypeChangeDetectionFrequency(
        lifeCycleChecksPerComponentInstance,
      ),
    };
  }

  protected cleanup() {
    this.result = this.createInitialResultValue();
  }

  private createInitialResultValue(): CollectedComponentTreeChangeInfo {
    return {
      previousComponentTree: [],
      nextComponentTree: [],
      lifeCycleMethodCallEvents: [],
    };
  }
}
