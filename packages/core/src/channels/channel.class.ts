import { Subscription } from '../event-emitters';
import { ChannelManager } from './channel-manager.class';

export abstract class Channel<Output> {
  protected constructor(private readonly manager: ChannelManager) {}

  public abstract subscribe(handleOutput: (output: Output) => void): Subscription;

  public shutdown(): void {
    this.manager.removeChannel(this);
  }
}
