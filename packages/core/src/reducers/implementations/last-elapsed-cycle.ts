import { Reducer } from '../reducer.class';
import { AccumulatedAuguryDragReducer } from './accumulated-augury-drag';
import { CurrentCDReducer } from './current-cd';
import { CurrentCycleReducer } from './current-cycle';

const INIT_STATE = {
  result: undefined,
};

export class LastElapsedCycleReducer extends Reducer {
  public dependencies = {
    currentCycle: new CurrentCycleReducer(),
    currentCD: new CurrentCDReducer(),
    accumulatedAuguryDrag: new AccumulatedAuguryDragReducer(),
  };

  public deriveShallowState({
    prevShallowState = INIT_STATE,
    nextEvent,
    nextDepResults,
    prevDepResults,
    resetDependency,
  }) {
    const {
      currentCycle: nextCycle,
      currentCD: nextCD,
      accumulatedAuguryDrag: drag,
    } = nextDepResults;
    const { currentCycle: prevCycle, currentCD: prevCD } = prevDepResults;

    if (!prevCycle && nextCycle) {
      resetDependency('accumulatedAuguryDrag');
    }

    if (prevCycle && !nextCycle) {
      return {
        result: {
          // @todo: this shouldnt be here.
          //        it means this reducer has to know at what point
          //        component tree is a part of the event payload.
          componentTree: nextEvent.payload.componentTree,
          startEventId: prevCycle.startEventId,
          startTimestamp: prevCycle.startTimestamp,
          endEventId: nextEvent.id,
          endTimestamp: nextEvent.creationAtTimestamp, // @todo: not considering / measuring our own impact here.
          job: prevCycle.job,
          drag,
        },
      };
    }

    return prevShallowState;
  }
}
