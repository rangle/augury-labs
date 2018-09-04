import { SimpleEventEmitter } from '../utils'
import { AuguryEvent } from '../events'
import { ProbeService } from '../probes'
import { ChannelService } from '../channels'
import { SimpleDispatch } from '../dispatcher'
import { ReactionResult } from './reaction-result'

export interface Reaction {
  name: string
  react: (
    {
      event: AuguryEvent,
      dispatch: SimpleDispatch,
      dispatcherEvents: SimpleEventEmitter,
      channels: ChannelService,
      probes: ProbeService,
    },
  ) => ReactionResult | undefined
}
