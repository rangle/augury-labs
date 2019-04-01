import { ChannelManager } from '../channels';
import { EventDispatcher } from '../dispatcher';
import { AuguryEvent } from '../events';
import { HistoryService } from '../history';
import { ProbeManager } from '../probes';

export interface ReactionContext {
  event: AuguryEvent;
  eventDispatcher: EventDispatcher;
  channels: ChannelManager;
  probes: ProbeManager;
  history: HistoryService;
}
