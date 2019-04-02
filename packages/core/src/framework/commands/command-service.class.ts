import { Command } from './command.class';

import { EventDispatcher } from '../dispatcher';
import { EventSource } from '../events';
import { CommandApi } from './command-api.class';

export class CommandService {
  constructor(private dispatcher: EventDispatcher, private commands: Array<Command<any>>) {}

  public createCommandApi(source: EventSource): CommandApi {
    return new CommandApi(this.getAllPluginCommands(), this.dispatcher, source);
  }

  private getAllPluginCommands() {
    return this.commands.filter(command => command.availableToPlugins);
  }
}
