import { AuguryEvent } from '../events'
import { ProbeService } from '../probes'
export declare type Enhancer = (event: AuguryEvent, probes: ProbeService) => AuguryEvent
