import { ChannelManager } from '../channels';
import { EventDispatcher } from '../dispatcher';
import { AuguryEvent } from '../events';
import { HistoryManager } from '../history';
import { ProbeManager } from '../probes';
import { ReactionResults } from './reaction-results.interface';

import { ProcessedReaction } from './processed-reaction.interface';
import { Reaction } from './reaction.class';

export class ReactionService {
  constructor(
    private reactions: Reaction[],
    private probeManager: ProbeManager,
    private channelManager: ChannelManager,
    private historyManager: HistoryManager,
  ) {}

  public reactTo(event: AuguryEvent, eventDispatcher: EventDispatcher): ReactionResults {
    return this.reactions
      .map(reaction =>
        reaction.react({
          event,
          eventDispatcher,
          channels: this.channelManager,
          probes: this.probeManager,
          history: this.historyManager,
        }),
      )
      .reduce(
        (reactionResults, processedReaction) =>
          this.addToReactionResults(reactionResults, processedReaction),
        {} as ReactionResults,
      );
  }

  private addToReactionResults(
    reactionResults: ReactionResults,
    processedReaction: ProcessedReaction,
  ) {
    return processedReaction.result
      ? {
          ...reactionResults,
          [processedReaction.reactionName]: processedReaction.result,
        }
      : reactionResults;
  }
}
