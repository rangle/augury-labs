import { AuguryEvent } from '../events'
import { objToPairs, merge } from '../utils'

// @todo: these types
export interface ShallowStateDerivationParams {
  nextEvent: AuguryEvent
  nextDepState
  prevEvent: AuguryEvent | null
  prevState
  prevDepState
  // @todo: can we do this better?
  resetDependency: (depName: string) => void
}

const DEEP_INIT = {
  shallow: undefined,
  deps: {},
  lastEvent: null,
}

// @todo: types!
//        how to bring in the reducer state shape?
export abstract class Reducer {

  dependencies = {}

  abstract deriveShallowState(params: ShallowStateDerivationParams) // @todo: return type

  public deriveState(prevState = DEEP_INIT, event: AuguryEvent) {

    const nextDepState = this.deriveDepState(prevState.deps, event)

    // @todo: can we do this better?
    function resetDependency(depName) { nextDepState[depName] = undefined }

    const nextShallowState = this.deriveShallowState({
      nextEvent: event,
      nextDepState: this.getShallowDepState(nextDepState),
      prevEvent: prevState.lastEvent,
      prevState: prevState.shallow,
      prevDepState: this.getShallowDepState(prevState.deps),
      resetDependency// @todo: can we do this better?
    })

    return { shallow: nextShallowState, deps: nextDepState, lastEvent: event }
  }

  protected assumption(name: string, assertion) {
    if (!assertion) throw new Error(`${this.constructor.name} assumption broken`)
  }

  // @todo: move this out, so reactors can use this too
  // @todo: if we used a Map(), we wouldnt have to use pair() and .reduce()
  private deriveDepState(prevDepState = {}, agEvent: AuguryEvent) {
    return objToPairs(this.dependencies)
      .map(({ k: name, v: reducer }) => ({
        name,
        state: this.dependencies[name].deriveState(prevDepState[name], agEvent),
      }))
      .reduce((nextDepState, { name, state }) => merge(nextDepState, { [name]: state }), {})
  }

  // @todo: either use a Map(), or generalize and put the pair().map().reduce() thing in utils
  private getShallowDepState(depState) {
    return objToPairs(depState)
      .map(({ k: depName, v: ds }) => ({ k: depName, v: ds ? ds.shallow : undefined }))
      .reduce((nextDepState, { k, v }) => merge(nextDepState, { [k]: v }), {})
  }
}