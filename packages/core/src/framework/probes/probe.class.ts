import { AuguryEvent, AuguryEventSource } from '../events';
import { ProbeManager } from './probe-manager';

export abstract class Probe {
  private probeManager: ProbeManager | null = null;

  public initialize(probeManager: ProbeManager, ngZone, ngModule) {
    this.probeManager = probeManager;

    this.doInitialize(ngZone, ngModule);
  }

  public abstract doInitialize(ngZone, ngModule);

  public emit(eventName: string, eventPayload?: any) {
    if (!this.probeManager) {
      throw new ReferenceError('Event Emitter has not been initialized.');
    }

    this.probeManager.emit(new AuguryEvent(this.createEventSource(), eventName, eventPayload));
  }

  private createEventSource(): AuguryEventSource {
    return { type: 'probe', name: this.constructor.name };
  }
}
