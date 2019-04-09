import { ProbeManager } from '../probes';
import { AuguryEventProjection } from '../projections';
import { AuguryEventAssembler } from './assemblers';
import { AssemblyChannel } from './assembly-channel.class';
import { Channel } from './channel.class';
import { ProbeChannel } from './probe-channel.class';

export class ChannelManager {
  private channels: Array<Channel<any>> = [];

  public createSimpleChannel(
    probeManager: ProbeManager,
    projection: AuguryEventProjection<any>,
  ): Channel<any> {
    return this.addChannel(new ProbeChannel(this, probeManager, projection));
  }

  public createAssemblyChannel(
    probeManager: ProbeManager,
    assembler: AuguryEventAssembler<any>,
  ): Channel<any> {
    return this.addChannel(new AssemblyChannel(this, probeManager, assembler));
  }

  public removeChannel(channelToRelease: Channel<any>) {
    this.channels = this.channels.filter(channel => channel !== channelToRelease);
  }

  private addChannel(channel: Channel<any>): Channel<any> {
    this.channels.push(channel);

    return channel;
  }
}
