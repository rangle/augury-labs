import { CommandRegistry } from '../framework/commands';

import { requestLiveChannel } from './request-channel';
import { requestHistoryScan } from './request-history-scan';

export const commandRegistry: CommandRegistry = [requestLiveChannel, requestHistoryScan];
