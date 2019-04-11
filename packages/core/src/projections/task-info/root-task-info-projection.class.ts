import { TaskInfoProjection } from './task-info-projection.class';

export class RootTaskInfoProjection extends TaskInfoProjection {
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
