import { Reducer } from '../reducer.class';

const INIT_STATE = {
  result: undefined,
};

export class CurrentCDReducer extends Reducer {
  public deriveShallowState({ prevShallowState = INIT_STATE, nextEvent }) {
    if (nextEvent.name === 'component_lifecycle_hook_invoked') {
      this.assumption(
        'lifecycle events contain root component',
        !!nextEvent.payload.rootComponentInstance,
      );

      const rootComponent = nextEvent.payload.rootComponentInstance;
      const eventComponent = nextEvent.payload.componentInstance;

      if (eventComponent === rootComponent) {
        if (nextEvent.payload.hook === 'ngDoCheck') {
          return {
            result: {
              startEventId: nextEvent.id,
              startTimestamp: nextEvent.creationAtTimestamp,
            },
          };
        }

        if (nextEvent.payload.hook === 'ngAfterViewChecked') {
          return { result: undefined };
        }
      }
    }

    return prevShallowState;
  }
}
