import { Command } from './command';

// @todo: (types) how to get the individual command types?
export type CommandRegistry = Array<Command<any, any>>;
