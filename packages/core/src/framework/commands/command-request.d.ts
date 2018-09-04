import { EventSource } from '../events'
export declare type CommandName = string
export interface CommandRequest<ParamsType> {
  source: EventSource
  name: string
  args: ParamsType
}
