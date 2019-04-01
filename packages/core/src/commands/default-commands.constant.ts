import { Command } from '../framework/commands';

import { requestLiveChannel } from './request-channel';
import { requestHistoryScan } from './request-history-scan';

export const defaultCommands: Array<Command<any, any>> = [requestLiveChannel, requestHistoryScan];
