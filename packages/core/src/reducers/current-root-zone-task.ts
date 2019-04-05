import { Reducer } from '../framework/reducers';

const INIT_STATE = {
  result: undefined,
};

// @todo: merge rootzone task and ngzone task reducers (pass zone name in constructor args)
export class CurrentRootZoneTaskReducer extends Reducer {
  public deriveShallowState({ prevShallowState = INIT_STATE, nextEvent }) {
    if (nextEvent.name === 'root_task_executing') {
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

    if (nextEvent.name === 'root_task_completed') {
      return { result: undefined };
    }

    return prevShallowState;
  }
}
