import {
  Bridge,
  ChangeDetectionInfoProjection,
  ComponentTreeChangesInfoProjection,
  // DirectBridgeConnection,
  EventDragInfo,
  EventDragInfoProjection,
  hasDragOccured,
  InstabilityPeriodInfoProjection,
  Plugin,
  SocketBridgeConnection,
  TaskInfoProjection,
} from '@augury/core';
import { PerformanceProfilerController } from './performance-profiler-controller.class';

export class PerformanceProfilerPlugin extends Plugin {
  public cycles: any = {};
  public queuedTasks: any[] = [];

  private controller = new PerformanceProfilerController();

  public doInitialize() {
    // const connection = new DirectBridgeConnection();
    const connection = new SocketBridgeConnection();
    const bridge = new Bridge(connection);

    this.controller.window.auguryBridge = bridge;

    this.getAugury().registerEventProjection(new TaskInfoProjection(), taskInfo =>
      bridge.send({ type: 'task', payload: taskInfo }),
    );

    this.getAugury().registerEventProjection(
      new InstabilityPeriodInfoProjection(),
      instabilityPeriodInfo =>
        bridge.send({ type: 'instability-period', payload: instabilityPeriodInfo }),
    );

    this.getAugury().registerEventProjection(
      new ChangeDetectionInfoProjection(),
      changeDetectionInfo =>
        bridge.send({
          type: 'change-detection',
          payload: changeDetectionInfo,
        }),
    );

    this.getAugury().registerEventProjection(
      new EventDragInfoProjection(),
      (eventDragInfo: EventDragInfo) => {
        if (hasDragOccured(eventDragInfo)) {
          bridge.send({
            type: 'drag',
            payload: eventDragInfo,
          });
        }
      },
    );

    bridge.listen(request => {
      if (request.type === 'component-tree-changes') {
        bridge.send({
          type: 'component-tree-changes:response',
          payload: this.getAugury().projectFirstResultFromHistory(
            new ComponentTreeChangesInfoProjection(
              request.payload.startEventId,
              request.payload.endEventId,
            ),
          ),
        });
      }
    });
  }
}
