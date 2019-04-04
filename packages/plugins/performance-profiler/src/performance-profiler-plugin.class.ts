import {
  LastElapsedCDReducer,
  LastElapsedCycleReducer,
  LastElapsedEventReducer,
  LastElapsedTaskReducer,
  Plugin,
} from '@augury/core';
import { AuguryBridgeRequest } from '@augury/core';
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
      .createLiveChannel(new LastElapsedTaskReducer())
      .subscribe(lastElapsedTask => this.bridge.sendMessage({ type: 'task', lastElapsedTask }));

    this.getAugury()
      .createLiveChannel(new LastElapsedCycleReducer())
      .subscribe(lastElapsedCD => this.bridge.sendMessage({ type: 'cd', lastElapsedCD }));

    this.getAugury()
      .createLiveChannel(new LastElapsedCDReducer())
      .subscribe(lastElapsedCycle => this.bridge.sendMessage({ type: 'cycle', lastElapsedCycle }));

    this.getAugury()
      .createLiveChannel(new LastElapsedEventReducer())
      .subscribe(lastElapsedEvent =>
        this.bridge.sendMessage({
          type: 'drag',
          start: lastElapsedEvent.creationAtTimestamp,
          finish: lastElapsedEvent.completedAtTimestamp,
        }),
      );

    this.bridge.listenToMessageRequests(request => {
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
      data: {
        lastComponentTree,
        nextComponentTree,
        mergedComponentTree,
        lifecycleHooksByInstance,
        checkTimePerInstance,
      },
    });
  }
}
