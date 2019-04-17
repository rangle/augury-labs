import { AuguryEvent } from '../augury-event.class';
import { ZoneTask } from './zone-task.type';

export abstract class TaskEventSupport extends AuguryEvent {
  protected constructor(public readonly task: ZoneTask) {
    super();
  }
}
