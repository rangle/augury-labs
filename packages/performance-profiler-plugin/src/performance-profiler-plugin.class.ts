import {
  AuguryBridgeRequest,
  ChangeDetectionInfoProjection,
  ComponentTreeChangesInfoProjection,
  EventDragInfo,
  EventDragInfoProjection,
  hasDragOccured,
  InstabilityPeriodInfoProjection,
  Plugin,
  TaskInfoProjection,
} from '@augury/core';
import { PerformanceProfilerController } from './performance-profiler-controller.class';

export class PerformanceProfilerPlugin extends Plugin {
  public cycles: any = {};
  public queuedTasks: any[] = [];

  private controller = new PerformanceProfilerController(this.bridge);

  public doInitialize() {
    this.getAugury().registerEventProjection(new TaskInfoProjection(), taskInfo =>
      this.bridge.sendMessage({ type: 'task', payload: taskInfo }),
    );

    this.getAugury().registerEventProjection(
      new InstabilityPeriodInfoProjection(),
      instabilityPeriodInfo =>
        this.bridge.sendMessage({ type: 'instability-period', payload: instabilityPeriodInfo }),
    );

    this.getAugury().registerEventProjection(
      new ChangeDetectionInfoProjection(),
      changeDetectionInfo =>
        this.bridge.sendMessage({
          type: 'change-detection',
          payload: changeDetectionInfo,
        }),
    );

    this.getAugury().registerEventProjection(
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
      if (request.type === 'component-tree-changes') {
        this.handleGetFullChangeDetectionRequest(request);
      }
    });
  }

  private handleGetFullChangeDetectionRequest(request: AuguryBridgeRequest) {
    this.bridge.sendMessage({
      type: 'component-tree-changes:response',
      payload: this.getAugury().projectFirstResultFromHistory(
        new ComponentTreeChangesInfoProjection(request.startEventId, request.endEventId),
      ),
    });
  }
}
