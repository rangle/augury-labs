import { Channel } from './channel.class';

import { Subscription } from '../event-emitters';
import { Scanner } from '../scanner';
import { ChannelManager } from './channel-manager.class';

export class ScannerChannel<EventType> extends Channel<EventType> {
  constructor(private readonly scanner: Scanner, private readonly manager: ChannelManager) {
    super('scanner');
  }

  public subscribe(handleEvent: (event: EventType) => void): Subscription {
    return this.scanner.emitter.subscribe(handleEvent);
  }

  public shutdown() {
    this.scanner.stop();
    this.manager.releaseDeadChannel(this);
  }
}
