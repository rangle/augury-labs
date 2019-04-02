import { Command, CommandResult } from '../framework/commands';
import { ReactionResults } from '../framework/reactions';
import { Reducer } from '../framework/reducers';

export interface RequestChannelCommandRequestParameters {
  reducer: Reducer;
  startFromEID?: number;
  untilEID?: number;
}

export class RequestLiveChannelCommand extends Command<RequestChannelCommandRequestParameters> {
  constructor() {
    super('request-live-channel', 'createLiveChannel', true);
  }

  public parseReactions(results: ReactionResults): CommandResult {
    return {
      success: true,
      channel: results['create-live-channel'].channel,
    };
  }
}
