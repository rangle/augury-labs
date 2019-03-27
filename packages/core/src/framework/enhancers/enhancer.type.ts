import { AuguryEvent } from '../events';
import { ProbeManager } from '../probes';

export type Enhancer = (event: AuguryEvent, probes: ProbeManager) => AuguryEvent;
