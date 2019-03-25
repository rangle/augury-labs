import { Scanner } from '../scanner';
import { Channel } from './channel';
import { ChannelDelegate } from './channel-delegate';
import { ScannerChannel } from './scanner-channel';

export class ChannelService {
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
