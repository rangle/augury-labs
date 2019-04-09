import { AuguryEvent } from '../../../events';
import { AuguryEventAssembler } from '../augury-event-assembler.class';
import { LastElapsedTask } from './last-elapsed-task.interface';

export abstract class LastElapsedTaskAssembler extends AuguryEventAssembler<LastElapsedTask> {
  private lastElapsedTask: Partial<LastElapsedTask> = {};
  private isTaskExecuting = false;

  public collect(event: AuguryEvent): boolean {
    if (event.name === this.getExecutingEventName()) {
      this.lastElapsedTask = {
        zone: this.getZoneValue(),
        task: event.payload.task,
        startEventId: event.id,
        startTimestamp: event.creationAtTimestamp,
        drag: 0,
      };

      this.isTaskExecuting = true;
    }

    if (this.isTaskExecuting) {
      this.lastElapsedTask.drag += event.getAuguryDrag();

      if (event.name === this.getCompletedEventName()) {
        this.lastElapsedTask = {
          ...this.lastElapsedTask,
          endTimestamp: event.creationAtTimestamp,
        };

        return true;
      }
    }

    return false;
  }

  protected getOutput(): LastElapsedTask {
    return this.lastElapsedTask as LastElapsedTask;
  }

  protected cleanup() {
    this.lastElapsedTask = {};
    this.isTaskExecuting = false;
  }

  protected abstract getExecutingEventName(): string;

  protected abstract getCompletedEventName(): string;

  protected abstract getZoneValue(): string;
}
