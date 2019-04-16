import { AuguryEvent } from '../../events';
import { ComponentLifecycleMethodInvokedEvent } from '../../events/component-lifecycle-method-events';
import { ZoneStabilizedEvent } from '../../events/zone';
import { mergeComponentTrees } from '../../probes/types/component-tree-node';
import {
  getComponentTypeChangeDetectionFrequency,
  getLifeCycleChecksPerComponentInstance,
} from '../../probes/types/component-tree-node/merged-component-tree-node.functions';
import { EventProjection } from '../event-projection.class';
import { CollectedComponentTreeChangeEventData } from './collected-component-tree-change-event-data.interface';
import { ComponentTreeChangesInfo } from './component-tree-changes-info.interface';

export class ComponentTreeChangesInfoProjection extends EventProjection<ComponentTreeChangesInfo> {
  private result: CollectedComponentTreeChangeEventData = this.createInitialResultValue();

  constructor(private startEventId: number, private endEventId: number) {
    super();
  }

  public process(event: AuguryEvent): boolean {
    if (event instanceof ZoneStabilizedEvent) {
      const zoneStabilizedEvent = event as ZoneStabilizedEvent;

      if (event.id < this.startEventId) {
        this.result.previousComponentTree = zoneStabilizedEvent.componentTree;
      } else if (event.id >= this.endEventId) {
        if (this.result.nextComponentTree.length === 0) {
          this.result.nextComponentTree = zoneStabilizedEvent.componentTree;
        } else {
          return true;
        }
      }
    } else if (
      event instanceof ComponentLifecycleMethodInvokedEvent &&
      event.isIdInRange(this.startEventId, this.endEventId)
    ) {
      this.result.lifeCycleMethodInvokedEvents.push(event);
    }

    return false;
  }

  protected getResult(): ComponentTreeChangesInfo | null {
    const mergedComponentTree = mergeComponentTrees(
      this.result.previousComponentTree,
      this.result.nextComponentTree,
    );

    const lifeCycleChecksPerComponentInstance = getLifeCycleChecksPerComponentInstance(
      mergedComponentTree,
      this.result.lifeCycleMethodInvokedEvents,
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

  private createInitialResultValue(): CollectedComponentTreeChangeEventData {
    return {
      previousComponentTree: [],
      nextComponentTree: [],
      lifeCycleMethodInvokedEvents: [],
    };
  }
}
