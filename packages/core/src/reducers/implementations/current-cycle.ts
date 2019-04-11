import { Reducer } from '../reducer.class';
import { CurrentNgZoneTaskReducer } from './current-ng-zone-task';
import { IsStableReducer } from './is-stable';

const INIT_STATE = {
  result: undefined,
};

export class CurrentCycleReducer extends Reducer {
  public dependencies = {
    isStable: new IsStableReducer(),
    currentTask: new CurrentNgZoneTaskReducer(),
  };

  public deriveShallowState({
    prevShallowState = INIT_STATE,
    nextEvent,
    nextDepResults,
    prevDepResults,
  }) {
    const { isStable: nextIsStable, currentTask: nextTask } = nextDepResults;
    const { isStable: prevIsStable } = prevDepResults;

    // @definition: if we just became unstable, then we've entered a new cycle, thus started a new `job`
    if ((prevIsStable || prevIsStable === undefined) && !nextIsStable) {
      return {
        result: {
          startEventId: nextEvent.id,
          startTimestamp: nextEvent.creationAtTimestamp,
          job: nextTask,
        },
      };
    }

    // @definition if we've just become stable, we're done the `job`
    if (!prevIsStable && nextIsStable) {
      return { result: undefined };
    }

    return prevShallowState;
  }
}