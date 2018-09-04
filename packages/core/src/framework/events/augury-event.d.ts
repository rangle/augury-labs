import { ReactionResults } from '../reactions'
export interface EventSource {
  type: 'action' | 'reaction' | 'probe' | 'plugin'
  name: string
}
export interface EventPayload {
  [key: string]: any
}
export declare type EventName = string
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
