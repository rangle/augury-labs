import { AuguryEvent } from '../../../events';
import { AuguryEventAssembler } from '../augury-event-assembler.class';
import { InstabilityPeriodInfo } from './instability-period-info.interface';

export class InstabilityPeriodInfoAssembler extends AuguryEventAssembler<InstabilityPeriodInfo> {
  private instabilityPeriodInfo: Partial<InstabilityPeriodInfo> = {};
  private isDuringInstabilityPeriod = false;

  public process(event: AuguryEvent): boolean {
    if (event.name === 'onUnstable') {
      this.instabilityPeriodInfo = {
        startEventId: event.id,
        startTimestamp: event.creationAtTimestamp,
        drag: 0,
      };

      this.isDuringInstabilityPeriod = true;
    }

    if (this.isDuringInstabilityPeriod) {
      this.instabilityPeriodInfo.drag = event.getAuguryDrag();

      if (event.name === 'onStable') {
        this.instabilityPeriodInfo = {
          ...this.instabilityPeriodInfo,
          endEventId: event.id,
          endTimestamp: event.creationAtTimestamp,
          componentTree: event.payload.componentTree,
        };

        return true;
      }
    }

    return false;
  }

  protected getOutput(): InstabilityPeriodInfo {
    return this.instabilityPeriodInfo as InstabilityPeriodInfo;
  }

  protected cleanup() {
    this.instabilityPeriodInfo = {};
    this.isDuringInstabilityPeriod = false;
  }
}
