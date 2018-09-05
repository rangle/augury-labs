import { AuguryEvent } from '../events'
import { Reducer } from '../reducers'
import { SyncEventEmitter } from '../utils'

export class Scanner {
  // @todo: types, how do we get the reducer types in here?
  public emitter = new SyncEventEmitter<any>()

  private subscription
  private lastReducerState

  constructor(private reducer: Reducer) {}

  public scan(emitter: SyncEventEmitter<AuguryEvent>) {
    this.subscription = emitter.subscribe(ae => {
      const nextReducerState = this.reducer.deriveState(this.lastReducerState, ae)
      const nextResult = Reducer.getResultFromState(nextReducerState)
      const prevResult = Reducer.getResultFromState(this.lastReducerState)

      if (nextResult !== prevResult) {
        this.emitter.emit(nextResult)
      }

      this.lastReducerState = nextReducerState
    })
  }

  public stop() {
    this.subscription.unsubscribe()
  }

  public reset() {
    this.stop()
    this.lastReducerState = undefined
  }
}
