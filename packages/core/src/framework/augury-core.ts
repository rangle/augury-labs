import { ChannelService } from './channels';
import { CommandRegistry, CommandService } from './commands';
import { EventDispatcher } from './dispatcher';
import { EnhancerRegistry, EnhancerService } from './enhancers';
import { HistoryService } from './history';
import { Plugin, PluginService } from './plugins';
import { ProbeConstructor, ProbeService } from './probes';
import { ReactionRegistry, ReactionService } from './reactions';

export interface BootstrapParams {
  platform: any;
  ngModule: any;
  NgZone: any;
  plugins: Plugin[];
}

export class AuguryCore {
  private readonly dispatcher: EventDispatcher;

  private readonly probes: ProbeService;
  private readonly enhancers: EnhancerService;
  private readonly channels: ChannelService;
  private readonly reactions: ReactionService;
  private readonly commands: CommandService;
  private plugins: PluginService;
  private readonly history: HistoryService;

  constructor(
    probeConstructors: ProbeConstructor[],
    enhancerRegistry: EnhancerRegistry,
    reactionRegistry: ReactionRegistry,
    commandRegistry: CommandRegistry,
  ) {
    this.probes = new ProbeService(probeConstructors);
    this.enhancers = new EnhancerService(this.probes, enhancerRegistry);
    this.channels = new ChannelService();
    this.history = new HistoryService();
    this.reactions = new ReactionService(
      this.probes,
      this.channels,
      reactionRegistry,
      this.history,
    );
    this.dispatcher = new EventDispatcher(this.enhancers, this.reactions, this.history);
    this.commands = new CommandService(this.dispatcher, commandRegistry);
    this.plugins = new PluginService(this.commands);

    this.dispatcher.subscribeTo(this.probes.probeEvents);
  }

  public bootstrap({ platform, ngModule, NgZone, plugins }: BootstrapParams): Promise<any> {
    this.plugins.add(plugins);

    const ngZone = new NgZone({ enableLongStackTrace: true });

    this.probes.beforeNgBootstrapHook({
      ngZone,
      ngModule,
      Promise,
    });

    return platform()
      .bootstrapModule(ngModule, { ngZone })
      .then((moduleRef: any) => {
        this.probes.afterNgBootstrapHook(moduleRef);

        return moduleRef;
      });
  }
}
