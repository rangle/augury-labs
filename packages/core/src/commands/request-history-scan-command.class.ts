import { Command, CommandResult } from '../framework/commands';
import { ReactionResults } from '../framework/reactions';

export class RequestHistoryScanCommand extends Command<any> {
  constructor() {
    super('request-history-scan', 'scanHistory', true);
  }

  public parseReactions(results: ReactionResults): CommandResult {
    const { success = false, result, errors } = results['scan-history'] || ({} as any);

    return { success, result, errors };
  }
}
