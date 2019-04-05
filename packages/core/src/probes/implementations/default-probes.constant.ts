import { Probe } from '../probe.class';
import { ComponentHooksProbe } from './component-hooks-probe.class';
import { ModuleMethodsProbe } from './module-methods-probe.class';
import { NgZoneProbe } from './ng-zone-probe.class';
import { RootZoneProbe } from './root-zone-probe.class';

export const defaultProbes: Probe[] = [
  new RootZoneProbe(),
  new NgZoneProbe(),
  new ComponentHooksProbe(),
  new ModuleMethodsProbe(),
];
