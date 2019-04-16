import { Probe } from '../../probes';
import { AuguryEvent } from '../augury-event.class';

export abstract class TaskEventSupport extends AuguryEvent {
  protected constructor(probe: Probe, public readonly task: any) {
    super(probe);
  }
}
