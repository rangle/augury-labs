import { AuguryEvent } from '../events/augury-event';
import { SyncEventEmitter } from '../utils';

export type DispatcherEvents = SyncEventEmitter<AuguryEvent>;
