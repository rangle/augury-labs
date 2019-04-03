import { EventDispatcher } from '../dispatcher';
import { EventSource } from '../events';
import { CommandResult } from './command-result.interface';
import { Command } from './command.class';

type RunCommandFunctionType = (parameters?) => CommandResult;

export class CommandApi {
  private commands: Map<string, RunCommandFunctionType> = new Map<string, RunCommandFunctionType>();

  constructor(
    commands: Array<Command<any>>,
    dispatcher: EventDispatcher,
    eventSource: EventSource,
  ) {
    commands.forEach(command =>
      this.commands.set(command.methodName, parameters =>
        command.run(dispatcher, eventSource, parameters),
      ),
    );
  }

  public run(methodName: string, parameters?): CommandResult {
    const method = this.commands.get(methodName);

    if (method) {
      return method(parameters);
    } else {
      throw new Error(`A command api called '${methodName}' does not exist`);
    }
  }
}
