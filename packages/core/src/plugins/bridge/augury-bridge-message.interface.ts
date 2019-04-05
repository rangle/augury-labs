import { AuguryBridgeMessageType } from './augury-bridge-message-type.type';

interface Event {
  startTimestamp: number;
  endTimestamp: number;
  zone?: any;
}

export interface AuguryBridgeMessage {
  type: AuguryBridgeMessageType;
  lastElapsedTask?: Event;
  lastElapsedCycle?: Event;
  lastElapsedCD?: Event;
  start?: number;
  finish?: number;
  data?: any;
}
