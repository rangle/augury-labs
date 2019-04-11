import { AuguryEvent } from '../../events';
import { Assembler } from './assembler.interface';

export abstract class AuguryEventAssembler<Output> implements Assembler<AuguryEvent, Output> {
  public abstract process(event: AuguryEvent): boolean;

  public finish(): Output | null {
    const output = this.getOutput();

    this.cleanup();

    return output;
  }

  protected abstract getOutput(): Output | null;

  protected abstract cleanup();
}
