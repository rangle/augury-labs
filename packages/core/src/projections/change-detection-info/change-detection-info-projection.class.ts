import { AuguryEvent } from '../../events';
import { ComponentLifecycleMethodInvokedEvent } from '../../events/component-lifecycle-method-events';
import { EventProjection } from '../event-projection.class';
import { ChangeDetectionInfo } from './change-detection-info.interface';

export class ChangeDetectionInfoProjection extends EventProjection<ChangeDetectionInfo> {
  private changeDetectionInfo: Partial<ChangeDetectionInfo> = {
    drag: 0,
  };
  private numberOfViewChecks: number = 0;

  public process(event: AuguryEvent): boolean {
    if (event.isInstanceOf(ComponentLifecycleMethodInvokedEvent)) {
      const componentLifecycleMethodInvokedEvent = event as ComponentLifecycleMethodInvokedEvent;

      this.changeDetectionInfo.drag += event.getAuguryDrag();

      switch (componentLifecycleMethodInvokedEvent.hookMethod) {
        case 'ngDoCheck':
          if (!this.changeDetectionInfo.componentsChecked) {
            this.changeDetectionInfo = {
              ...this.changeDetectionInfo,
              startEventId: event.id,
              startTimestamp: event.timePeriod.startTimestamp,
              componentsChecked: [],
            };
          }

          this.changeDetectionInfo.componentsChecked.push(
            componentLifecycleMethodInvokedEvent.componentInstance,
          );

          break;
        case 'ngAfterViewChecked':
          this.numberOfViewChecks++;

          this.changeDetectionInfo = {
            ...this.changeDetectionInfo,
            endEventId: event.id,
            endTimestamp: event.timePeriod.endTimestamp,
          };

          if (this.numberOfViewChecks === this.changeDetectionInfo.componentsChecked.length) {
            return true;
          }
      }
    }

    return false;
  }

  protected getResult(): ChangeDetectionInfo | null {
    return this.changeDetectionInfo as ChangeDetectionInfo;
  }

  protected cleanup() {
    this.changeDetectionInfo = {
      drag: 0,
    };
    this.numberOfViewChecks = 0;
  }
}
