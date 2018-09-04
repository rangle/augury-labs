import { AuguryEvent } from '../events'
export declare type ShallowState =
  | undefined
  | {
      result?: any
      [key: string]: any
    }
export interface DependencyStates {
  [dependencyName: string]: DeepState | undefined
}
export interface DependencyResults {
  [dependencyName: string]: any
}
export declare type DeepState =
  | undefined
  | {
      shallow?: ShallowState
      deps: DependencyStates
      lastEvent?: AuguryEvent
    }
