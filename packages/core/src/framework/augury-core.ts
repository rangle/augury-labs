import { defaultCommands } from '../commands';
import { defaultEnhancers } from '../enhancers';
import { defaultProbes } from '../probes';
import { defaultReactions } from '../reactions';
import { ChannelManager } from './channels';
import { Command, CommandService } from './commands';
import { EventDispatcher } from './dispatcher';
import { Enhancer, EnhancerService } from './enhancers';
import { HistoryService } from './history';
import { Plugin, PluginManager } from './plugins';
import { Probe, ProbeManager } from './probes';
import { Reaction, ReactionService } from './reactions';

export interface BootstrapParams {
  platform: any;
  ngModule: any;
  NgZone: any;
  plugins: Plugin[];
}

export class AuguryCore {
  public static create(bootstrapParams: BootstrapParams) {
    const auguryCore = new AuguryCore(
      defaultProbes,
      defaultEnhancers,
      defaultReactions,
      defaultCommands,
    );

    (window as any).augury = auguryCore;

    return auguryCore.bootstrap(bootstrapParams);
  }

  private readonly dispatcher: EventDispatcher;
  private readonly probeManager: ProbeManager;
  private readonly enhancerService: EnhancerService;
  private readonly channelManager: ChannelManager;
  private readonly reactions: ReactionService;
  private readonly commandService: CommandService;
  private readonly pluginManager: PluginManager;
  private readonly history: HistoryService;

  constructor(
    probes: Probe[],
    enhancers: Enhancer[],
    reactions: Reaction[],
    commands: Array<Command<any, any>>,
  ) {
    this.probeManager = new ProbeManager(probes);
    this.enhancerService = new EnhancerService(this.probeManager, enhancers);
    this.channelManager = new ChannelManager();
    this.history = new HistoryService();
    this.reactions = new ReactionService(
      this.probeManager,
      this.channelManager,
      reactions,
      this.history,
    );
    this.dispatcher = new EventDispatcher(
      this.probeManager,
      this.enhancerService,
      this.reactions,
      this.history,
    );
    this.commandService = new CommandService(this.dispatcher, commands);
    this.pluginManager = new PluginManager(this.commandService);
  }

  public bootstrap({ platform, ngModule, NgZone, plugins }: BootstrapParams): Promise<any> {
    this.pluginManager.addPlugins(plugins);

    const ngZone = new NgZone({ enableLongStackTrace: true });

    this.probeManager.beforeNgBootstrapHook({
      ngZone,
      ngModule,
      Promise,
    });

    return platform()
      .bootstrapModule(ngModule, { ngZone })
      .then((moduleRef: any) => {
        this.probeManager.afterNgBootstrapHook(moduleRef);

        return moduleRef;
      });
  }
}
