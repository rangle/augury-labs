import { MergedComponentTreeNode } from '../../probes/types/component-tree-node';

export interface ChangeDetectionMergedComponentTree {
  mergedComponentTree: MergedComponentTreeNode[];
  checkTimePerInstance: Map<any, number>;
}
