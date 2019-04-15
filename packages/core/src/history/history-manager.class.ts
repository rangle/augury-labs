import { AuguryEvent } from '../events';
import { EventProjection } from '../projections';

export class HistoryManager {
  public elapsedEvents: AuguryEvent[] = [];

  public addEvent(event: AuguryEvent) {
    this.elapsedEvents.push(event);
  }

  public clear() {
    this.elapsedEvents = [];
  }

  public projectResults<Result>(
    projection: EventProjection<Result>,
    maxResults: number = null,
    startEventId: number = null,
    endEventId: number = null,
  ): Result[] {
    const results: Result[] = [];

    for (let index = 0; index < this.elapsedEvents.length; index++) {
      if (maxResults !== null && results.length >= maxResults) {
        break;
      }

      if (
        this.eventFallsWithinRange(this.elapsedEvents[index], startEventId, endEventId) &&
        this.shouldCollectResult(this.elapsedEvents[index], projection, index)
      ) {
        const result = projection.collectResult();

        if (result) {
          results.push(result);
        }
      }
    }

    return results;
  }

  private shouldCollectResult<Result>(
    event: AuguryEvent,
    projection: EventProjection<Result>,
    currentIndex: number,
  ) {
    return currentIndex === this.elapsedEvents.length - 1 || projection.process(event);
  }

  private eventFallsWithinRange(
    event: AuguryEvent,
    startEventId: number,
    endEventId: number,
  ): boolean {
    return (
      (startEventId === null && endEventId === null) || event.isIdInRange(startEventId, endEventId)
    );
  }
}
