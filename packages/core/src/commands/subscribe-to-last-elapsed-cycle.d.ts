import { Command, CommandRequest, CommandResult } from '../framework/commands'
export declare const subscribeToLastElapsedCycle: Command<
  CommandRequest<{
    testParam: string
  }>,
  CommandResult
>
