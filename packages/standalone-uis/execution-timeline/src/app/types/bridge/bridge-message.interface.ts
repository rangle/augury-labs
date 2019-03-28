import { BridgeMessageType } from './bridge-message-type.type';

interface Event {
  startPerformanceStamp: number;
  finishPerformanceStamp: number;
  zone?: any;
}

export interface BridgeMessage {
  type: BridgeMessageType;
  lastElapsedTask?: Event;
  lastElapsedCycle?: Event;
  lastElapsedCD?: Event;
  start?: number;
  finish?: number;
  data?: any;
}
