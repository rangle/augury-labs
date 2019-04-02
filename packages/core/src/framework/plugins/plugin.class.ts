import { CommandApi, CommandResult, CommandService } from '../commands';
import { EventSource } from '../events';

// @todo: definitions such as this should exist separate from rest of core package.
//        because plugins extending this class dont need to bring in the rest of core into their bundle.
//        otherwise we could end up with 2 versions of the core in the final app bundle

export abstract class Plugin {
  private commandApi: CommandApi | null = null;

  public initialize(commandService: CommandService): void {
    this.commandApi = commandService.createCommandApi(this.getEventSource());

    this.doInitialize();
  }

  public abstract doInitialize(): void;

  public run(methodName: string, parameters): CommandResult {
    if (!this.commandApi) {
      throw new Error('The command api for this plugin has not been initialized');
    }

    return this.commandApi.run(methodName, parameters);
  }

  private getEventSource(): EventSource {
    return {
      type: 'plugin',
      name: this.constructor.name,
    };
  }
}
