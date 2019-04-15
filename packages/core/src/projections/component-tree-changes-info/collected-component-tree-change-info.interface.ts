import { AuguryEvent } from '../../events';
import { ComponentTreeNode } from '../../probes/types/component-tree-node';

export interface CollectedComponentTreeChangeInfo {
  previousComponentTree: ComponentTreeNode[];
  nextComponentTree: ComponentTreeNode[];
  lifeCycleMethodCallEvents: AuguryEvent[];
}
