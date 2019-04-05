import { Subscription } from '../event-emitters';
import { AuguryEvent } from '../events';
import { ProbeManager } from '../probes';
import { AuguryEventProjection } from '../projections';
import { ChannelManager } from './channel-manager.class';
import { Channel } from './channel.class';

export class ProbeChannel extends Channel<AuguryEvent> {
  constructor(
    manager: ChannelManager,
    private probeManager: ProbeManager,
    private projection: AuguryEventProjection<any>,
  ) {
    super(manager);
  }

  public subscribe<Output>(handler: (event: Output) => void): Subscription {
    return this.probeManager.subscribe(event => handler(this.projection.transform(event)));
  }
}
