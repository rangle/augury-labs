import { AuguryEvent } from '../../events';
import { EventProjection } from '../event-projection.class';

export class TotalAuguryDragProjection extends EventProjection<number> {
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

  protected getResult(): number | null {
    return this.result;
  }

  protected cleanup() {
    this.result = 0;
  }
}
