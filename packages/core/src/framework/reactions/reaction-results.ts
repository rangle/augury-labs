import { ReactionResult } from './reaction-result'

// @todo: how to type this well?
//        it should map each reaction name to its appropriate result type (or null)
// @todo: reaction name enums
export interface ReactionResults {
  [reactionName: string]: ReactionResult
}