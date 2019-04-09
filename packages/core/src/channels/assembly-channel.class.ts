import { Subscription } from '../event-emitters';
import { ProbeManager } from '../probes';
import { AuguryEventAssembler } from './assemblers';
import { ChannelManager } from './channel-manager.class';
import { Channel } from './channel.class';

export class AssemblyChannel<Output> extends Channel<Output> {
  constructor(
    manager: ChannelManager,
    private probeManager: ProbeManager,
    private assembler: AuguryEventAssembler<Output>,
  ) {
    super(manager);
  }

  public subscribe(handleOutput: (output: Output) => void): Subscription {
    return this.probeManager.subscribe(event => {
      const isDone = this.assembler.process(event);

      if (isDone) {
        const output = this.assembler.finish();

        if (output) {
          handleOutput(output);
        }
      }
    });
  }
}
