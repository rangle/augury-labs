import { Reaction } from '../framework/reactions';

import { CreateLiveChannelReaction } from './create-live-channel-reaction.class';
import { ScanHistoryReaction } from './scan-history-reaction.class';

export const defaultReactions: Reaction[] = [
  new ScanHistoryReaction(),
  new CreateLiveChannelReaction(),
];
