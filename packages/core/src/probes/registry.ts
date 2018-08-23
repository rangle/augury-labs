import { ProbeRegistry } from '../framework/probes/probe-registry'

import { RootZoneProbe } from './root-zone'
import { NgZoneProbe } from './ng-zone'
import { NgDebugProbe } from './ng-debug'
import { ComponentHooksProbe } from './component-hooks'
import { ModuleMethodsProbe } from './module-methods'

export const probeRegistry: ProbeRegistry
  = [
    RootZoneProbe,
    NgZoneProbe,
    NgDebugProbe,
    ComponentHooksProbe,
    ModuleMethodsProbe
  ]