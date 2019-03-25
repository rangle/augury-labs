import { EventSource } from '../events';
import { CommandResult } from './command-result.interface';

export interface CallableAPI {
  // @todo: (types)command-specific args and result
  [camelCaseCommandName: string]: (args?: any) => CommandResult;
}

export type CallableAPIConstructor = (source: EventSource) => CallableAPI;
