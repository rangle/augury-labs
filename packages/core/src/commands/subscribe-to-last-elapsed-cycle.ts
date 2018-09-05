import { Command, CommandRequest, CommandResult } from '../framework/commands'

export const subscribeToLastElapsedCycle: Command<
  CommandRequest<{ testParam: string }>,
  CommandResult // @todo:command result types
> = {
  name: 'subscribe-to-last-elapsed-cycle',
  availableToPlugins: true,
  parseReactions(reactionResults) {
    const { channel } = reactionResults['create-last-elapsed-cycle-channel']

    return { success: true, channel }
  },
}
