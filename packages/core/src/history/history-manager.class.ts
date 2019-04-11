import { AuguryEvent } from '../events';
import { AuguryEventProjection } from '../projections';

export class HistoryManager {
  public elapsedEvents: AuguryEvent[] = [];

  public addEvent(event: AuguryEvent) {
    this.elapsedEvents.push(event);
  }

  public clear() {
    this.elapsedEvents = [];
  }

  public project<Output>(
    projection: AuguryEventProjection<Output>,
    startEventId: number = null,
    endEventId: number = null,
  ): Output[] {
    return this.elapsedEvents.reduce(
      (results, event) => {
        if (
          (projection.process(event) && (startEventId === endEventId) === null) ||
          (event.id >= startEventId && event.id <= endEventId)
        ) {
          const result = projection.finish();

          return result ? results.concat([result]) : results;
        }

        return results;
      },
      [] as Output[],
    );
  }

  public scan(startEventId: number, endEventId: number) {
    return this.elapsedEvents.reduce(
      (result: any, event) => {
        if (event.name === 'onStable') {
          if (event.id < startEventId) {
            result.lastComponentTree = event.payload.componentTree;
          } else if (event.id >= endEventId && result.nextComponentTree.length === 0) {
            result.nextComponentTree = event.payload.componentTree;
          }
        } else if (
          event.name === 'component_lifecycle_hook_invoked' &&
          event.isIdInRange(startEventId, endEventId)
        ) {
          result.lifecycleHooksTriggered.push(event);
        }

        return result;
      },
      {
        lastComponentTree: [],
        nextComponentTree: [],
        lifecycleHooksTriggered: [],
      },
    );
  }

  public getTotalAuguryDrag(startEventId: number, endEventId: number): number {
    return this.elapsedEvents.reduce(
      (totalDrag, elapsedEvent) =>
        totalDrag +
        (elapsedEvent.isIdInRange(startEventId, endEventId) ? elapsedEvent.getAuguryDrag() : 0),
      0,
    );
  }

  public getLastElapsedEvent(): AuguryEvent {
    return this.elapsedEvents[this.elapsedEvents.length - 1];
  }
}
