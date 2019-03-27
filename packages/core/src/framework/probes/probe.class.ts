import { createEvent } from '../events';
import { ProbeManager } from './probe-manager.class';

export abstract class Probe {
  private probeManager: ProbeManager | null = null;

  public setProbeManager(probeManager: ProbeManager) {
    this.probeManager = probeManager;
  }

  public emit(eventName: string, eventPayload?: any) {
    if (!this.probeManager) {
      throw new ReferenceError('Probe Event Emitter has not been initialized.');
    }

    this.probeManager.emit(
      createEvent({ type: 'probe', name: this.constructor.name }, eventName, eventPayload),
    );
  }

  // @todo: how are we handling / exposing errors during attachment?
  public beforeNgBootstrap?(preBootstrapTargets: any): void;
  public afterNgBootstrap?(ngModuleRef: any): void;
}
