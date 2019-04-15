import { FlameGraphNode } from './flame-graph-node.interface';

export function mapComponentTreeToFlameGraphTree(
  tree = [] as any[],
  checkTimePerInstance = new Map(),
): FlameGraphNode[] {
  return tree.map(node => ({
    name: node.instance.constructor.name,
    value: checkTimePerInstance.has(node.instance) ? checkTimePerInstance.get(node.instance) : 0,
    children: mapComponentTreeToFlameGraphTree(node.children, checkTimePerInstance),
  }));
}
