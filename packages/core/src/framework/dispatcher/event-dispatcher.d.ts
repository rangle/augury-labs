import { AuguryEvent, ProcessedAuguryEvent } from '../events'
import { SimpleEventEmitter } from '../utils'
import { EnhancerService } from '../enhancers'
import { ReactionService } from '../reactions'
import { DispatcherEvents } from './dispatcher-event'
export declare class EventDispatcher {
  emitter: DispatcherEvents
  private enhancers
  private reactions
  private queue
  private releasing
  private processEvent
  private releaseAll
  constructor(enhancers: EnhancerService, reactions: ReactionService)
  dispatch(event: AuguryEvent): void
  dispatchImmediatelyAndReturn(event: AuguryEvent): ProcessedAuguryEvent
  subscribeTo(emitter: SimpleEventEmitter<AuguryEvent>): void
}
