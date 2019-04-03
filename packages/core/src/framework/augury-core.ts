import { ChannelManager } from './channels';
import { Command, CommandService } from './commands';
import { EventDispatcher } from './dispatcher';
import { Enhancer, EnhancerService } from './enhancers';
import { HistoryManager } from './history';
import { PluginManager } from './plugins';
import { Plugin } from './plugins';
import { Probe, ProbeManager } from './probes';
import { Reaction, ReactionService } from './reactions';

export class AuguryCore {
  private readonly dispatcher: EventDispatcher;
  private readonly probeManager: ProbeManager;
  private readonly enhancerService: EnhancerService;
  private readonly channelManager: ChannelManager;
  private readonly reactionService: ReactionService;
  private readonly commandService: CommandService;
  private readonly pluginManager: PluginManager;
  private readonly historyManager: HistoryManager;

  constructor(
    probes: Probe[],
    enhancers: Enhancer[],
    reactions: Reaction[],
    commands: Array<Command<any>>,
    plugins: Plugin[],
  ) {
    this.probeManager = new ProbeManager(probes);
    this.enhancerService = new EnhancerService(this.probeManager, enhancers);
    this.channelManager = new ChannelManager();
    this.historyManager = new HistoryManager();
    this.reactionService = new ReactionService(
      reactions,
      this.probeManager,
      this.channelManager,
      this.historyManager,
    );
    this.dispatcher = new EventDispatcher(
      this.probeManager,
      this.enhancerService,
      this.reactionService,
      this.historyManager,
    );
    this.commandService = new CommandService(this.dispatcher, commands);
    this.pluginManager = new PluginManager(this.commandService, plugins);
  }

  public initialize(ngZone, ngModule) {
    this.probeManager.initialize(ngZone, ngModule);

    return this;
  }
}
