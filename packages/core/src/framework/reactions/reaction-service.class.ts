import { ChannelService } from '../channels';
import { EventDispatcher } from '../dispatcher';
import { AuguryEvent } from '../events';
import { HistoryService } from '../history';
import { ProbeManager } from '../probes';
import { ReactionRegistry } from './reaction-registry.type';
import { ReactionResults } from './reaction-results.interface';

import { ProcessedReaction } from './processed-reaction.interface';

export class ReactionService {
  constructor(
    private probeManager: ProbeManager,
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
          probes: this.probeManager,
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
