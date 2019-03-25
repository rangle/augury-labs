import { AuguryEvent, createEvent } from '../events';
import { SyncEventEmitter } from '../utils';

export abstract class Probe {
  constructor(private probeEvents: SyncEventEmitter<AuguryEvent>) {}

  public emit(eventName: string, eventPayload?: any) {
    this.probeEvents.emit(
      createEvent({ type: 'probe', name: this.constructor.name }, eventName, eventPayload),
    );
  }

  // @todo: how are we handling / exposing errors during attachment?
  public beforeNgBootstrap?(preBootstrapTargets: any): void;
  public afterNgBootstrap?(ngModuleRef: any): void;
}
