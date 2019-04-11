import { AuguryEvent } from '../events';
import { Projection } from './projection.interface';

export abstract class AuguryEventProjection<Output> implements Projection<AuguryEvent, Output> {
  public abstract process(event: AuguryEvent): boolean;

  public finish(): Output | null {
    const output = this.getOutput();

    this.cleanup();

    return output;
  }

  protected abstract getOutput(): Output | null;

  protected abstract cleanup();
}
