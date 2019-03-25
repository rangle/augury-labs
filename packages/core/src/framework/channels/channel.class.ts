import { Emittable } from '../event-emitters';
import { ChannelDelegate } from './channel-delegate.interface';

export abstract class Channel {
  public abstract type: string;
  public abstract shutdown(): void;
  public abstract events(): Emittable<any>;

  public createDelegate(didShutdown: (channel: this) => void): ChannelDelegate {
    return {
      events: this.events(),
      kill: () => {
        this.shutdown();
        didShutdown(this);
      },
    };
  }
}
