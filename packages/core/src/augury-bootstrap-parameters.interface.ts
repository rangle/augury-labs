import { Plugin } from './plugins';

export interface AuguryBootstrapParameters {
  platform: any;
  ngModule: any;
  NgZone: any;
  plugins: Plugin[];
}
