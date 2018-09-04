'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const utils_1 = require('../utils')
const reducers_1 = require('../reducers')
class Scanner {
  constructor(reducer) {
    this.reducer = reducer
    // @todo: types, how do we get the reducer types in here?
    this.emitter = new utils_1.SyncEventEmitter()
  }
  scan(emitter) {
    this.subscription = emitter.subscribe(ae => {
      const nextReducerState = this.reducer.deriveState(this.lastReducerState, ae)
      const nextResult = reducers_1.Reducer.getResultFromState(nextReducerState)
      const prevResult = reducers_1.Reducer.getResultFromState(this.lastReducerState)
      if (nextResult !== prevResult) this.emitter.emit(nextResult)
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
exports.Scanner = Scanner
//# sourceMappingURL=scanner.js.map
