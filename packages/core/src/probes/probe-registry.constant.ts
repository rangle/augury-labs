import { Probe } from '../framework/probes';
import { ComponentHooksProbe } from './component-hooks-probe';
import { ModuleMethodsProbe } from './module-methods-probe';
import { NgDebugProbe } from './ng-debug-probe';
import { NgZoneProbe } from './ng-zone-probe';
import { RootZoneProbe } from './root-zone-probe';

export const probeRegistry: Probe[] = [
  new RootZoneProbe(),
  new NgZoneProbe(),
  new NgDebugProbe(),
  new ComponentHooksProbe(),
  new ModuleMethodsProbe(),
];
