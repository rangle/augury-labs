import { AuguryEvent } from '../../../events';
import { AuguryEventAssembler } from '../augury-event-assembler.class';
import { LastElapsedCycle } from './last-elapsed-cycle.interface';

export class LastElapsedCycleAssembler extends AuguryEventAssembler<LastElapsedCycle> {
  private lastElapsedCycle: Partial<LastElapsedCycle> = {};
  private isDuringInstabilityPeriod = false;

  public collect(event: AuguryEvent): boolean {
    if (event.name === 'onUnstable') {
      this.lastElapsedCycle = {
        startEventId: event.id,
        startTimestamp: event.creationAtTimestamp,
        drag: 0,
      };

      this.isDuringInstabilityPeriod = true;
    }

    if (this.isDuringInstabilityPeriod) {
      this.lastElapsedCycle.drag = event.getAuguryDrag();

      if (event.name === 'onStable') {
        this.lastElapsedCycle = {
          ...this.lastElapsedCycle,
          endEventId: event.id,
          endTimestamp: event.creationAtTimestamp,
          componentTree: event.payload.componentTree,
        };

        return true;
      }
    }

    return false;
  }

  protected getOutput(): LastElapsedCycle {
    return this.lastElapsedCycle as LastElapsedCycle;
  }

  protected cleanup() {
    this.lastElapsedCycle = {};
    this.isDuringInstabilityPeriod = false;
  }
}
