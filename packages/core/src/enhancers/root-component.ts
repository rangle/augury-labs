import { AuguryEvent, Enhancer, ProbeService } from '../framework';
import { NgDebugProbe } from '../probes';

// @todo: this should be in core: event types
const COMPONENT_HOOK_EVENT = 'component_lifecycle_hook_invoked';

export const addRootComponent: Enhancer = (e: AuguryEvent, probes: ProbeService) => {
  const ngDebugProbe = probes.get(NgDebugProbe) as NgDebugProbe;

  // @todo: event names registry / enum
  if (ngDebugProbe && e.name === COMPONENT_HOOK_EVENT) {
    e.payload.rootComponentInstance = ngDebugProbe.getRootComponent(); // @todo: using instance
  }

  return e;
};
