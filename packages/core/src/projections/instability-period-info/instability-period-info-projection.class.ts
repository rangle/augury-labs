import { AuguryEvent } from '../../events';
import { ZoneStabilizedEvent, ZoneUnstabilizedEvent } from '../../events/zone';
import { EventProjection } from '../event-projection.class';
import { InstabilityPeriodInfo } from './instability-period-info.interface';

export class InstabilityPeriodInfoProjection extends EventProjection<InstabilityPeriodInfo> {
  private instabilityPeriodInfo: Partial<InstabilityPeriodInfo> = {};
  private isDuringInstabilityPeriod = false;

  public process(event: AuguryEvent): boolean {
    if (event.isInstanceOf(ZoneUnstabilizedEvent)) {
      this.instabilityPeriodInfo = {
        startEventId: event.id,
        startTimestamp: event.timePeriod.startTimestamp,
        drag: 0,
      };

      this.isDuringInstabilityPeriod = true;
    }

    if (this.isDuringInstabilityPeriod) {
      this.instabilityPeriodInfo.drag = event.getAuguryDrag();

      if (event.isInstanceOf(ZoneStabilizedEvent)) {
        const zoneStabilizedEvent = event as ZoneStabilizedEvent;

        this.instabilityPeriodInfo = {
          ...this.instabilityPeriodInfo,
          endEventId: event.id,
          endTimestamp: event.timePeriod.startTimestamp,
          componentTree: zoneStabilizedEvent.componentTree,
        };

        return true;
      }
    }

    return false;
  }

  protected getResult(): InstabilityPeriodInfo {
    return this.instabilityPeriodInfo as InstabilityPeriodInfo;
  }

  protected cleanup() {
    this.instabilityPeriodInfo = {};
    this.isDuringInstabilityPeriod = false;
  }
}
