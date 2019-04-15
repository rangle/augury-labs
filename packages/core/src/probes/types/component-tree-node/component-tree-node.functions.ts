import { difference, intersection } from '../../../utils';
import { ComponentTreeChange } from './component-tree-change.type';
import { ComponentTreeNode } from './component-tree-node.interface';
import { MergedComponentTreeNode } from './merged-component-tree-node.interface';

declare const ng;
declare const getAllAngularRootElements;

let rootDebugElements: any[] = [];

function getRootDebugElements() {
  if (rootDebugElements.length === 0) {
    rootDebugElements = getAllAngularRootElements().map(ng.probe);
  }

  return rootDebugElements;
}

export function getComponentTree(): ComponentTreeNode[] {
  return mapDebugElementToComponentTreeNode(getRootDebugElements());
}

function mapDebugElementToComponentTreeNode(
  debugElements: any[],
  parentComponentInstance = null,
): ComponentTreeNode[] {
  return debugElements.reduce((componentTreeNodes: ComponentTreeNode[], debugElement) => {
    if (debugElement.componentInstance === parentComponentInstance) {
      return componentTreeNodes.concat(
        mapDebugElementToComponentTreeNode(debugElement.children, parentComponentInstance),
      );
    } else {
      return componentTreeNodes.concat([
        {
          type: debugElement.componentInstance.constructor.name,
          instance: debugElement.componentInstance,
          children: mapDebugElementToComponentTreeNode(
            debugElement.children,
            debugElement.componentInstance,
          ),
        },
      ]);
    }
  }, []);
}

function mapComponentTreeNodesToMap(nodes: ComponentTreeNode[]): Map<any, ComponentTreeNode> {
  return nodes.reduce((map: Map<any, ComponentTreeNode>, node) => {
    map.set(node.instance, node);

    return map;
  }, new Map<any, ComponentTreeNode>());
}

export function mergeComponentTrees(
  beforeTree: ComponentTreeNode[],
  afterTree: ComponentTreeNode[],
  change: ComponentTreeChange = 'none',
): MergedComponentTreeNode[] {
  const beforeInstancesToNodes = mapComponentTreeNodesToMap(beforeTree);
  const afterInstancesToNodes = mapComponentTreeNodesToMap(afterTree);

  const sharedNodes = [
    ...intersection(new Set(beforeInstancesToNodes.keys()), new Set(afterInstancesToNodes.keys())),
  ].map(instance => ({
    beforeNode: beforeInstancesToNodes.get(instance),
    afterNode: afterInstancesToNodes.get(instance),
  }));

  const addedNodes = [
    ...difference(new Set(afterInstancesToNodes.keys()), new Set(beforeInstancesToNodes.keys())),
  ].map(instance => afterInstancesToNodes.get(instance));

  const removedNodes = [
    ...difference(new Set(beforeInstancesToNodes.keys()), new Set(afterInstancesToNodes.keys())),
  ].map(instance => beforeInstancesToNodes.get(instance));

  return []
    .concat(
      sharedNodes.map(({ beforeNode, afterNode }) => ({
        ...afterNode,
        change,
        children: mergeComponentTrees(beforeNode.children, afterNode.children),
      })),
    )
    .concat(
      addedNodes.map(node => ({
        ...node,
        change: 'added',
        children: mergeComponentTrees([], node.children, 'added'),
      })),
    )
    .concat(
      removedNodes.map(node => ({
        ...node,
        change: 'removed',
        children: mergeComponentTrees(node.children, [], 'removed'),
      })),
    );
}
