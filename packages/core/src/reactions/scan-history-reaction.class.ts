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

      // @todo: SimpleEventEmitter.scan() should only require "subscribe()"
      //        so we dont need <any> here
      scanner.scan(context.history.emitter() as any);

      return {
        success: true,
        result: scanner.last(),
      };
    }
  }
}
