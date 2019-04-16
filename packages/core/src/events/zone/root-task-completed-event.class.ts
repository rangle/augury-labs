import { Probe } from '../../probes';
import { TaskEventSupport } from './task-event-support.class';

export class RootTaskCompletedEvent extends TaskEventSupport {
  constructor(probe: Probe, task: any) {
    super(probe, task);
  }
}
