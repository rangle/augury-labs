import { SyncEventEmitter } from '../event-emitters';
import { AuguryEvent, createEvent } from '../events';

export abstract class Probe {
  private eventEmitter: SyncEventEmitter<AuguryEvent> | null = null;

  public initialize(eventEmitter: SyncEventEmitter<AuguryEvent>) {
    this.eventEmitter = eventEmitter;
  }

  public emit(eventName: string, eventPayload?: any) {
    if (!this.eventEmitter) {
      throw new ReferenceError('Probe Event Emitter has not been initialized.');
    }

    this.eventEmitter.emit(
      createEvent({ type: 'probe', name: this.constructor.name }, eventName, eventPayload),
    );
  }

  // @todo: how are we handling / exposing errors during attachment?
  public beforeNgBootstrap?(preBootstrapTargets: any): void;
  public afterNgBootstrap?(ngModuleRef: any): void;
}
