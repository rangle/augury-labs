import { ProbeRegistry } from '../framework/probes/probe-registry'

import { ComponentHooksProbe } from './component-hooks'
import { ModuleMethodsProbe } from './module-methods'
import { NgDebugProbe } from './ng-debug'
import { NgZoneProbe } from './ng-zone'
import { RootZoneProbe } from './root-zone'

export const probeRegistry: ProbeRegistry = [
  RootZoneProbe,
  NgZoneProbe,
  NgDebugProbe,
  ComponentHooksProbe,
  ModuleMethodsProbe,
]
