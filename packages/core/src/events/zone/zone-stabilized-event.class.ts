import { ComponentTreeNode } from '../../probes';
import { AuguryEvent } from '../augury-event.class';

export class ZoneStabilizedEvent extends AuguryEvent {
  constructor(public readonly componentTree: ComponentTreeNode[]) {
    super();
  }
}
