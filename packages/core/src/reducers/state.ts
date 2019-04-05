import { AuguryEvent } from '../events';

// @todo: types

export type ShallowState /*<ResultType>*/ =
  | undefined
  | {
      result?: any;
      [key: string]: any;
    };

export interface DependencyStates {
  [dependencyName: string]: DeepState | undefined;
}

export interface DependencyResults {
  [dependencyName: string]: any;
}

export type DeepState =
  | undefined
  | {
      shallow?: ShallowState;
      deps: DependencyStates;
      lastEvent?: AuguryEvent;
    };
