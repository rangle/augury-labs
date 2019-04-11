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
      (results, event, index) => {
        if (
          this.eventFallsWithinRange(event, startEventId, endEventId) &&
          this.shouldCollectResult(event, projection, index)
        ) {
          const result = projection.collectResult();

          return result ? results.concat([result]) : results;
        }

        return results;
      },
      [] as Output[],
    );
  }

  private shouldCollectResult<Output>(
    event: AuguryEvent,
    projection: AuguryEventProjection<Output>,
    currentIndex: number,
  ) {
    return currentIndex === this.elapsedEvents.length - 1 || projection.process(event);
  }

  private eventFallsWithinRange(
    event: AuguryEvent,
    startEventId: number,
    endEventId: number,
  ): boolean {
    return (startEventId === endEventId) === null || event.isIdInRange(startEventId, endEventId);
  }
}
