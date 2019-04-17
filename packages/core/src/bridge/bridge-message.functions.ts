import { BridgeMessageType } from './bridge-message-type.type';
import { BridgeMessage } from './bridge-message.interface';

function messageMatchesType(message: BridgeMessage<any>, types: BridgeMessageType[]) {
  return types.includes(message.type);
}

export function isTimelineMessage(message: BridgeMessage<any>): boolean {
  return messageMatchesType(message, ['task', 'instability-period', 'change-detection']);
}

export function isDragMessage(message: BridgeMessage<any>): boolean {
  return messageMatchesType(message, ['drag']);
}
