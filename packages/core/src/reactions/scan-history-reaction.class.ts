import { Reaction, ReactionResult } from '../framework/reactions';
import { ReactionContext } from '../framework/reactions/reaction-context.interface';
import { Scanner } from '../framework/scanner';

export class ScanHistoryReaction extends Reaction {
  constructor() {
    super('scan-history');
  }

  public doReact(context: ReactionContext): ReactionResult | undefined {
    if (context.event.name === 'request-history-scan') {
      const { reducer, startFromEID, untilEID } = context.event.payload;

      if (!reducer) {
        return { success: false, errors: ['reducer not given'] };
      }

      const scanner = new Scanner(reducer, context.history);

      scanner.scan(context.history.createSubscribable());

      return {
        success: true,
        result: scanner.last(),
      };
    }
  }
}
