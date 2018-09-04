'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const utils_1 = require('../utils')
const DEEP_INIT = {
  shallow: undefined,
  deps: {},
  lastEvent: undefined,
}
// @todo: types!
//        how to bring in the reducer state shape?
class Reducer {
  constructor() {
    this.dependencies = {}
  }
  // @todo: result type
  static getResultFromState(state) {
    if (!state) return undefined
    const shallow = state.shallow
    if (!shallow) return undefined
    return shallow.result
  }
  // @todo: rename all Dep to Dependencies
  static getDepResults(depState) {
    return utils_1
      .objToPairs(depState)
      .map(({ k: depName, v: depState }) => ({
        k: depName,
        v: Reducer.getResultFromState(depState),
      }))
      .reduce((nextDepState, { k, v }) => utils_1.merge(nextDepState, { [k]: v }), {})
  }
  deriveState(prevState = DEEP_INIT, event) {
    const nextDepState = this.deriveDepState(prevState.deps, event)
    // @todo: can we do this better?
    function resetDependency(depName) {
      nextDepState[depName] = undefined
    }
    const nextShallowState = this.deriveShallowState({
      nextEvent: event,
      nextDepResults: Reducer.getDepResults(nextDepState),
      prevEvent: prevState.lastEvent,
      prevShallowState: prevState.shallow,
      prevDepResults: Reducer.getDepResults(prevState.deps),
      resetDependency, // @todo: can we do this better?
    })
    return { shallow: nextShallowState, deps: nextDepState, lastEvent: event }
  }
  assumption(name, assertion) {
    if (!assertion) throw new Error(`${this.constructor.name} assumption broken: ${name}`)
  }
  deriveDepState(prevDepState = {}, agEvent) {
    return utils_1
      .objToPairs(this.dependencies)
      .map(({ k: name, v: reducer }) => ({
        name,
        state: this.dependencies[name].deriveState(prevDepState[name], agEvent),
      }))
      .reduce((nextDepState, { name, state }) => utils_1.merge(nextDepState, { [name]: state }), {})
  }
}
exports.Reducer = Reducer
//# sourceMappingURL=reducer.js.map
