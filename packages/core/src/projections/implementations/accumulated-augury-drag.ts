import { Reducer } from '../reducer.class';

const INIT_STATE = {
  result: 0,
};

// @todo: rename to CurrentNgZoneTaskReducer (because this is public api, should be clear)
export class AccumulatedAuguryDragReducer extends Reducer {
  public deriveShallowState({ prevShallowState = INIT_STATE, lastElapsedEvent }) {
    const { result: prevResult } = prevShallowState;

    if (!lastElapsedEvent) {
      return prevShallowState;
    }

    return { result: prevResult + lastElapsedEvent.getAuguryDrag() };
  }
}
