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

export class PerformanceProfilerPlugin extends Plugin {
  public cycles: any = {};
  public queuedTasks: any[] = [];

  private controller = new PerformanceProfilerController(this.bridge);

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
      if (request.type === 'query-change-detection-tree') {
        this.handleGetFullChangeDetectionRequest(request);
      }
    });
  }

  private handleGetFullChangeDetectionRequest(request: AuguryBridgeRequest) {
    this.bridge.sendMessage({
      type: 'query-change-detection-tree:response',
      payload: this.getAugury().projectFirstResult(
        new ChangeDetectionComponentTreeProjection(request.startEventId, request.endEventId),
      ),
    });
  }
}
