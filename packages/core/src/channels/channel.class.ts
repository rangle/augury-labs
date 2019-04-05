import { Subscription } from '../event-emitters';
import { ChannelManager } from './channel-manager.class';

export abstract class Channel<EventType> {
  protected constructor(private readonly manager: ChannelManager) {}

  public abstract subscribe(handler: (event: EventType) => void): Subscription;

  public shutdown(): void {
    this.manager.removeChannel(this);
  }
}
