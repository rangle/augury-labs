import { Reducer } from '../framework/reducers'

export class CurrentCDReducer extends Reducer {
  deriveShallowState({ prevState, nextEvent }) {

    if (nextEvent.name === 'component_lifecycle_hook_invoked') {

      this.assumption(
        'lifecycle events contain root component',
        !!nextEvent.payload.rootComponentInstance
      )

      const rootComponent = nextEvent.payload.rootComponentInstance
      const eventComponent = nextEvent.payload.componentInstance

      if (eventComponent === rootComponent) {

        if (nextEvent.payload.hook === 'ngDoCheck')
          return {
            startEID: nextEvent.id,
            startTime: nextEvent.creationAtPerformanceStamp
          }

        if (nextEvent.payload.hook === 'ngAfterViewChecked')
          return undefined

      }

    }

    return prevState

  }
}
