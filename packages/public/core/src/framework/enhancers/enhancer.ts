import { AuguryEvent } from '../events'
import { ProbeService } from '../probes'

export type Enhancer = (event: AuguryEvent, probes: ProbeService) => AuguryEvent
