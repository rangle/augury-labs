export interface ComponentTreeNode {
  type: string;
  instance: any;
  children: ComponentTreeNode[];
}
