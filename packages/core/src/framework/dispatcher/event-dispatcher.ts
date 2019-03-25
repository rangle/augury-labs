import { EnhancerService } from '../enhancers';
import { AuguryEvent, ProcessedAuguryEvent } from '../events';
import { HistoryService } from '../history';
import { ReactionService } from '../reactions';
import { SimpleEventEmitter, SimpleQueue, SyncEventEmitter } from '../utils';
import { DispatcherEvents } from './dispatcher-event';

export class EventDispatcher {
  public emitter: DispatcherEvents = new SyncEventEmitter<AuguryEvent>();

  private queue = new SimpleQueue<AuguryEvent>();
  private releasing = false;

  constructor(
    private enhancers: EnhancerService,
    private reactions: ReactionService,
    private history: HistoryService,
  ) {}

  public dispatch(event: AuguryEvent) {
    this.queue.enqueue(event);

    if (!this.releasing) {
      this.releaseAll();
    }
  }

  public dispatchImmediatelyAndReturn(event: AuguryEvent) {
    if (this.releasing) {
      throw new Error('cannot dispatch immediately, already releasing');
    }

    const processedEvent = this.processEvent(event);

    this.releaseAll();

    return processedEvent;
  }

  public subscribeTo(emitter: SimpleEventEmitter<AuguryEvent>) {
    emitter.subscribe(event => this.dispatch(event));
  }

  private processEvent(event: AuguryEvent): ProcessedAuguryEvent {
    this.releasing = true;

    const processedEvent = this.createProcessedEvent(event);

    this.emitter.emit(processedEvent);
    this.releasing = false;

    this.history.addEvent(processedEvent);

    return processedEvent;
  }

  private releaseAll() {
    while (this.queue.hasItems()) {
      this.processEvent(this.queue.dequeue()!);
    }
  }

  private createProcessedEvent(event: AuguryEvent): ProcessedAuguryEvent {
    return {
      ...this.enhancers.enhanceEvent(event),
      reactionResults: this.reactions.reactTo(event, this),
    };
  }
}
