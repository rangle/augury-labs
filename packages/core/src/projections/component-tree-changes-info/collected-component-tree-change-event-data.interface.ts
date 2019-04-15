import { AuguryEvent } from '../../events';
import { ComponentTreeNode } from '../../probes/types/component-tree-node';

/**
 * Type used to store event data within the `ComponentTreeChangesInfoProjection` before
 * computing the final result in `ComponentTreeChangesInfo`
 */
export interface CollectedComponentTreeChangeEventData {
  previousComponentTree: ComponentTreeNode[];
  nextComponentTree: ComponentTreeNode[];
  lifeCycleMethodCallEvents: AuguryEvent[];
}
