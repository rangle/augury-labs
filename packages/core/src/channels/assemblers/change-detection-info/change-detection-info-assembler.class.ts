import { AuguryEvent } from '../../../events';
import { AuguryEventAssembler } from '../augury-event-assembler.class';
import { ChangeDetectionInfo } from './change-detection-info.interface';

export class ChangeDetectionInfoAssembler extends AuguryEventAssembler<ChangeDetectionInfo> {
  private ChangeDetectionInfo: Partial<ChangeDetectionInfo> = {
    drag: 0,
  };
  private numberOfViewChecks: number = 0;

  public collect(event: AuguryEvent): boolean {
    if (event.probeName === 'ComponentHooksProbe') {
      this.ChangeDetectionInfo.drag += event.getAuguryDrag();

      switch (event.payload.hook) {
        case 'ngDoCheck':
          if (!this.ChangeDetectionInfo.componentsChecked) {
            this.ChangeDetectionInfo = {
              ...this.ChangeDetectionInfo,
              startEventId: event.id,
              startTimestamp: event.creationAtTimestamp,
              componentsChecked: [],
            };
          }

          this.ChangeDetectionInfo.componentsChecked.push(event.payload.componentInstance);

          break;
        case 'ngAfterViewChecked':
          this.numberOfViewChecks++;

          this.ChangeDetectionInfo = {
            ...this.ChangeDetectionInfo,
            endEventId: event.id,
            endTimestamp: event.completedAtTimestamp,
          };

          if (this.numberOfViewChecks === this.ChangeDetectionInfo.componentsChecked.length) {
            return true;
          }
      }
    }

    return false;
  }

  protected getOutput(): ChangeDetectionInfo | null {
    return this.ChangeDetectionInfo as ChangeDetectionInfo;
  }

  protected cleanup() {
    this.ChangeDetectionInfo = {
      drag: 0,
    };
    this.numberOfViewChecks = 0;
  }
}
