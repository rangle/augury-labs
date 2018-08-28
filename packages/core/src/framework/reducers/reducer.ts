import { AuguryEvent } from '../events'
import { objToPairs, merge } from '../utils'

// @todo: these types
export interface ShallowStateDerivationParams {
  nextEvent: AuguryEvent
  nextDepResults
  prevEvent: AuguryEvent | null
  prevShallowState
  prevDepResults
  // @todo: can we do this better?
  resetDependency: (depName: string) => void
}

// @todo: types
export interface ShallowState {
  result?: any,
  auxiliary?: { [key: string]: any }
}

const DEEP_INIT = {
  shallow: undefined,
  deps: {},
  lastEvent: null,
}

// @todo: types!
//        how to bring in the reducer state shape?
export abstract class Reducer {

  static getResultFromState(state) {
    if (!state) return undefined
    const shallow = state.shallow
    if (!shallow) return undefined
    return shallow.result
  }

  static getDepResults(depState) {
    return objToPairs(depState)
      .map(({ k: depName, v: depState }) => ({ k: depName, v: Reducer.getResultFromState(depState) }))
      .reduce((nextDepState, { k, v }) => merge(nextDepState, { [k]: v }), {})
  }

  dependencies = {}

  abstract deriveShallowState(params: ShallowStateDerivationParams): any

  public deriveState(prevState = DEEP_INIT, event: AuguryEvent) {

    const nextDepState = this.deriveDepState(prevState.deps, event)

    // @todo: can we do this better?
    function resetDependency(depName) { nextDepState[depName] = undefined }

    const nextShallowState = this.deriveShallowState({
      nextEvent: event,
      nextDepResults: Reducer.getDepResults(nextDepState),
      prevEvent: prevState.lastEvent,
      prevShallowState: prevState.shallow,
      prevDepResults: Reducer.getDepResults(prevState.deps),
      resetDependency// @todo: can we do this better?
    })

    return { shallow: nextShallowState, deps: nextDepState, lastEvent: event }
  }

  protected assumption(name: string, assertion) {
    if (!assertion) throw new Error(`${this.constructor.name} assumption broken: ${name}`)
  }

  private deriveDepState(prevDepState = {}, agEvent: AuguryEvent) {
    return objToPairs(this.dependencies)
      .map(({ k: name, v: reducer }) => ({
        name,
        state: this.dependencies[name].deriveState(prevDepState[name], agEvent),
      }))
      .reduce((nextDepState, { name, state }) => merge(nextDepState, { [name]: state }), {})
  }
}