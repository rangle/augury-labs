import { Command } from './command.interface';

// @todo: (types) how to get the individual command types?
export type CommandRegistry = Array<Command<any, any>>;
