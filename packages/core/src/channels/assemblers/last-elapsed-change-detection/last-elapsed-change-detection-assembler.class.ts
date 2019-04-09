import { AuguryEvent } from '../../../events';
import { AuguryEventAssembler } from '../augury-event-assembler.class';
import { LastElapsedChangeDetection } from './last-elapsed-change-detection.interface';

export class LastElapsedChangeDetectionAssembler extends AuguryEventAssembler<
  LastElapsedChangeDetection
> {
  private lastElapsedChangeDetection: Partial<LastElapsedChangeDetection> = {
    drag: 0,
  };
  private numberOfViewChecks: number = 0;

  public collect(event: AuguryEvent): boolean {
    if (event.probeName === 'ComponentHooksProbe') {
      this.lastElapsedChangeDetection.drag += event.getAuguryDrag();

      switch (event.payload.hook) {
        case 'ngDoCheck':
          if (!this.lastElapsedChangeDetection.componentsChecked) {
            this.lastElapsedChangeDetection = {
              ...this.lastElapsedChangeDetection,
              startEventId: event.id,
              startTimestamp: event.creationAtTimestamp,
              componentsChecked: [],
            };
          }

          this.lastElapsedChangeDetection.componentsChecked!.push(event.payload.componentInstance);

          break;
        case 'ngAfterViewChecked':
          this.numberOfViewChecks++;

          this.lastElapsedChangeDetection = {
            ...this.lastElapsedChangeDetection,
            endEventId: event.id,
            endTimestamp: event.completedAtTimestamp,
          };

          if (
            this.numberOfViewChecks === this.lastElapsedChangeDetection.componentsChecked!.length
          ) {
            return true;
          }
      }
    }

    return false;
  }

  protected getOutput(): LastElapsedChangeDetection | null {
    return this.lastElapsedChangeDetection as LastElapsedChangeDetection;
  }

  protected cleanup() {
    this.lastElapsedChangeDetection = {
      drag: 0,
    };
    this.numberOfViewChecks = 0;
  }
}
