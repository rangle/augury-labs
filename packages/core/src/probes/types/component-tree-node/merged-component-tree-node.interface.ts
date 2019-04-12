import { ComponentTreeChange } from './component-tree-change.type';
import { ComponentTreeNode } from './component-tree-node.interface';

export interface MergedComponentTreeNode extends ComponentTreeNode {
  change: ComponentTreeChange;
  children: MergedComponentTreeNode[];
}
