import { AuguryBootstrapParameters } from './augury-bootstrap-parameters.interface';
import { ChannelManager } from './channels';
import { Command, CommandService } from './commands';
import { EventDispatcher } from './dispatcher';
import { Enhancer, EnhancerService } from './enhancers';
import { HistoryManager } from './history';
import { PluginManager } from './plugins';
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
    this.pluginManager = new PluginManager(this.commandService);
  }

  public bootstrap({
    platform,
    ngModule,
    NgZone,
    plugins,
  }: AuguryBootstrapParameters): Promise<any> {
    this.pluginManager.addPlugins(plugins);

    const ngZone = new NgZone({ enableLongStackTrace: true });

    this.probeManager.beforeNgBootstrapHook({
      ngZone,
      ngModule,
      Promise,
    });

    return platform()
      .bootstrapModule(ngModule, { ngZone })
      .then(moduleRef => {
        this.probeManager.afterNgBootstrapHook(moduleRef);

        return moduleRef;
      });
  }
}
