import { Command, CommandResult } from '../framework/commands';
import { ReactionResults } from '../framework/reactions';

export interface SubscribeToLastElapsedCycleCommandRequestParameters {
  testParam: string;
}

export class SubscribeToLastElapsedCycleCommand extends Command<
  SubscribeToLastElapsedCycleCommandRequestParameters
> {
  constructor() {
    super('subscribe-to-last-elapsed-cycle', 'subscribeToLastElapsedCycle', true);
  }

  public parseReactions(results: ReactionResults): CommandResult {
    return { success: true, channel: results['create-last-elapsed-cycle-channel'].channel };
  }
}
