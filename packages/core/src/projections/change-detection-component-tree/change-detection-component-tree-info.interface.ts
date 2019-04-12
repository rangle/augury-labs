import { ComponentTreeNode } from '../../probes/types/component-tree-node/component-tree-node.interface';

export interface ChangeDetectionComponentTreeInfo {
  previousComponentTree: ComponentTreeNode[];
  nextComponentTree: ComponentTreeNode[];
  lifecycleHooksTriggered: any[];
}
