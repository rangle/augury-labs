import { AuguryEvent } from '../../events';
import { AuguryEventProjection } from '../augury-event-projection.class';

export class TotalAuguryDragProjection extends AuguryEventProjection<number> {
  private result = 0;

  constructor(private startEventId: number, private endEventId: number) {
    super();
  }

  public process(event: AuguryEvent): boolean {
    this.result += event.isIdInRange(this.startEventId, this.endEventId)
      ? event.getAuguryDrag()
      : 0;

    return false;
  }

  protected getOutput(): number | null {
    return this.result;
  }

  protected cleanup() {
    this.result = 0;
  }
}
