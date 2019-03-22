import { Reducer } from '../framework/reducers';

const INIT_STATE = {
  result: undefined,
};

export class LastElapsedEventReducer extends Reducer {
  public deriveShallowState({ prevShallowState = INIT_STATE, lastElapsedEvent }) {
    return { result: lastElapsedEvent || undefined };
  }
}
