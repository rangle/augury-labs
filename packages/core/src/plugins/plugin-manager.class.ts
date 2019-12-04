import { AuguryCore } from '../augury-core.class';
import { Plugin } from './plugin.class';

export class PluginManager {
  constructor(private readonly plugins: Plugin[], private readonly augury: AuguryCore) {
    this.addPlugins(plugins);
  }

  public addPlugins(plugins: Plugin[]) {
    plugins.forEach(plugin => this.addPlugin(plugin));
  }

  private addPlugin(plugin: Plugin) {
    this.plugins.push(plugin);

    plugin.initialize(this.augury);
  }
}
