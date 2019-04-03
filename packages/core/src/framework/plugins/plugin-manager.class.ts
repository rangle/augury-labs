import { CommandService } from '../commands';
import { Plugin } from './plugin.class';

export class PluginManager {
  constructor(private readonly commandService: CommandService, private readonly plugins: Plugin[]) {
    this.addPlugins(plugins);
  }

  public addPlugins(plugins: Plugin[]) {
    plugins.forEach(plugin => this.addPlugin(plugin));
  }

  private addPlugin(plugin: Plugin) {
    this.plugins.push(plugin);

    plugin.initialize(this.commandService);
  }
}
