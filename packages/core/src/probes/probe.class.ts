import { AuguryEvent } from '../events';
import { DragPeriod } from '../events/drag-period.class';
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

    const dragPeriod = new DragPeriod();
    const event = createEvent();

    event.dragPeriod = dragPeriod;

    this.probeManager.emit(event);
  }
}
