import { AuguryEvent } from '../events'

// @todo: types

export interface ShallowState/*<ResultType>*/ {
  result?: any
  [key: string]: any
}

export interface DependencyStates {
  [dependencyName: string]: DeepState | undefined
}

export interface DependencyResults {
  [dependencyName: string]: any
}

export interface DeepState/*<ResultType>*/ {
  shallow?: ShallowState
  deps: DependencyStates
  lastEvent?: AuguryEvent
}