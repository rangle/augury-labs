import { AuguryEvent } from '../../../events';
import { ComponentTypeChangeDetectionFrequency } from '../../../projections/component-tree-changes-info/component-type-change-detection-frequency.interface';
import { MergedComponentTreeNode } from './merged-component-tree-node.interface';

function getComponentInstanceNgDoCheckTimestamps(events: AuguryEvent[]): Map<any, number> {
  return events.reduce((componentInstanceNgDoCheckTimestamps, event) => {
    if (event.payload.hook === 'ngDoCheck') {
      componentInstanceNgDoCheckTimestamps.set(
        event.payload.componentInstance,
        event.creationAtTimestamp,
      );
    }

    return componentInstanceNgDoCheckTimestamps;
  }, new Map<any, number>());
}

function recursivelyDeriveCheckTimeForComponentSubTree(
  nodes: MergedComponentTreeNode[],
  componentInstanceNgDoCheckTimestamps: Map<any, number>,
  lifeCycleChecksPerComponentInstance: Map<any, number>,
  parentNodeNgDoCheckTime: number = null,
): number {
  let previousSiblingNgDoCheckTime: number = null;

  return nodes.reduce((totalNgDoCheckTime, node) => {
    if (componentInstanceNgDoCheckTimestamps.has(node.instance)) {
      const childrenNgDoCheckTime = recursivelyDeriveCheckTimeForComponentSubTree(
        node.children,
        componentInstanceNgDoCheckTimestamps,
        lifeCycleChecksPerComponentInstance,
        componentInstanceNgDoCheckTimestamps.get(node.instance),
      );

      const currentNodeNgDoCheckTimeAfterPreviousNode =
        Math.max(previousSiblingNgDoCheckTime, parentNodeNgDoCheckTime) > 0
          ? componentInstanceNgDoCheckTimestamps.get(node.instance) -
            Math.max(previousSiblingNgDoCheckTime, parentNodeNgDoCheckTime)
          : 0;

      lifeCycleChecksPerComponentInstance.set(
        node.instance,
        childrenNgDoCheckTime + currentNodeNgDoCheckTimeAfterPreviousNode,
      );

      previousSiblingNgDoCheckTime = componentInstanceNgDoCheckTimestamps.get(node.instance);

      return totalNgDoCheckTime + lifeCycleChecksPerComponentInstance.get(node.instance);
    } else {
      return totalNgDoCheckTime;
    }
  }, 0);
}

export function getLifeCycleChecksPerComponentInstance(
  mergedComponentTreeNodes: MergedComponentTreeNode[],
  lifeCycleMethodCallEvents: AuguryEvent[],
  lifeCycleChecksPerComponentInstance = new Map<any, number>(),
): Map<any, number> {
  recursivelyDeriveCheckTimeForComponentSubTree(
    mergedComponentTreeNodes,
    getComponentInstanceNgDoCheckTimestamps(lifeCycleMethodCallEvents),
    lifeCycleChecksPerComponentInstance,
  );

  return lifeCycleChecksPerComponentInstance;
}

export function getComponentTypeChangeDetectionFrequency(
  lifeCycleChecksPerComponentInstance: Map<string, number>,
): ComponentTypeChangeDetectionFrequency[] {
  const componentChangeDetections = new Map<string, number>();

  lifeCycleChecksPerComponentInstance.forEach((_, componentInstance) => {
    const currentFrequency = componentChangeDetections.has(componentInstance.constructor.name)
      ? componentChangeDetections.get(componentInstance.constructor.name)
      : 0;

    componentChangeDetections.set(componentInstance.constructor.name, currentFrequency + 1);
  });

  return [...componentChangeDetections.entries()].map(([name, amount]) => ({
    name,
    amount,
  }));
}
