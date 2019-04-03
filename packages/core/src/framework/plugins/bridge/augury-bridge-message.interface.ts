import { AuguryBridgeMessageType } from './augury-bridge-message-type.type';

interface Event {
  startPerformanceStamp: number;
  finishPerformanceStamp: number;
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
