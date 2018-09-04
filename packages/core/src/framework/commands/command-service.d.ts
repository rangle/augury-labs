import { EventDispatcher } from '../dispatcher'
import { CommandRequest } from './command-request'
import { CommandResult } from './command-result'
import { CommandRegistry } from './command-registry'
import { CallableAPIConstructor } from './callable-api'
export declare class CommandService {
  private dispatcher
  private registry
  private callableAPIConstructorFrom
  constructor(dispatcher: EventDispatcher, registry: CommandRegistry)
  run(request: CommandRequest<any>): CommandResult
  pluginAPIConstructor(): CallableAPIConstructor
}
