import { merge, kebabToCamel } from '../utils'
import { AuguryEvent, createEvent } from '../events'
import { EventDispatcher } from '../dispatcher'
import { Command } from './command'
import { CommandRequest } from './command-request'
import { CommandResult } from './command-result'
import { CommandRegistry } from './command-registry'
import { CallableAPIConstructor } from './callable-api'

export class CommandService {
  constructor(private dispatcher: EventDispatcher, private registry: CommandRegistry) {}

  run(request: CommandRequest<any>): CommandResult {
    const command = this.registry.find(command => command.name === request.name)

    if (!command) return { success: false, errors: ['action not found'] }

    const commandEvent = createEvent(request.source, command.name, request.args)

    const { reactionResults } = this.dispatcher.dispatchImmediatelyAndReturn(commandEvent)

    return command.parseReactions(reactionResults)
  }

  pluginAPIConstructor() {
    const pluginCommands = this.registry.filter(command => command.availableToPlugins)
    return this.callableAPIConstructorFrom(pluginCommands)
  }

  // @todo:command types
  private callableAPIConstructorFrom(commands: Array<Command<any, any>>): CallableAPIConstructor {
    const methodName = (command: Command<any, any>) =>
      command.methodName ? command.methodName : kebabToCamel(command.name)

    return source =>
      commands.reduce(
        (callableAPI, command) =>
          merge(callableAPI, {
            [methodName(command)]: (args?) =>
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
