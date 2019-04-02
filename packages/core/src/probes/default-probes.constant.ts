import { Probe } from '../framework/probes';
import { ComponentHooksProbe } from './component-hooks-probe.class';
import { ModuleMethodsProbe } from './module-methods-probe.class';
import { NgDebugProbe } from './ng-debug-probe.class';
import { NgZoneProbe } from './ng-zone-probe.class';
import { RootZoneProbe } from './root-zone-probe.class';

export const defaultProbes: Probe[] = [
  new RootZoneProbe(),
  new NgZoneProbe(),
  new NgDebugProbe(),
  new ComponentHooksProbe(),
  new ModuleMethodsProbe(),
];