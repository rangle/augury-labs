import { Channel } from './channel.class';

import { Subscription } from '../event-emitters';
import { Scanner } from '../scanner';
import { ChannelManager } from './channel-manager.class';

export class ScannerChannel<EventType> extends Channel<EventType> {
  constructor(manager: ChannelManager, private readonly scanner: Scanner) {
    super(manager);
  }

  public subscribe(handleEvent: (event: EventType) => void): Subscription {
    return this.scanner.emitter.subscribe(handleEvent);
  }

  public shutdown() {
    super.shutdown();

    this.scanner.stop();
  }
}
