import { ComponentHooksProbe } from './component-hooks-probe/component-hooks-probe.class';
import { NgZoneProbe } from './ng-zone-probe/ng-zone-probe.class';
import { Probe } from './probe.class';
import { RootZoneProbe } from './root-zone-probe/root-zone-probe.class';

export const defaultProbes: Probe[] = [
  new RootZoneProbe(),
  new NgZoneProbe(),
  new ComponentHooksProbe(),
];
