import { TaskEventSupport } from './task-event-support.class';
import { ZoneTask } from './zone-task.type';

export class RootTaskCompletedEvent extends TaskEventSupport {
  constructor(task: ZoneTask) {
    super(task);
  }
}
