import { FlameGraphNode } from './flame-graph-node.interface';

export function mapComponentTreeToFlameGraphTree(
  tree = [] as any[],
  checkTimePerInstance = new Map(),
): FlameGraphNode[] {
  return tree.map(node => ({
    name: node.componentInstance.constructor.name,
    value: checkTimePerInstance.has(node.componentInstance)
      ? checkTimePerInstance.get(node.componentInstance)
      : 0,
    children: mapComponentTreeToFlameGraphTree(node.childNodes, checkTimePerInstance),
  }));
}
