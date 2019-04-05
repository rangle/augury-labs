import { AuguryEvent, AuguryEventSource } from '../events';
import { EventDispatcher } from './event-dispatcher';

export abstract class Probe {
  private eventDispatcher: EventDispatcher | null = null;

  public initialize(eventDispatcher: EventDispatcher, ngZone, ngModule) {
    this.eventDispatcher = eventDispatcher;

    this.doInitialize(ngZone, ngModule);
  }

  public abstract doInitialize(ngZone, ngModule);

  public emit(eventName: string, eventPayload?: any) {
    if (!this.eventDispatcher) {
      throw new ReferenceError('Event Emitter has not been initialized.');
    }

    this.eventDispatcher.emit(new AuguryEvent(this.createEventSource(), eventName, eventPayload));
  }

  private createEventSource(): AuguryEventSource {
    return { type: 'probe', name: this.constructor.name };
  }
}
