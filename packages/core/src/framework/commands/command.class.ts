import { EventDispatcher } from '../dispatcher';
import { createEvent, EventSource } from '../events';
import { ReactionResults } from '../reactions';
import { CommandResult } from './command-result.interface';

export abstract class Command<CommandRequestParameters> {
  protected constructor(
    public name: string,
    public methodName: string,
    public availableToPlugins: boolean,
  ) {}

  public run(
    dispatcher: EventDispatcher,
    source: EventSource,
    parameters: CommandRequestParameters,
  ): CommandResult {
    return this.parseReactions(
      dispatcher.dispatchImmediatelyAndReturn(createEvent(source, this.name, parameters))
        .reactionResults,
    );
  }

  public abstract parseReactions(results: ReactionResults): CommandResult;
}
