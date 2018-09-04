import { ReactionResults } from '../reactions'
export interface Command<CommandRequest, CommandResult> {
  name: string
  methodName?: string
  availableToPlugins: boolean
  parseReactions(results: ReactionResults): CommandResult
  checkRequest?(request: CommandRequest): any
}
