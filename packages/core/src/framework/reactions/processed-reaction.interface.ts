import { ReactionResult } from './reaction-result.interface';

export interface ProcessedReaction {
  reactionName: string;
  result: ReactionResult | undefined;
}
