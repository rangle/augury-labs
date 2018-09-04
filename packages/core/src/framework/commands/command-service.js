'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const utils_1 = require('../utils')
const events_1 = require('../events')
class CommandService {
  constructor(dispatcher, registry) {
    this.dispatcher = dispatcher
    this.registry = registry
  }
  run(request) {
    const command = this.registry.find(command => command.name === request.name)
    if (!command) return { success: false, errors: ['action not found'] }
    const commandEvent = events_1.createEvent(request.source, command.name, request.args)
    const { reactionResults } = this.dispatcher.dispatchImmediatelyAndReturn(commandEvent)
    return command.parseReactions(reactionResults)
  }
  pluginAPIConstructor() {
    const pluginCommands = this.registry.filter(command => command.availableToPlugins)
    return this.callableAPIConstructorFrom(pluginCommands)
  }
  // @todo:command types
  callableAPIConstructorFrom(commands) {
    const methodName = command =>
      command.methodName ? command.methodName : utils_1.kebabToCamel(command.name)
    return source =>
      commands.reduce(
        (callableAPI, command) =>
          utils_1.merge(callableAPI, {
            [methodName(command)]: args =>
              this.run({
                name: command.name,
                args,
                source,
              }),
          }),
        {},
      )
  }
}
exports.CommandService = CommandService
//# sourceMappingURL=command-service.js.map
