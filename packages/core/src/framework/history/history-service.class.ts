import { LoadedEventEmitter, Subscribable } from '../event-emitters';
import { ElapsedAuguryEvent, ProcessedAuguryEvent } from '../events';

export class HistoryService {
  private elapsedEvents: ElapsedAuguryEvent[] = [];

  public addEvent(processedEvent: ProcessedAuguryEvent) {
    const currentPerformanceStamp = performance.now();

    this.elapsedEvents.push({
      ...processedEvent,
      auguryHandlingCompletionPerformanceStamp: currentPerformanceStamp,
      auguryDrag: currentPerformanceStamp - processedEvent.creationAtPerformanceStamp,
    });
  }

  public wipeOut() {
    this.elapsedEvents = [];
  }

  // @todo: ensure startEventId and endEventId are valid
  public getTotalAuguryDrag(startEventId: number, endEventId: number) {
    return this.elapsedEvents.reduce(
      (totalDrag, elapsedEvent) =>
        startEventId <= elapsedEvent.id && endEventId >= elapsedEvent.id
          ? totalDrag + elapsedEvent.auguryDrag
          : totalDrag,
      0,
    );
  }

  public getLastElapsedEvent(): ElapsedAuguryEvent {
    return this.elapsedEvents[this.elapsedEvents.length - 1];
  }

  // @todo: startEventId / endEventId arguments
  public createSubscribable(): Subscribable<ElapsedAuguryEvent> {
    return new LoadedEventEmitter<ElapsedAuguryEvent>(this.elapsedEvents);
  }
}
