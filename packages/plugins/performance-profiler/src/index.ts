import {
  LastElapsedCDReducer,
  LastElapsedCycleReducer,
  LastElapsedEventReducer,
  LastElapsedTaskReducer,
  Plugin,
} from '@augury/core';
import { Reducer } from '@augury/core';
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

  private performanceProfilerWindow = new PerformanceProfilerController();

  public doInitialize() {
    const tasksChannel = this.createLiveChannel(new LastElapsedTaskReducer());
    const cyclesChannel = this.createLiveChannel(new LastElapsedCycleReducer());
    const cdChannel = this.createLiveChannel(new LastElapsedCDReducer());
    const dragChannel = this.createLiveChannel(new LastElapsedEventReducer());

    tasksChannel.events.subscribe(lastElapsedTask =>
      this.performanceProfilerWindow.sendMessage({ type: 'task', lastElapsedTask }),
    );

    cdChannel.events.subscribe(lastElapsedCD =>
      this.performanceProfilerWindow.sendMessage({ type: 'cd', lastElapsedCD }),
    );

    cyclesChannel.events.subscribe(lastElapsedCycle =>
      this.performanceProfilerWindow.sendMessage({ type: 'cycle', lastElapsedCycle }),
    );

    dragChannel.events.subscribe(lastElapsedEvent =>
      this.performanceProfilerWindow.sendMessage({
        type: 'drag',
        start: lastElapsedEvent.creationAtPerformanceStamp,
        finish: lastElapsedEvent.auguryHandlingCompletionPerformanceStamp,
      }),
    );

    this.performanceProfilerWindow.listenToMessageRequests(request => {
      switch (request.type) {
        case 'get_full_cd':
          this.handleGetFullChangeDetectionRequest(request);
          break;
      }
    });
  }

  private createLiveChannel(reducer: Reducer) {
    return this.run('createLiveChannel', { reducer }).channel;
  }

  private scanHistory(startEventId: number, endEventId: number) {
    return this.run('scanHistory', { startEventId, endEventId }).result;
  }

  private handleGetFullChangeDetectionRequest(request: AuguryBridgeRequest) {
    const rawCdRunData = this.scanHistory(request.startEventId, request.endEventId);

    const lastComponentTree = rawTreeToComponentInstanceTree(rawCdRunData.lastComponentTree);
    const nextComponentTree = rawTreeToComponentInstanceTree(rawCdRunData.nextComponentTree);
    const lifecycleHooksByInstance = groupLifecycleHooksByInstance(
      rawCdRunData.lifecycleHooksTriggered,
    );
    const mergedComponentTree = mergeComponentTrees(lastComponentTree, nextComponentTree);
    const checkTimePerInstance = deriveCheckTimePerInstance(
      lifecycleHooksByInstance,
      mergedComponentTree,
    );

    this.performanceProfilerWindow.sendMessage({
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
