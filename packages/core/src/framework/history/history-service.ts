import { ElapsedAuguryEvent, ProcessedAuguryEvent } from '../events';
import { LoadedEventEmitter } from '../utils';

export class HistoryService {
  private elapsedEvents: ElapsedAuguryEvent[] = [];

  public addEvent(processedEvent: ProcessedAuguryEvent) {
    const currentPerfStamp = performance.now();

    this.elapsedEvents.push({
      ...processedEvent,
      auguryHandlingCompletionPerformanceStamp: currentPerfStamp,
      auguryDrag: currentPerfStamp - processedEvent.creationAtPerformanceStamp,
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

  public getLastElapsedEvent() {
    return this.elapsedEvents[this.elapsedEvents.length - 1];
  }

  // @todo: startEventId / endEventId arguments
  public emitter() {
    return new LoadedEventEmitter(this.elapsedEvents);
  }
}
