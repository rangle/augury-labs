import { AuguryEvent } from '../events'
import { DeepState, ShallowState, DependencyResults, DependencyStates } from './state'
export interface ShallowStateDerivationParams {
  nextEvent: AuguryEvent
  nextDepResults: DependencyResults
  prevEvent?: AuguryEvent
  prevShallowState: ShallowState
  prevDepResults: DependencyResults
  resetDependency: (depName: string) => void
}
export abstract class Reducer {
  static getResultFromState(state: DeepState): any
  static getDepResults(depState: DependencyStates): DependencyResults
  dependencies: {}
  private deriveDepState
  abstract deriveShallowState(params: any): any
  deriveState(
    prevState: DeepState,
    event: AuguryEvent,
  ): {
    shallow: any
    deps: DependencyStates
    lastEvent: AuguryEvent
  }
  protected assumption(name: string, assertion: any): void
}
