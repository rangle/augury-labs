import { CommandRegistry } from '../framework/commands'

import { requestCustomChannel } from './request-custom-channel'
import { subscribeToLastElapsedCycle } from './subscribe-to-last-elapsed-cycle'

export const commandRegistry: CommandRegistry = [subscribeToLastElapsedCycle, requestCustomChannel]
