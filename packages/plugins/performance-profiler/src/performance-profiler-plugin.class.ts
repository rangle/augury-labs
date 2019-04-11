import {
  AuguryBridgeRequest,
  ChangeDetectionComponentTreeProjection,
  ChangeDetectionInfoProjection,
  EventDragInfo,
  EventDragInfoProjection,
  hasDragOccured,
  InstabilityPeriodInfoProjection,
  NgTaskInfoProjection,
  Plugin,
  RootTaskInfoProjection,
} from '@augury/core';
import { PerformanceProfilerController } from './performance-profiler-controller.class';
import {
  deriveCheckTimePerInstance,
  groupLifecycleHooksByInstance,
  mergeComponentTrees,
  rawTreeToComponentInstanceTree,
} from './utils';

export class PerformanceProfilerPlugin extends Plugin {
  public cycles: any = {};
  public queuedTasks: any[] = [];

  private window = new PerformanceProfilerController(this.bridge);

  public doInitialize() {
    this.getAugury().subscribeToEvents(new RootTaskInfoProjection(), rootTaskInfo =>
      this.bridge.sendMessage({ type: 'task', payload: rootTaskInfo }),
    );

    this.getAugury().subscribeToEvents(new NgTaskInfoProjection(), ngTaskInfo =>
      this.bridge.sendMessage({ type: 'task', payload: ngTaskInfo }),
    );

    this.getAugury().subscribeToEvents(
      new InstabilityPeriodInfoProjection(),
      instabilityPeriodInfo =>
        this.bridge.sendMessage({ type: 'instability-period', payload: instabilityPeriodInfo }),
    );

    this.getAugury().subscribeToEvents(new ChangeDetectionInfoProjection(), changeDetectionInfo =>
      this.bridge.sendMessage({
        type: 'change-detection',
        payload: changeDetectionInfo,
      }),
    );

    this.getAugury().subscribeToEvents(
      new EventDragInfoProjection(),
      (eventDragInfo: EventDragInfo) => {
        if (hasDragOccured(eventDragInfo)) {
          this.bridge.sendMessage({
            type: 'drag',
            payload: eventDragInfo,
          });
        }
      },
    );

    this.bridge.listenToRequests(request => {
      switch (request.type) {
        case 'query-change-detection-tree':
          this.handleGetFullChangeDetectionRequest(request);
          break;
      }
    });
  }

  private handleGetFullChangeDetectionRequest(request: AuguryBridgeRequest) {
    const changeDetectionComponentTree = this.getAugury().project(
      new ChangeDetectionComponentTreeProjection(request.startEventId, request.endEventId),
    );

    if (changeDetectionComponentTree.length > 0) {
      const lastComponentTree = rawTreeToComponentInstanceTree(
        changeDetectionComponentTree[0].lastComponentTree,
      );
      const nextComponentTree = rawTreeToComponentInstanceTree(
        changeDetectionComponentTree[0].nextComponentTree,
      );
      const mergedComponentTree = mergeComponentTrees(lastComponentTree, nextComponentTree);

      const lifecycleHooksByInstance = groupLifecycleHooksByInstance(
        changeDetectionComponentTree[0].lifecycleHooksTriggered,
      );
      const checkTimePerInstance = deriveCheckTimePerInstance(
        lifecycleHooksByInstance,
        mergedComponentTree,
      );

      this.bridge.sendMessage({
        type: 'query-change-detection-tree:response',
        payload: {
          lastComponentTree,
          nextComponentTree,
          mergedComponentTree,
          lifecycleHooksByInstance,
          checkTimePerInstance,
        },
      });
    }
  }
}
