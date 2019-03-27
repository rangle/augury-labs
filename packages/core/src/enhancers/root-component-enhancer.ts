import { AuguryEvent, Enhancer, ProbeManager } from '../framework';
import { NgDebugProbe } from '../probes';

// @todo: this should be in core: event types
const ComponentHookEvent = 'component_lifecycle_hook_invoked';

export const addRootComponent: Enhancer = (event: AuguryEvent, probeManager: ProbeManager) => {
  const ngDebugProbe = probeManager.get(NgDebugProbe) as NgDebugProbe;

  // @todo: event names registry / enum
  if (ngDebugProbe && event.name === ComponentHookEvent) {
    event.payload.rootComponentInstance = ngDebugProbe.getRootComponent(); // @todo: using instance
  }

  return event;
};
