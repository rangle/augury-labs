import { LastElapsedTaskAssembler } from './last-elapsed-task-assembler.class';

export class LastElapsedNgTaskAssembler extends LastElapsedTaskAssembler {
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
