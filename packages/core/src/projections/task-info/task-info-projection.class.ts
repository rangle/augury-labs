import {
  AuguryEvent,
  RootTaskCompletedEvent,
  RootTaskInvokedEvent,
  TaskEventSupport,
  ZoneTaskCompletedEvent,
  ZoneTaskInvokedEvent,
} from '../../events';
import { EventProjection } from '../event-projection.class';
import { TaskInfo } from './task-info.interface';

export class TaskInfoProjection extends EventProjection<TaskInfo> {
  private taskInfo: Partial<TaskInfo> = {};
  private isTaskExecuting = false;

  public process(event: AuguryEvent): boolean {
    if (event.isInstanceOf(ZoneTaskInvokedEvent) || event.isInstanceOf(RootTaskInvokedEvent)) {
      const taskEvent = event as TaskEventSupport;

      this.taskInfo = {
        zone: event.isInstanceOf(ZoneTaskInvokedEvent) ? 'ng' : 'root',
        task: taskEvent.task,
        startEventId: event.id,
        startTimestamp: event.dragPeriod.startTimestamp,
        drag: 0,
      };

      this.isTaskExecuting = true;
    }

    if (this.isTaskExecuting) {
      this.taskInfo.drag += event.getAuguryDrag();

      if (
        event.isInstanceOf(ZoneTaskCompletedEvent) ||
        event.isInstanceOf(RootTaskCompletedEvent)
      ) {
        this.taskInfo = {
          ...this.taskInfo,
          endTimestamp: event.dragPeriod.startTimestamp,
        };

        return true;
      }
    }

    return false;
  }

  protected getResult(): TaskInfo {
    return this.taskInfo as TaskInfo;
  }

  protected cleanup() {
    this.taskInfo = {};
    this.isTaskExecuting = false;
  }
}
