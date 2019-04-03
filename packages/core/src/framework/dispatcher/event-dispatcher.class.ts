import { EnhancerService } from '../enhancers';
import { SyncEventEmitter } from '../event-emitters';
import { AuguryEvent, ProcessedAuguryEvent } from '../events';
import { HistoryManager } from '../history';
import { ProbeManager } from '../probes';
import { ReactionService } from '../reactions';
import { SimpleQueue } from '../utils';

export class EventDispatcher {
  public emitter = new SyncEventEmitter<AuguryEvent>();

  private queue = new SimpleQueue<AuguryEvent>();
  private releasing = false;

  constructor(
    private probeManager: ProbeManager,
    private enhancerService: EnhancerService,
    private reactionService: ReactionService,
    private historyService: HistoryManager,
  ) {
    probeManager.subscribe(event => this.dispatch(event));
  }

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

  private processEvent(event: AuguryEvent): ProcessedAuguryEvent {
    this.releasing = true;

    const processedEvent = this.createProcessedEvent(event);

    this.emitter.emit(processedEvent);
    this.releasing = false;

    this.historyService.addEvent(processedEvent);

    return processedEvent;
  }

  private releaseAll() {
    while (this.queue.hasItems()) {
      this.processEvent(this.queue.dequeue());
    }
  }

  private createProcessedEvent(event: AuguryEvent): ProcessedAuguryEvent {
    return {
      ...this.enhancerService.enhanceEvent(event),
      reactionResults: this.reactionService.reactTo(event, this),
    };
  }
}
