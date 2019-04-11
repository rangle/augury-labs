import { Reducer } from '../reducer.class';

const INIT_STATE = {
  result: undefined,
};

// @todo: rename to CurrentNgZoneTaskReducer (because this is public api, should be clear)
export class CurrentNgZoneTaskReducer extends Reducer {
  public deriveShallowState({ prevShallowState = INIT_STATE, nextEvent }) {
    if (nextEvent.name === 'onInvokeTask_executing') {
      this.assumption(
        'a `task` cannot begin until the previous one is complete',
        !prevShallowState.result,
      );

      return {
        result: {
          task: nextEvent.payload.task,
          startEventId: nextEvent.id,
          startTimestamp: nextEvent.creationAtTimestamp,
        },
      };
    }

    if (nextEvent.name === 'onInvokeTask_completed') {
      return { result: undefined };
    }

    return prevShallowState;
  }
}