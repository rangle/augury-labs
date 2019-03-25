import { ReactionRegistry } from '../framework/reactions';

import { CreateLiveChannelReaction } from './create-live-channel-reaction.class';
import { ScanHistoryReaction } from './scan-history-reaction.class';

export const reactionRegistry: ReactionRegistry = [
  new ScanHistoryReaction(),
  new CreateLiveChannelReaction(),
];
