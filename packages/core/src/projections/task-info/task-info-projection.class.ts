import { AuguryEvent } from '../../events';
import { EventProjection } from '../event-projection.class';
import { TaskInfo } from './task-info.interface';

export abstract class TaskInfoProjection extends EventProjection<TaskInfo> {
  private taskInfo: Partial<TaskInfo> = {};
  private isTaskExecuting = false;

  public process(event: AuguryEvent): boolean {
    if (event.name === this.getExecutingEventName()) {
      this.taskInfo = {
        zone: this.getZoneValue(),
        task: event.payload.task,
        startEventId: event.id,
        startTimestamp: event.creationAtTimestamp,
        drag: 0,
      };

      this.isTaskExecuting = true;
    }

    if (this.isTaskExecuting) {
      this.taskInfo.drag += event.getAuguryDrag();

      if (event.name === this.getCompletedEventName()) {
        this.taskInfo = {
          ...this.taskInfo,
          endTimestamp: event.creationAtTimestamp,
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

  protected abstract getExecutingEventName(): string;

  protected abstract getCompletedEventName(): string;

  protected abstract getZoneValue(): string;
}
