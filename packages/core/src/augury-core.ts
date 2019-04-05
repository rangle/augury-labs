import { ChannelManager } from './channels';
import { HistoryManager } from './history';
import { PluginManager } from './plugins';
import { Plugin } from './plugins';
import { Probe, ProbeManager } from './probes';
import { AuguryEventProjection, Reducer } from './projections';
import { Scanner } from './scanner';

export class AuguryCore {
  public readonly historyManager: HistoryManager;
  private readonly probeManager: ProbeManager;
  private readonly channelManager: ChannelManager;
  private readonly pluginManager: PluginManager;

  constructor(probes: Probe[], plugins: Plugin[], ngZone, ngModule) {
    this.probeManager = new ProbeManager(probes, ngZone, ngModule);
    this.channelManager = new ChannelManager();
    this.historyManager = new HistoryManager();
    this.pluginManager = new PluginManager(plugins, this);
    this.probeManager.subscribe(event => this.historyManager.addEvent(event));
  }

  public createLiveChannel(reducer: Reducer) {
    const scanner = new Scanner(reducer, this.historyManager);
    scanner.scan(this.probeManager);

    return this.channelManager.createScannerChannel(scanner);
  }

  public createChannel(projection: AuguryEventProjection<any>) {
    return this.channelManager.createProbeChannel(this.probeManager, projection);
  }
}
