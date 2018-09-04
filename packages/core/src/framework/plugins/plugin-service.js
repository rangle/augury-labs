'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
// @todo: add plugin hooks
class PluginService {
  constructor(commands) {
    this.commands = commands
    this.plugins = []
    this.callableAPI = this.commands.pluginAPIConstructor()
  }
  add(plugins) {
    if (Array.isArray(plugins)) plugins.forEach(plugin => this.addSingle(plugin))
    else this.addSingle(plugins)
  }
  addSingle(plugin) {
    this.plugins.push(plugin)
    const eventSource = {
      type: 'plugin',
      name: plugin.name(),
    }
    plugin.init(this.callableAPI(eventSource))
  }
}
exports.PluginService = PluginService
//# sourceMappingURL=plugin-service.js.map
