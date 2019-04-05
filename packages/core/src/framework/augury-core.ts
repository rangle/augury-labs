import { ChannelManager } from './channels';
import { HistoryManager } from './history';
import { PluginManager } from './plugins';
import { Plugin } from './plugins';
import { EventDispatcher, Probe } from './probes';
import { Reducer } from './reducers';
import { Scanner } from './scanner';

export class AuguryCore {
  public readonly historyManager: HistoryManager;
  private readonly dispatcher: EventDispatcher;
  private readonly channelManager: ChannelManager;
  private readonly pluginManager: PluginManager;

  constructor(probes: Probe[], plugins: Plugin[], ngZone, ngModule) {
    this.dispatcher = new EventDispatcher(probes, ngZone, ngModule);
    this.channelManager = new ChannelManager();
    this.historyManager = new HistoryManager();
    this.pluginManager = new PluginManager(plugins, this);

    this.dispatcher.subscribe(event => {
      event.markComplete();

      this.historyManager.addEvent(event);
    });
  }

  public createLiveChannel(reducer: Reducer) {
    const scanner = new Scanner(reducer, this.historyManager);
    scanner.scan(this.dispatcher);

    return this.channelManager.createScannerChannel(scanner);
  }
}
