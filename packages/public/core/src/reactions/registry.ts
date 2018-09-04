import { ReactionRegistry } from '../framework/reactions'

import { createLastElapsedCycleChannel } from './create-last-elapsed-cycle-channel'
import { createChannelFromReducer } from './create-channel-from-reducer'

export const reactionRegistry: ReactionRegistry = [
  createLastElapsedCycleChannel,
  createChannelFromReducer,
]
