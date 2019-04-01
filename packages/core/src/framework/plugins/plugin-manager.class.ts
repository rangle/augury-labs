import { CallableAPIConstructor, CommandService } from '../commands';
import { EventSource } from '../events';
import { Plugin } from './plugin.class';

// @todo: add plugin hooks

export class PluginManager {
  private plugins: Plugin[] = [];
  private readonly callableAPI: CallableAPIConstructor;

  constructor(private commands: CommandService) {
    this.callableAPI = this.commands.pluginAPIConstructor();
  }

  public addPlugin(plugin: Plugin) {
    this.plugins.push(plugin);

    const eventSource: EventSource = {
      type: 'plugin',
      name: plugin.name(),
    };

    plugin.init(this.callableAPI(eventSource));
  }

  public addPlugins(plugins: Plugin[]) {
    plugins.forEach(plugin => this.addPlugin(plugin));
  }
}
