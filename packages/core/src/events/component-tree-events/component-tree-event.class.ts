import { Node } from '../../probes/component-tree-probe/tree-types';
import { AuguryEvent } from '../augury-event.class';

export class ComponentTreeEvent extends AuguryEvent {
  constructor(public tree: Node) {
    super();
  }
}
