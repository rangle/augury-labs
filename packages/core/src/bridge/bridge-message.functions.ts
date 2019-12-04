import { BridgeMessageType } from './bridge-message-type.type';
import { BridgeMessage } from './bridge-message.interface';

function messageMatchesType(message: BridgeMessage, types: BridgeMessageType[]) {
  return types.includes(message.type);
}

export function isTimelineMessage(message: BridgeMessage): boolean {
  return messageMatchesType(message, ['task', 'instability-period', 'change-detection']);
}

export function isDragMessage(message: BridgeMessage): boolean {
  return messageMatchesType(message, ['drag']);
}
