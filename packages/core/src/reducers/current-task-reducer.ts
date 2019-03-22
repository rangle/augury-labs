import { Reducer } from '../framework/reducers';

const INIT_STATE = null;

export class CurrentTaskReducer extends Reducer {
  public deriveShallowState({ prevState = INIT_STATE, nextEvent }) {
    if (nextEvent.name === 'onInvokeTask_executing') {
      this.assumption('a `task` cannot begin until the previous one is complete', !prevState);

      return nextEvent.payload.task;
    }

    if (nextEvent.name === 'onInvokeTask_completed') {
      return null;
    }

    return prevState;
  }
}
