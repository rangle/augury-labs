import { TaskInfoProjection } from './task-info-projection.class';

export class NgTaskInfoProjection extends TaskInfoProjection {
  protected getExecutingEventName(): string {
    return 'onInvokeTask_executing';
  }

  protected getCompletedEventName(): string {
    return 'onInvokeTask_completed';
  }

  protected getZoneValue(): string {
    return 'ng';
  }
}
