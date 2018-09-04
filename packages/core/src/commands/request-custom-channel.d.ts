import { Command, CommandRequest, CommandResult } from '../framework/commands'
import { Reducer } from '../framework/reducers'
export declare const requestCustomChannel: Command<
  CommandRequest<{
    reducer: Reducer
    startFromEID?: number
    untilEID?: number
  }>,
  CommandResult
>
