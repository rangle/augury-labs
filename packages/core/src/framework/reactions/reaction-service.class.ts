import { ChannelManager } from '../channels';
import { EventDispatcher } from '../dispatcher';
import { AuguryEvent } from '../events';
import { HistoryService } from '../history';
import { ProbeManager } from '../probes';
import { ReactionResults } from './reaction-results.interface';

import { ProcessedReaction } from './processed-reaction.interface';
import { Reaction } from './reaction.class';

export class ReactionService {
  constructor(
    private probeManager: ProbeManager,
    private channelManager: ChannelManager,
    private reactions: Reaction[],
    private historyService: HistoryService,
  ) {}

  public reactTo(event: AuguryEvent, eventDispatcher: EventDispatcher): ReactionResults {
    return this.reactions
      .map(reaction =>
        reaction.react({
          event,
          eventDispatcher,
          channels: this.channelManager,
          probes: this.probeManager,
          history: this.historyService,
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
