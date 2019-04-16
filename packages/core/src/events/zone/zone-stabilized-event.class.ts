import { ComponentTreeNode, Probe } from '../../probes';
import { AuguryEvent } from '../augury-event.class';

export class ZoneStabilizedEvent extends AuguryEvent {
  constructor(probe: Probe, public readonly componentTree: ComponentTreeNode[]) {
    super(probe);
  }
}
