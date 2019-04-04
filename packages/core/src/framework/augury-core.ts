import { ChannelManager } from './channels';
import { HistoryManager } from './history';
import { PluginManager } from './plugins';
import { Plugin } from './plugins';
import { EventDispatcher, Probe } from './probes';
import { Reducer } from './reducers';
import { Scanner } from './scanner';

export class AuguryCore {
  public readonly dispatcher: EventDispatcher;
  public readonly channelManager: ChannelManager;
  public readonly historyManager: HistoryManager;
  private readonly pluginManager: PluginManager;

  constructor(probes: Probe[], plugins: Plugin[]) {
    this.dispatcher = new EventDispatcher(probes);
    this.channelManager = new ChannelManager();
    this.historyManager = new HistoryManager();
    this.pluginManager = new PluginManager(plugins, this);

    this.dispatcher.subscribe(event => {
      event.markComplete();

      this.historyManager.addEvent(event);
    });
  }

  public initialize(ngZone, ngModule) {
    this.dispatcher.initialize(ngZone, ngModule);

    return this;
  }

  public createLiveChannel(reducer: Reducer) {
    const scanner = new Scanner(reducer, this.historyManager);
    scanner.scan(this.dispatcher);

    return this.channelManager.createScannerChannel(scanner);
  }
}
