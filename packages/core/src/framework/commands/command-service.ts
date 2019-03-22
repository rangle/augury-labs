import { CallableAPIConstructor } from './callable-api';
import { Command } from './command';
import { CommandRegistry } from './command-registry';
import { CommandRequest } from './command-request';
import { CommandResult } from './command-result';

import { EventDispatcher } from '../dispatcher';
import { createEvent } from '../events';
import { kebabToCamel, merge } from '../utils';

export class CommandService {
  constructor(private dispatcher: EventDispatcher, private registry: CommandRegistry) {}

  public run(request: CommandRequest<any>): CommandResult {
    const command = this.registry.find(foundCommand => foundCommand.name === request.name);

    if (!command) {
      return { success: false, errors: ['action not found'] };
    }

    const commandEvent = createEvent(request.source, command.name, request.args);

    const { reactionResults } = this.dispatcher.dispatchImmediatelyAndReturn(commandEvent);

    return command.parseReactions(reactionResults);
  }

  public pluginAPIConstructor() {
    const pluginCommands = this.registry.filter(command => command.availableToPlugins);
    return this.callableAPIConstructorFrom(pluginCommands);
  }

  // @todo:command types
  private callableAPIConstructorFrom(commands: Array<Command<any, any>>): CallableAPIConstructor {
    const methodName = (command: Command<any, any>) =>
      command.methodName ? command.methodName : kebabToCamel(command.name);

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
      );
  }
}
