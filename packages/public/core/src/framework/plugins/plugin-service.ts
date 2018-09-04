import { EventSource } from '../events'
import { CommandService, CallableAPIConstructor } from '../commands'
import { Plugin } from './plugin'

// @todo: add plugin hooks

export class PluginService {
  private plugins: Plugin[] = []
  private callableAPI: CallableAPIConstructor

  constructor(private commands: CommandService) {
    this.callableAPI = this.commands.pluginAPIConstructor()
  }

  add(plugins: Plugin | Plugin[]) {
    if (Array.isArray(plugins)) plugins.forEach(plugin => this.addSingle(plugin))
    else this.addSingle(plugins)
  }

  private addSingle(plugin: Plugin) {
    this.plugins.push(plugin)

    const eventSource: EventSource = {
      type: 'plugin',
      name: plugin.name(),
    }

    plugin.init(this.callableAPI(eventSource))
  }
}
