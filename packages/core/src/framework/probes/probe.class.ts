import { AuguryEvent, AuguryEventSource } from '../events';
import { EventDispatcher } from './event-dispatcher';

export abstract class Probe {
  private eventDispatcher: EventDispatcher | null = null;

  public setEventDispatcher(eventDispatcher: EventDispatcher) {
    this.eventDispatcher = eventDispatcher;
  }

  public emit(eventName: string, eventPayload?: any) {
    if (!this.eventDispatcher) {
      throw new ReferenceError('Event Emitter has not been initialized.');
    }

    this.eventDispatcher.emit(new AuguryEvent(this.createEventSource(), eventName, eventPayload));
  }

  // @todo: how are we handling / exposing errors during attachment?
  public initialize(ngZone, ngModule) {
    // do nothing
  }

  private createEventSource(): AuguryEventSource {
    return { type: 'probe', name: this.constructor.name };
  }
}
