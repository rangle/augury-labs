import { ReactionRegistry } from '../framework/reactions'

import { createLiveChannel } from './create-live-channel'
import { scanHistory } from './scan-history'

export const reactionRegistry: ReactionRegistry = [scanHistory, createLiveChannel]
