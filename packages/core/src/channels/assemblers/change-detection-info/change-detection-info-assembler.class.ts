import { AuguryEvent } from '../../../events';
import { AuguryEventAssembler } from '../augury-event-assembler.class';
import { ChangeDetectionInfo } from './change-detection-info.interface';

export class ChangeDetectionInfoAssembler extends AuguryEventAssembler<ChangeDetectionInfo> {
  private changeDetectionInfo: Partial<ChangeDetectionInfo> = {
    drag: 0,
  };
  private numberOfViewChecks: number = 0;

  public process(event: AuguryEvent): boolean {
    if (event.probeName === 'ComponentHooksProbe') {
      this.changeDetectionInfo.drag += event.getAuguryDrag();

      switch (event.payload.hook) {
        case 'ngDoCheck':
          if (!this.changeDetectionInfo.componentsChecked) {
            this.changeDetectionInfo = {
              ...this.changeDetectionInfo,
              startEventId: event.id,
              startTimestamp: event.creationAtTimestamp,
              componentsChecked: [],
            };
          }

          this.changeDetectionInfo.componentsChecked.push(event.payload.componentInstance);

          break;
        case 'ngAfterViewChecked':
          this.numberOfViewChecks++;

          this.changeDetectionInfo = {
            ...this.changeDetectionInfo,
            endEventId: event.id,
            endTimestamp: event.completedAtTimestamp,
          };

          if (this.numberOfViewChecks === this.changeDetectionInfo.componentsChecked.length) {
            return true;
          }
      }
    }

    return false;
  }

  protected getOutput(): ChangeDetectionInfo | null {
    return this.changeDetectionInfo as ChangeDetectionInfo;
  }

  protected cleanup() {
    this.changeDetectionInfo = {
      drag: 0,
    };
    this.numberOfViewChecks = 0;
  }
}
