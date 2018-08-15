import { ProbeRegistry } from '../framework/probes/probe-registry'

import { NgZoneProbe } from './ng-zone-probe'
import { NgDebugProbe } from './ng-app-debug-probe'
import { ComponentHooksProbe } from './component-hooks'

export const probeRegistry: ProbeRegistry
  = [
    NgZoneProbe,
    NgDebugProbe,
    ComponentHooksProbe
  ]