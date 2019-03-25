import { ChannelService } from '../channels';
import { EventDispatcher } from '../dispatcher';
import { AuguryEvent } from '../events';
import { HistoryService } from '../history';
import { ProbeService } from '../probes';
import { ReactionRegistry } from './reaction-registry';
import { ReactionResults } from './reaction-results';

import { ProcessedReaction } from './processed-reaction.interface';

export class ReactionService {
  constructor(
    private probeService: ProbeService,
    private channels: ChannelService,
    private reactions: ReactionRegistry,
    private history: HistoryService,
  ) {}

  public reactTo(event: AuguryEvent, eventDispatcher: EventDispatcher): ReactionResults {
    return this.reactions
      .map(reaction =>
        reaction.react({
          event,
          eventDispatcher,
          channels: this.channels,
          probes: this.probeService,
          history: this.history,
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
