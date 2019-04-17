import {
  Bridge,
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

  private controller = new PerformanceProfilerController();

  public doInitialize() {
    const connection = Bridge.getInstance().createProducerConnection();
    this.controller.window.bridgeConnection = Bridge.getInstance().createConsumerConnection();

    this.getAugury().registerEventProjection(new TaskInfoProjection(), taskInfo =>
      connection.send({ type: 'task', payload: taskInfo }),
    );

    this.getAugury().registerEventProjection(
      new InstabilityPeriodInfoProjection(),
      instabilityPeriodInfo =>
        connection.send({ type: 'instability-period', payload: instabilityPeriodInfo }),
    );

    this.getAugury().registerEventProjection(
      new ChangeDetectionInfoProjection(),
      changeDetectionInfo =>
        connection.send({
          type: 'change-detection',
          payload: changeDetectionInfo,
        }),
    );

    this.getAugury().registerEventProjection(
      new EventDragInfoProjection(),
      (eventDragInfo: EventDragInfo) => {
        if (hasDragOccured(eventDragInfo)) {
          connection.send({
            type: 'drag',
            payload: eventDragInfo,
          });
        }
      },
    );

    connection.listen(request => {
      if (request.type === 'component-tree-changes') {
        connection.send({
          type: 'component-tree-changes:response',
          payload: this.getAugury().projectFirstResultFromHistory(
            new ComponentTreeChangesInfoProjection(request.startEventId, request.endEventId),
          ),
        });
      }
    });
  }
}
