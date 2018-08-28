import { AuguryEvent } from '../events'
import { SyncEventEmitter } from '../utils'
import { Reducer } from '../reducers'

export class Scanner {

  // @todo: types, how do we get the reducer types in here?
  public emitter = new SyncEventEmitter<any>()

  private subscription
  private lastReducerState

  constructor(
    private reducer: Reducer,
  ) { }

  scan(emitter: SyncEventEmitter<AuguryEvent>) {
    this.subscription = emitter.subscribe(ae => {
      const nextReducerState = this.reducer.deriveState(this.lastReducerState, ae)
      const nextResult = Reducer.getResultFromState(nextReducerState)
      const prevResult = Reducer.getResultFromState(this.lastReducerState)

      if (nextResult !== prevResult)
        this.emitter.emit(nextResult)

      this.lastReducerState = nextReducerState
    })
  }

  stop() {
    this.subscription.unsubscribe()
  }

  reset() {
    this.stop()
    this.lastReducerState = undefined
  }
}
