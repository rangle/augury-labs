import { ReactionResult } from './reaction-result';

export interface ProcessedReaction {
  reactionName: string;
  result: ReactionResult | undefined;
}
