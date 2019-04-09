import {
  AuguryBridgeRequest,
  EventDragInfoProjection,
  hasDragOccured,
  LastElapsedChangeDetectionAssembler,
  LastElapsedCycleAssembler,
  LastElapsedNgTaskAssembler,
  LastElapsedRootTaskAssembler,
  Plugin,
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
      .createAssemblyChannel(new LastElapsedRootTaskAssembler())
      .subscribe(lastElapsedTask =>
        this.bridge.sendMessage({ type: 'task', payload: lastElapsedTask }),
      );

    this.getAugury()
      .createAssemblyChannel(new LastElapsedNgTaskAssembler())
      .subscribe(lastElapsedTask =>
        this.bridge.sendMessage({ type: 'task', payload: lastElapsedTask }),
      );

    this.getAugury()
      .createAssemblyChannel(new LastElapsedCycleAssembler())
      .subscribe(lastElapsedCycle =>
        this.bridge.sendMessage({ type: 'cycle', payload: lastElapsedCycle }),
      );

    this.getAugury()
      .createAssemblyChannel(new LastElapsedChangeDetectionAssembler())
      .subscribe(lastElapsedChangeDetection =>
        this.bridge.sendMessage({
          type: 'cd',
          payload: lastElapsedChangeDetection,
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
        case 'get_full_cd':
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
      type: 'get_full_cd:response',
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
