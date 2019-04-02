import { EventDispatcher } from '../dispatcher';
import { EventSource } from '../events';
import { CommandResult } from './command-result.interface';
import { Command } from './command.class';

export class CommandApi {
  private commands: Map<string, (parameters?) => CommandResult> = new Map<
    string,
    (parameters?) => CommandResult
  >();

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
    if (this.commands.has(methodName)) {
      const method = this.commands.get(methodName);

      if (method) {
        return method(parameters);
      }
    }

    throw new Error(`A command api called '${methodName}' does not exist`);
  }
}
