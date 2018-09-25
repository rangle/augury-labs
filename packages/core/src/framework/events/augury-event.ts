// @todo: is it antipattern to include this here?
//        should we be defining the post-processed event interface elsewhere?
import { ReactionResults } from '../reactions'

export interface EventSource {
  type: 'action' | 'reaction' | 'probe' | 'plugin'
  name: string
}

export interface EventPayload {
  [key: string]: any
}

export type EventName = string // @todo: enum?

export interface AuguryEvent {
  id: number
  payload: EventPayload
  creationAtPerformanceStamp: number
  name: EventName
  source: EventSource
}

export interface ProcessedAuguryEvent extends AuguryEvent {
  reactionResults: ReactionResults
}

export interface ElapsedAuguryEvent extends ProcessedAuguryEvent {
  auguryHandlingCompletionPerformanceStamp: number
  auguryDrag: number
}
