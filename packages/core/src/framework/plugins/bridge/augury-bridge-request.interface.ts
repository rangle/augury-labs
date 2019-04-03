import { AuguryBridgeRequestType } from './augury-bridge-request-type.type';

export interface AuguryBridgeRequest {
  type: AuguryBridgeRequestType;
  startEventId: number;
  endEventId: number;
}
