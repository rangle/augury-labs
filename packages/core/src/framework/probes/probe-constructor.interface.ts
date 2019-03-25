import { AuguryEvent } from '../events';
import { SyncEventEmitter } from '../utils';
import { Probe } from './probe';

export interface ProbeConstructor {
  new (probeEvents: SyncEventEmitter<AuguryEvent>): Probe;
}
