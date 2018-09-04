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
    }: {
      event: any
      dispatch: any
      dispatcherEvents: any
      channels: any
      probes: any
    },
  ) => ReactionResult | undefined
}
