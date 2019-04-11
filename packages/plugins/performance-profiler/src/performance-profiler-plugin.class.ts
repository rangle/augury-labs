import {
  AuguryBridgeRequest,
  ChangeDetectionInfoAssembler,
  EventDragInfoProjection,
  hasDragOccured,
  InstabilityPeriodInfoAssembler,
  NgTaskInfoAssembler,
  Plugin,
  RootTaskInfoAssembler,
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
    this.getAugury()
      .createAssemblyChannel(new RootTaskInfoAssembler())
      .subscribe(rootTaskInfo => this.bridge.sendMessage({ type: 'task', payload: rootTaskInfo }));

    this.getAugury()
      .createAssemblyChannel(new NgTaskInfoAssembler())
      .subscribe(ngTaskInfo => this.bridge.sendMessage({ type: 'task', payload: ngTaskInfo }));

    this.getAugury()
      .createAssemblyChannel(new InstabilityPeriodInfoAssembler())
      .subscribe(instabilityPeriodInfo =>
        this.bridge.sendMessage({ type: 'instability-period', payload: instabilityPeriodInfo }),
      );

    this.getAugury()
      .createAssemblyChannel(new ChangeDetectionInfoAssembler())
      .subscribe(changeDetectionInfo =>
        this.bridge.sendMessage({
          type: 'change-detection',
          payload: changeDetectionInfo,
        }),
      );

    this.getAugury()
      .createSimpleChannel(new EventDragInfoProjection())
      .subscribe(eventDragInfo => {
        if (hasDragOccured(eventDragInfo)) {
          this.bridge.sendMessage({
            type: 'drag',
            payload: eventDragInfo,
          });
        }
      });

    this.bridge.listenToRequests(request => {
      switch (request.type) {
        case 'query-change-detection-tree':
          this.handleGetFullChangeDetectionRequest(request);
          break;
      }
    });
  }

  private handleGetFullChangeDetectionRequest(request: AuguryBridgeRequest) {
    const rawCdRunData = this.getAugury().historyManager.scan(
      request.startEventId,
      request.endEventId,
    );

    const lastComponentTree = rawTreeToComponentInstanceTree(rawCdRunData.lastComponentTree);
    const nextComponentTree = rawTreeToComponentInstanceTree(rawCdRunData.nextComponentTree);
    const mergedComponentTree = mergeComponentTrees(lastComponentTree, nextComponentTree);

    const lifecycleHooksByInstance = groupLifecycleHooksByInstance(
      rawCdRunData.lifecycleHooksTriggered,
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
