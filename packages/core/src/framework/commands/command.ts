import { ReactionResults } from '../reactions' 
import { CommandRequest } from './command-request'
import { CommandResult } from './command-result' 

export interface Command<CommandRequest, CommandResult> {
  name: string
  methodName?: string
  availableToPlugins: boolean
  parseReactions(results: ReactionResults): CommandResult
  checkRequest?(request: CommandRequest)
}