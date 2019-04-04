import { Scanner } from '../scanner';
import { Channel } from './channel.class';
import { ScannerChannel } from './scanner-channel.class';

export class ChannelManager {
  private channels: Array<Channel<any>> = [];

  public createScannerChannel(scanner: Scanner): Channel<any> {
    const channel = new ScannerChannel<any>(scanner, this);

    this.channels.push(channel);

    return channel;
  }

  public releaseDeadChannel(channelToRelease: Channel<any>) {
    this.channels = this.channels.filter(channel => channel !== channelToRelease);
  }
}
