import { ElapsedAuguryEvent } from '../events'
import { LoadedEventEmitter } from '../utils'

export class HistoryService {
  private elapsedEvents: ElapsedAuguryEvent[] = []

  public storeElapsedEvent(e: ElapsedAuguryEvent) {
    this.elapsedEvents.push(e)
  }

  public wipeOut() {
    this.elapsedEvents = []
  }

  // @todo: start / end args
  public emitter() {
    const emitter = new LoadedEventEmitter()
    this.elapsedEvents.forEach(e => emitter.add(e))
    return emitter
  }
}
