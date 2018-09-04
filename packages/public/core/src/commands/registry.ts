import { CommandRegistry } from '../framework/commands'

import { subscribeToLastElapsedCycle } from './subscribe-to-last-elapsed-cycle'
import { requestCustomChannel } from './request-custom-channel'

export const commandRegistry: CommandRegistry = [subscribeToLastElapsedCycle, requestCustomChannel]
