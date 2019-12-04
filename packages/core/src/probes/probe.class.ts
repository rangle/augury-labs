import { AuguryEvent } from '../events';
import { TimePeriod } from '../events/time-period.class';
import { ProbeManager } from './probe-manager';

export abstract class Probe {
  private probeManager: ProbeManager | null = null;

  public initialize(probeManager: ProbeManager, ngZone, ngModule) {
    this.probeManager = probeManager;

    this.doInitialize(ngZone, ngModule);
  }

  public abstract doInitialize(ngZone, ngModule);

  public emit(createEvent: () => AuguryEvent) {
    if (!this.probeManager) {
      throw new ReferenceError('Event Emitter has not been initialized.');
    }

    const timePeriod = new TimePeriod();
    const event = createEvent();

    event.timePeriod = timePeriod;

    this.probeManager.emit(event);
  }
}
