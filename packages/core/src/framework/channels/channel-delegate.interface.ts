import { Emittable } from '../event-emitters';

export interface ChannelDelegate {
  events: Emittable<any>;
  kill: () => void;
}
