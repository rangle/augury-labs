import { ChannelManager } from '../channels';
import { EventDispatcher } from '../dispatcher';
import { AuguryEvent } from '../events';
import { HistoryManager } from '../history';
import { ProbeManager } from '../probes';

export interface ReactionContext {
  event: AuguryEvent;
  eventDispatcher: EventDispatcher;
  channelManager: ChannelManager;
  probeManager: ProbeManager;
  historyManager: HistoryManager;
}
