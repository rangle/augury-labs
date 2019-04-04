import { AuguryEvent, AuguryEventSource } from '../events';
import { EventDispatcher } from './event-dispatcher';

export abstract class Probe {
  private probeManager: EventDispatcher | null = null;

  public setProbeManager(probeManager: EventDispatcher) {
    this.probeManager = probeManager;
  }

  public emit(eventName: string, eventPayload?: any) {
    if (!this.probeManager) {
      throw new ReferenceError('Probe Event Emitter has not been initialized.');
    }

    this.probeManager.emit(new AuguryEvent(this.createEventSource(), eventName, eventPayload));
  }

  // @todo: how are we handling / exposing errors during attachment?
  public initialize(ngZone, ngModule) {
    // do nothing
  }

  private createEventSource(): AuguryEventSource {
    return { type: 'probe', name: this.constructor.name };
  }
}
