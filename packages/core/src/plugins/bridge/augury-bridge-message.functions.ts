import { AuguryBridgeMessageType } from './augury-bridge-message-type.type';
import { AuguryBridgeMessage } from './augury-bridge-message.interface';

function messageMatchesType(message: AuguryBridgeMessage, types: AuguryBridgeMessageType[]) {
  return types.includes(message.type);
}

export function isTimelineMessage(message: AuguryBridgeMessage): boolean {
  return messageMatchesType(message, ['task', 'cycle', 'cd']);
}

export function isDragMessage(message: AuguryBridgeMessage): boolean {
  return messageMatchesType(message, ['drag']);
}
