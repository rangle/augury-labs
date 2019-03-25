import { CallableAPIConstructor, CommandService } from '../commands';
import { EventSource } from '../events';
import { Plugin } from './plugin.class';

// @todo: add plugin hooks

export class PluginService {
  private plugins: Plugin[] = [];
  private readonly callableAPI: CallableAPIConstructor;

  constructor(private commands: CommandService) {
    this.callableAPI = this.commands.pluginAPIConstructor();
  }

  public add(plugins: Plugin | Plugin[]) {
    if (Array.isArray(plugins)) {
      plugins.forEach(plugin => this.addSingle(plugin));
    } else {
      this.addSingle(plugins);
    }
  }

  private addSingle(plugin: Plugin) {
    this.plugins.push(plugin);

    const eventSource: EventSource = {
      type: 'plugin',
      name: plugin.name(),
    };

    plugin.init(this.callableAPI(eventSource));
  }
}
