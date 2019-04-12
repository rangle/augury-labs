import { AuguryEvent } from '../../events';
import { MergedComponentTreeNode } from '../../probes/types/component-tree-node';

export function groupLifecycleHooksByInstance(events: AuguryEvent[]): Map<string, any> {
  const entries = new Map<string, any>();

  events.forEach(event => {
    const { hook, componentInstance } = event.payload;

    if (!entries.has(componentInstance)) {
      entries.set(componentInstance, {});
    }

    entries.get(componentInstance)[hook] = event.creationAtTimestamp;
  });

  return entries;
}

export function recursivelyDeriveCheckTimeForComponentSubTree(
  lifecycleHooksByInstance,
  mergedComponentTreeNodes: MergedComponentTreeNode[],
  parentDoCheck = 0,
  checkTimePerInstance: Map<any, number>,
): number {
  let lastSiblingDoCheck;
  let totalForSiblings = 0;

  mergedComponentTreeNodes.forEach(node => {
    const nodeLifecycleHooks = lifecycleHooksByInstance.get(node.instance);

    // this is a node that appeared but was removed again before onStable
    //   this can happen when there are multiple cd runs in 1 instability period
    if (!nodeLifecycleHooks) {
      return;
    }

    const nodeDoCheck = nodeLifecycleHooks.ngDoCheck;

    const childrenCheckTime = recursivelyDeriveCheckTimeForComponentSubTree(
      lifecycleHooksByInstance,
      node.children,
      nodeDoCheck,
      checkTimePerInstance,
    );

    const bindingsCheckTime =
      (lastSiblingDoCheck || parentDoCheck) > 0
        ? nodeDoCheck - (lastSiblingDoCheck || parentDoCheck)
        : 0;

    const nodeCheckTime =
      childrenCheckTime + bindingsCheckTime > 0 ? childrenCheckTime + bindingsCheckTime : 0;

    checkTimePerInstance.set(node.instance, nodeCheckTime);

    lastSiblingDoCheck = nodeDoCheck;
    totalForSiblings += nodeCheckTime;
  });

  return totalForSiblings;
}

export function deriveCheckTimePerInstance(
  lifecycleHooksByInstance,
  mergedComponentTreeNodes: MergedComponentTreeNode[],
): Map<any, number> {
  const checkTimePerInstance = new Map<any, number>();

  recursivelyDeriveCheckTimeForComponentSubTree(
    lifecycleHooksByInstance,
    mergedComponentTreeNodes,
    0,
    checkTimePerInstance,
  );

  return checkTimePerInstance;
}
