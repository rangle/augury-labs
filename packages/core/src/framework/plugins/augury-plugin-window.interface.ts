import { AuguryBridge } from './bridge';

export interface AuguryPluginWindow extends Window {
  bridge: AuguryBridge;
}
