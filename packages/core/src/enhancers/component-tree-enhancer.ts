import { AuguryEvent, Enhancer, ProbeService } from '../framework';
import { NgDebugProbe } from '../probes';

export const addComponentTree: Enhancer = (event: AuguryEvent, probes: ProbeService) => {
  const ngDebugProbe = probes.get(NgDebugProbe) as NgDebugProbe;

  // @todo: event names registry / enum
  if (ngDebugProbe && event.name === 'onStable') {
    event.payload.componentTree = ngDebugProbe.getComponentTree();
  }

  return event;
};
