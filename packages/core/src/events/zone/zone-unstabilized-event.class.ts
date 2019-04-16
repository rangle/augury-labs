import { Probe } from '../../probes';
import { AuguryEvent } from '../augury-event.class';

export class ZoneUnstabilizedEvent extends AuguryEvent {
  constructor(probe: Probe) {
    super(probe);
  }
}
