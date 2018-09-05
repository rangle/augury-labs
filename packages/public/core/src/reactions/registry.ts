import { ReactionRegistry } from '../framework/reactions'

import { createChannelFromReducer } from './create-channel-from-reducer'
import { createLastElapsedCycleChannel } from './create-last-elapsed-cycle-channel'

export const reactionRegistry: ReactionRegistry = [
  createLastElapsedCycleChannel,
  createChannelFromReducer,
]
