import { Node } from '../../probes/component-tree-probe/tree-types';

export interface ComponentTreeInfo {
  startEventId: number;
  startTimestamp: number;
  endEventId: number;
  endTimestamp: number;
  tree: Node;
  drag: number;
}
