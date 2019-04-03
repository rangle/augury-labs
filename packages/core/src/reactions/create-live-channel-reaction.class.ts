import { Reaction, ReactionResult } from '../framework/reactions';
import { ReactionContext } from '../framework/reactions/reaction-context.interface';
import { Scanner } from '../framework/scanner';

export class CreateLiveChannelReaction extends Reaction {
  constructor() {
    super('create-live-channel');
  }

  public doReact(context: ReactionContext): ReactionResult | undefined {
    if (context.event.name === 'request-live-channel') {
      const { reducer, startFromEID, untilEID } = context.event.payload;

      if (!reducer) {
        return { success: false, errors: ['reducer not given'] };
      }

      // @todo: currently not handling "start and until" because we dont have a history
      if (startFromEID || untilEID) {
        return { success: false, errors: ['historical data not yet supported'] };
      }

      const scanner = new Scanner(reducer, context.historyManager);

      scanner.scan(context.eventDispatcher.emitter);

      return {
        success: true,
        channel: context.channelManager.createFromScanner(scanner),
      };
    }
  }
}
