import { Reducer } from '../reducer.class';

const INIT_STATE = { result: true };

export class IsStableReducer extends Reducer {
  public deriveShallowState({ prevShallowState = INIT_STATE, nextEvent }) {
    // @todo: event enum
    if (nextEvent.name === 'onUnstable') {
      return { result: false };
    }

    if (nextEvent.name === 'onStable') {
      return { result: true };
    }

    return prevShallowState;
  }
}
