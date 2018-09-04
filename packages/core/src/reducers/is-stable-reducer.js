'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const reducers_1 = require('../framework/reducers')
const INIT_STATE = true
class IsStableReducer extends reducers_1.Reducer {
  deriveShallowState({ prevState = INIT_STATE, nextEvent }) {
    // @todo: event enum
    if (nextEvent.name === 'onUnstable') return false
    if (nextEvent.name === 'onStable') return true
    return prevState
  }
}
exports.IsStableReducer = IsStableReducer
//# sourceMappingURL=is-stable-reducer.js.map
