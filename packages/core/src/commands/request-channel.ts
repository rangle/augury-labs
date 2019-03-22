import { Command, CommandRequest, CommandResult } from '../framework/commands';
import { Reducer } from '../framework/reducers';

// @todo: command classes. it will help to overload the parameter types,
//        since the command class can take care of them in the constructor.
//        in this case, we can just pass a reducer directly, if we dont want any other opts
export const requestLiveChannel: Command<
  CommandRequest<{
    reducer: Reducer;
    startFromEID?: number;
    untilEID?: number;
  }>,
  CommandResult // @todo:command result types
> = {
  name: 'request-live-channel',
  methodName: 'createLiveChannel',
  availableToPlugins: true,
  parseReactions(reactionResults) {
    const { channel } = reactionResults['create-live-channel'];

    return { success: true, channel };
  },
};
