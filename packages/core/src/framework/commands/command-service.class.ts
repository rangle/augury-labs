import { CallableAPIConstructor } from './callable-api.interface';
import { CommandRegistry } from './command-registry.type';
import { CommandRequest } from './command-request.interface';
import { CommandResult } from './command-result.interface';
import { Command } from './command.interface';

import { EventDispatcher } from '../dispatcher';
import { createEvent } from '../events';
import { kebabToCamel, merge } from '../utils';

export class CommandService {
  constructor(private dispatcher: EventDispatcher, private commands: CommandRegistry) {}

  public run(request: CommandRequest<any>): CommandResult {
    const command = this.commands.find(foundCommand => foundCommand.name === request.name);

    if (!command) {
      return { success: false, errors: ['action not found'] };
    }

    const commandEvent = createEvent(request.source, command.name, request.args);

    const { reactionResults } = this.dispatcher.dispatchImmediatelyAndReturn(commandEvent);

    return command.parseReactions(reactionResults);
  }

  public pluginAPIConstructor() {
    const pluginCommands = this.commands.filter(command => command.availableToPlugins);
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
