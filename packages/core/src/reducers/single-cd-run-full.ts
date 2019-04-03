import { Reducer } from '../framework/reducers';

export class SingleCDRunFull extends Reducer {
  public static initState() {
    return {
      result: undefined,
      auxiliary: {
        lastComponentTree: undefined,
        nextComponentTree: undefined,
        lifecycleHooksTriggered: [] as any[],
      },
    };
  }

  constructor(private startEventId: number, private endEventId: number) {
    super();
  }

  public deriveShallowState({ nextEvent, prevShallowState = SingleCDRunFull.initState() }) {
    // we're only interested in a single CD run
    if (prevShallowState.result) {
      return prevShallowState;
    }

    // grab the last component tree before CD
    if (nextEvent.id < this.startEventId && nextEvent.name === 'onStable') {
      return {
        result: prevShallowState.result,
        auxiliary: {
          lastComponentTree: nextEvent.payload.componentTree,
          nextComponentTree: prevShallowState.auxiliary.nextComponentTree,
          lifecycleHooksTriggered: prevShallowState.auxiliary.lifecycleHooksTriggered,
        },
      };
    }

    // grab every lifecycle trigger event within the start/end eids
    if (
      nextEvent.id >= this.startEventId &&
      nextEvent.id <= this.endEventId &&
      nextEvent.name === 'component_lifecycle_hook_invoked'
    ) {
      return {
        result: prevShallowState.result,
        auxiliary: {
          lastComponentTree: prevShallowState.auxiliary.lastComponentTree,
          nextComponentTree: prevShallowState.auxiliary.nextComponentTree,
          lifecycleHooksTriggered: prevShallowState.auxiliary.lifecycleHooksTriggered.concat([
            nextEvent,
          ]),
        },
      };
    }

    // grab the first component tree after CD, and we're done
    if (
      nextEvent.id >= this.endEventId &&
      nextEvent.name === 'onStable' &&
      !prevShallowState.auxiliary.nextComponentTree
    ) {
      return {
        result: {
          lastComponentTree: prevShallowState.auxiliary.lastComponentTree,
          nextComponentTree: nextEvent.payload.componentTree,
          lifecycleHooksTriggered: prevShallowState.auxiliary.lifecycleHooksTriggered,
        },
        auxiliary: SingleCDRunFull.initState().auxiliary,
      };
    }

    return prevShallowState;
  }
}
