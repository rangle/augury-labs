export interface ReactionResult {
  success: boolean
  errors?: any[]
  [reactionSpecificKey: string]: any
}
