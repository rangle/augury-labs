import { LastElapsedTaskAssembler } from './last-elapsed-task-assembler.class';

export class LastElapsedRootTaskAssembler extends LastElapsedTaskAssembler {
  protected getExecutingEventName(): string {
    return 'root_task_executing';
  }

  protected getCompletedEventName(): string {
    return 'root_task_completed';
  }

  protected getZoneValue(): string {
    return 'root';
  }
}
