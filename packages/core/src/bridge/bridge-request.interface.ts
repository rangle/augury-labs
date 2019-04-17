import { BridgeRequestType } from './bridge-request-type.type';

export interface BridgeRequest {
  type: BridgeRequestType;
  startEventId: number;
  endEventId: number;
}
