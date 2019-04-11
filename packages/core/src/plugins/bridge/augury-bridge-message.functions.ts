import { AuguryBridgeMessageType } from './augury-bridge-message-type.type';
import { AuguryBridgeMessage } from './augury-bridge-message.interface';

function messageMatchesType(message: AuguryBridgeMessage<any>, types: AuguryBridgeMessageType[]) {
  return types.includes(message.type);
}

export function isTimelineMessage(message: AuguryBridgeMessage<any>): boolean {
  return messageMatchesType(message, ['task', 'instability-period', 'change-detection']);
}

export function isDragMessage(message: AuguryBridgeMessage<any>): boolean {
  return messageMatchesType(message, ['drag']);
}
