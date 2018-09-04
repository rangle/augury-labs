'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const reducers_1 = require('../framework/reducers')
const INIT_STATE = { result: true }
class IsStableReducer extends reducers_1.Reducer {
  deriveShallowState({ prevShallowState = INIT_STATE, nextEvent }) {
    // @todo: event enum
    if (nextEvent.name === 'onUnstable') return { result: false }
    if (nextEvent.name === 'onStable') return { result: true }
    return prevShallowState
  }
}
exports.IsStableReducer = IsStableReducer
//# sourceMappingURL=is-stable.js.map
