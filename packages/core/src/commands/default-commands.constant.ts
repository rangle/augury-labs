import { Command } from '../framework/commands';

import { RequestHistoryScanCommand } from './request-history-scan-command.class';
import { RequestLiveChannelCommand } from './request-live-channel-command.class';

export const defaultCommands: Array<Command<any>> = [
  new RequestLiveChannelCommand(),
  new RequestHistoryScanCommand(),
];
