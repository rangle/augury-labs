export interface ReactionResult {
  success: boolean,
  errors?: any[], // @todo: error type
  [reactionSpecificKey: string]: any // @todo: reaction-specific extensions
}