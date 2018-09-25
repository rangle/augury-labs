import { Command, CommandRequest, CommandResult } from '../framework/commands'
import { Reducer } from '../framework/reducers'

export const requestHistoryScan: Command<
  CommandRequest<any>,
  CommandResult // @todo:command result types
> = {
  name: 'request-history-scan',
  methodName: 'scanHistory',
  availableToPlugins: true,
  parseReactions(reactionResults) {
    const { success = false, result } = reactionResults['scan-history'] || {}

    return { success, result }
  },
}
