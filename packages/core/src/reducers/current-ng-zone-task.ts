import { Reducer } from '../framework/reducers';

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
          startEID: nextEvent.id,
          startPerfStamp: nextEvent.creationAtPerformanceStamp,
        },
      };
    }

    if (nextEvent.name === 'onInvokeTask_completed') {
      return { result: undefined };
    }

    return prevShallowState;
  }
}
