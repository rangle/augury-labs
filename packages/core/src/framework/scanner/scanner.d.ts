import { AuguryEvent } from '../events'
import { SyncEventEmitter } from '../utils'
import { Reducer } from '../reducers'
export declare class Scanner {
  emitter: SyncEventEmitter<any>
  private reducer
  private subscription
  private lastReducerState
  constructor(reducer: Reducer)
  scan(emitter: SyncEventEmitter<AuguryEvent>): void
  stop(): void
  reset(): void
}
