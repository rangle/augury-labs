import { ProcessedReaction } from './processed-reaction.interface';
import { ReactionContext } from './reaction-context.interface';
import { ReactionResult } from './reaction-result.interface';

export abstract class Reaction {
  protected constructor(private name: string) {}

  public react(context: ReactionContext): ProcessedReaction {
    return {
      reactionName: this.name,
      result: this.doReact(context),
    };
  }

  public abstract doReact(context: ReactionContext): ReactionResult | undefined;
}
