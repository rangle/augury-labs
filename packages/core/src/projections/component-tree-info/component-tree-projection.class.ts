import { AuguryEvent, ComponentTreeEvent } from '../../events';
import { EventProjection } from '../event-projection.class';
import { ComponentTreeInfo } from './component-tree-info.interface';

export class ComponentTreeInfoProjection extends EventProjection<ComponentTreeInfo> {
  private componentTree: Partial<ComponentTreeInfo> = {
    drag: 0,
  };

  public process(event: AuguryEvent): boolean {
    if (event.isInstanceOf(ComponentTreeEvent)) {
      const ctEvent = event as ComponentTreeEvent;

      this.componentTree.drag += event.getAuguryDrag();
      this.componentTree = {
        ...this.componentTree,
        tree: ctEvent.tree,
        startEventId: event.id,
        endEventId: event.id,
        startTimestamp: event.timePeriod.startTimestamp,
        endTimestamp: event.timePeriod.endTimestamp,
      };

      return true;
    }
    return false;
  }

  protected getResult(): ComponentTreeInfo | null {
    return this.componentTree as ComponentTreeInfo;
  }

  protected cleanup() {
    this.componentTree = {
      drag: 0,
    };
  }
}
