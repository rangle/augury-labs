import { ProbeRegistry } from '../framework/probes/probe-registry'

import { NgZoneProbe } from './ng-zone'
import { NgDebugProbe } from './ng-debug'
import { ComponentHooksProbe } from './component-hooks'

export const probeRegistry: ProbeRegistry
  = [
    NgZoneProbe,
    NgDebugProbe,
    ComponentHooksProbe
  ]