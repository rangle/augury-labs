import { TaskInfoAssembler } from './task-info.class';

export class RootTaskInfoAssembler extends TaskInfoAssembler {
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
