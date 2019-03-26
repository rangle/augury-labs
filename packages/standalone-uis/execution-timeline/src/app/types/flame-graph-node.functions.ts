import { FlameGraphNode } from './flame-graph-node.interface';

export function mapTreeToFlameGraphNodes(
  tree = [] as any[],
  checkTimePerInstance = new Map(),
): FlameGraphNode[] {
  return tree.map(node => ({
    name: node.componentInstance.constructor.name,
    value: checkTimePerInstance.get(node.componentInstance),
    children: mapTreeToFlameGraphNodes(node.childNodes, checkTimePerInstance),
  }));
}
