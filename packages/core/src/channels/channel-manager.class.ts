import { ProbeManager } from '../probes';
import { AuguryEventProjection } from '../projections';
import { Scanner } from '../scanner';
import { Channel } from './channel.class';
import { ProbeChannel } from './probe-channel.class';
import { ScannerChannel } from './scanner-channel.class';

export class ChannelManager {
  private channels: Array<Channel<any>> = [];

  public createProbeChannel(
    probeManager: ProbeManager,
    projection: AuguryEventProjection<any>,
  ): Channel<any> {
    return this.addChannel(new ProbeChannel(this, probeManager, projection));
  }

  public createScannerChannel(scanner: Scanner): Channel<any> {
    return this.addChannel(new ScannerChannel(this, scanner));
  }

  public addChannel(channel: Channel<any>): Channel<any> {
    this.channels.push(channel);

    return channel;
  }

  public removeChannel(channelToRelease: Channel<any>) {
    this.channels = this.channels.filter(channel => channel !== channelToRelease);
  }
}
