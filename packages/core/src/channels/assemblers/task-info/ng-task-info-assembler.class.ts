import { TaskInfoAssembler } from './task-info.class';

export class NgTaskInfoAssembler extends TaskInfoAssembler {
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
