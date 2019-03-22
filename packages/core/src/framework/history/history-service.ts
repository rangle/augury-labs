import { ElapsedAuguryEvent } from '../events';
import { LoadedEventEmitter } from '../utils';

export class HistoryService {
  private elapsedEvents: ElapsedAuguryEvent[] = [];

  public storeElapsedEvent(e: ElapsedAuguryEvent) {
    this.elapsedEvents.push(e);
  }

  public wipeOut() {
    this.elapsedEvents = [];
  }

  // @todo: ensure startEID and endEID are valid
  public getTotalAuguryDrag(startEID, endEID) {
    return this.elapsedEvents.reduce(
      (totalDrag, elapsedEvent) =>
        startEID <= elapsedEvent.id && endEID >= elapsedEvent.id
          ? totalDrag + elapsedEvent.auguryDrag
          : totalDrag,
      0,
    );
  }

  public getLastElapsedEvent() {
    return this.elapsedEvents[this.elapsedEvents.length - 1];
  }

  // @todo: startEID / endEID args
  public emitter() {
    return new LoadedEventEmitter(this.elapsedEvents);
  }
}
