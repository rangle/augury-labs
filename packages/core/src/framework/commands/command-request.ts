import { EventSource } from '../events';

export type CommandName = string; // @todo: enum

export interface CommandRequest<ParamsType> {
  source: EventSource;
  name: string;
  args: ParamsType;
}
