import { Scanner } from '../scanner';
import { ChannelDelegate } from './channel-delegate.interface';
import { Channel } from './channel.class';
import { ScannerChannel } from './scanner-channel.class';

export class ChannelManager {
  private channels: Channel[] = [];

  public createFromScanner(scanner: Scanner): ChannelDelegate {
    const channel = new ScannerChannel(scanner);
    this.channels.push(channel);

    return channel.createDelegate(() => this.releaseDeadChannel(channel));
  }

  private releaseDeadChannel(channelToRelease: Channel) {
    this.channels = this.channels.filter(channel => channel !== channelToRelease);
  }
}
