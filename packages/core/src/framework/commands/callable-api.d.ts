import { EventSource } from '../events'
import { CommandResult } from './command-result'
export interface CallableAPI {
  [camelCaseCommandName: string]: (args?: any) => CommandResult
}
export declare type CallableAPIConstructor = (source: EventSource) => CallableAPI
