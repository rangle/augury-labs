import { DeepState, DependencyResults, DependencyStates, ShallowState } from './state'

import { AuguryEvent } from '../events'
import { merge, objToPairs } from '../utils'

// @todo: these types
export interface ShallowStateDerivationParams {
  nextEvent: AuguryEvent
  nextDepResults: DependencyResults

  prevEvent?: AuguryEvent
  prevShallowState: ShallowState
  prevDepResults: DependencyResults

  // @todo: can we do this better?
  resetDependency: (depName: string) => void
}

const DEEP_INIT = {
  shallow: undefined,
  deps: {},
  lastEvent: undefined,
}

// @todo: types!
//        how to bring in the reducer state shape?
export abstract class Reducer {
  // @todo: result type
  public static getResultFromState(state: DeepState): any {
    if (!state) {
      return undefined
    }
    const shallow = state.shallow
    if (!shallow) {
      return undefined
    }
    return shallow.result
  }

  // @todo: rename all Dep to Dependencies
  public static getDepResults(depState: DependencyStates): DependencyResults {
    return objToPairs(depState)
      .map(({ k: pairDepName, v: pairDepState }) => ({
        k: pairDepName,
        v: Reducer.getResultFromState(pairDepState),
      }))
      .reduce((nextDepState, { k, v }) => merge(nextDepState, { [k]: v }), {})
  }

  public dependencies = {}

  // @todo: stuff stops working when apply types..
  public abstract deriveShallowState(params: any): any

  public deriveState(prevState: DeepState = DEEP_INIT, event: AuguryEvent) {
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

  protected assumption(name: string, assertion) {
    if (!assertion) {
      throw new Error(`${this.constructor.name} assumption broken: ${name}`)
    }
  }

  private deriveDepState(
    prevDepState: DependencyStates = {},
    agEvent: AuguryEvent,
  ): DependencyStates {
    return objToPairs(this.dependencies)
      .map(({ k: name, v: reducer }) => ({
        name,
        state: this.dependencies[name].deriveState(prevDepState[name], agEvent),
      }))
      .reduce((nextDepState, { name, state }) => merge(nextDepState, { [name]: state }), {})
  }
}
