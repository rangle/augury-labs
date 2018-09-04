import { AuguryEvent, Enhancer, ProbeService } from '../framework'
import { NgDebugProbe } from '../probes'

export const addComponentTree: Enhancer = (e: AuguryEvent, probes: ProbeService) => {
  const ngDebugProbe = probes.get(NgDebugProbe)

  // @todo: event names registry / enum
  if (ngDebugProbe && e.name === 'onStable')
    e.payload.componentTree = ngDebugProbe.getComponentTree()

  return e
}
