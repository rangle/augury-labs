import { SyncEventEmitter } from '@augury/core';

export interface PluginWindow extends Window {
  bridge: {
    in: SyncEventEmitter<any>;
    out: SyncEventEmitter<any>;
  };
}
