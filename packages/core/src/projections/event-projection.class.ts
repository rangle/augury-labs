import { AuguryEvent } from '../events';
import { Projection } from './projection.interface';

export abstract class EventProjection<Result> implements Projection<AuguryEvent, Result> {
  public abstract process(event: AuguryEvent): boolean;

  public collectResult(): Result | null {
    const result = this.getResult();

    this.cleanup();

    return result;
  }

  protected abstract getResult(): Result | null;

  protected abstract cleanup();
}
