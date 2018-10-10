import { ChannelService } from '../channels'
import { SimpleDispatch } from '../dispatcher'
import { AuguryEvent } from '../events'
import { HistoryService } from '../history'
import { ProbeService } from '../probes'
import { SimpleEventEmitter, SyncEventEmitter } from '../utils'
import { ReactionResult } from './reaction-result'

export interface Reaction {
  name: string
  react: (
    reaction: {
      event: AuguryEvent
      dispatch: SimpleDispatch
      dispatcherEvents: SyncEventEmitter<AuguryEvent>
      channels: ChannelService
      probes: ProbeService
      history: HistoryService
    },
  ) => ReactionResult | undefined
}
