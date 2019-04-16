import { Probe } from '../../probes';
import { TaskEventSupport } from './task-event-support.class';

export class RootTaskInvokedEvent extends TaskEventSupport {
  constructor(probe: Probe, task: any) {
    super(probe, task);
  }
}
