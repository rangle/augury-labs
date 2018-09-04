'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const reducers_1 = require('../framework/reducers')
const INIT_STATE = {
  result: undefined,
}
class CurrentCDReducer extends reducers_1.Reducer {
  deriveShallowState({ prevShallowState = INIT_STATE, nextEvent }) {
    if (nextEvent.name === 'component_lifecycle_hook_invoked') {
      this.assumption(
        'lifecycle events contain root component',
        !!nextEvent.payload.rootComponentInstance,
      )
      const rootComponent = nextEvent.payload.rootComponentInstance
      const eventComponent = nextEvent.payload.componentInstance
      if (eventComponent === rootComponent) {
        if (nextEvent.payload.hook === 'ngDoCheck')
          return {
            result: {
              startEID: nextEvent.id,
              startTime: nextEvent.creationAtPerformanceStamp,
            },
          }
        if (nextEvent.payload.hook === 'ngAfterViewChecked') return { result: undefined }
      }
    }
    return prevShallowState
  }
}
exports.CurrentCDReducer = CurrentCDReducer
//# sourceMappingURL=current-cd.js.map
