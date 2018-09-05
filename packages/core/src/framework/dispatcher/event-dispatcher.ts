import { EnhancerService } from '../enhancers'
import { AuguryEvent, ProcessedAuguryEvent } from '../events'
import { ReactionService } from '../reactions'
import { merge, SimpleEventEmitter, SimpleQueue, SyncEventEmitter } from '../utils'
import { DispatcherEvents } from './dispatcher-event'

export class EventDispatcher {
  public emitter: DispatcherEvents = new SyncEventEmitter<AuguryEvent>()

  private queue = new SimpleQueue<AuguryEvent>()
  private releasing = false

  constructor(private enhancers: EnhancerService, private reactions: ReactionService) {}

  public dispatch(event: AuguryEvent) {
    this.queue.enqueue(event)
    if (!this.releasing) {
      this.releaseAll()
    }
  }

  public dispatchImmediatelyAndReturn(event: AuguryEvent) {
    if (this.releasing) {
      throw new Error('cannot dispatch immediately, already releasing')
    }

    const processedEvent = this.processEvent(event)

    this.releaseAll()

    return processedEvent
  }

  public subscribeTo(emitter: SimpleEventEmitter<AuguryEvent>) {
    emitter.subscribe(event => this.dispatch(event))
  }

  private processEvent(event: AuguryEvent): ProcessedAuguryEvent {
    this.releasing = true

    const enhancedEvent = this.enhancers.enhanceEvent(event)
    const reactionResults = this.reactions.reactTo(event, this.emitter, e => this.dispatch(e))

    const processedEvent: ProcessedAuguryEvent = merge(enhancedEvent, { reactionResults })

    this.emitter.emit(processedEvent)

    this.releasing = false
    return processedEvent
  }

  private releaseAll() {
    while (this.queue.hasItems()) {
      this.processEvent(this.queue.dequeue()!)
    }
  }
}
