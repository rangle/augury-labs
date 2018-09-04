import { SimpleEventEmitter } from '../utils'
import { AuguryEvent } from '../events/augury-event'

export type DispatcherEvents = SimpleEventEmitter<AuguryEvent>
