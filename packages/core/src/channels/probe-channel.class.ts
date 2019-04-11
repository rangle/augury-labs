import { Subscription } from '../event-emitters';
import { ProbeManager } from '../probes';
import { AuguryEventProjection } from '../projections';
import { ChannelManager } from './channel-manager.class';
import { Channel } from './channel.class';

export class ProbeChannel<Output> extends Channel<Output> {
  constructor(
    manager: ChannelManager,
    private probeManager: ProbeManager,
    private projection: AuguryEventProjection<Output>,
  ) {
    super(manager);
  }

  public subscribe(handleOutput: (output: Output) => void): Subscription {
    return this.probeManager.subscribe(event => {
      const output = this.projection.transform(event);

      if (output) {
        handleOutput(output);
      }
    });
  }
}
