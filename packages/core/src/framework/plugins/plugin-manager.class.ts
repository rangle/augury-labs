import { CommandService } from '../commands';
import { Plugin } from './plugin.class';

export class PluginManager {
  private readonly plugins: Plugin[] = [];

  constructor(private commandService: CommandService) {}

  public addPlugin(plugin: Plugin) {
    this.plugins.push(plugin);

    plugin.initialize(this.commandService);
  }

  public addPlugins(plugins: Plugin[]) {
    plugins.forEach(plugin => this.addPlugin(plugin));
  }
}
