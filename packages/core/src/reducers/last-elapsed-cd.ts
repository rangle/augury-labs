import { Reducer } from '../framework/reducers'

import { CurrentCDReducer } from './current-cd'

const initState = () => ({
  result: undefined,
  auxiliary: {
    componentsChecked: [],
    c: new Map(),
    a: [] as Array<{ component; event; children }>,
    ci: 0,
    x: [] as any[],
    t: null as any,
  },
})

export class LastElapsedCDReducer extends Reducer {
  public dependencies = {
    currentCD: new CurrentCDReducer(),
  }

  public deriveShallowState({
    prevShallowState = initState(),
    nextEvent,
    nextDepResults,
    prevDepResults,
  }) {
    // @todo: generalize this logic ?
    const { currentCD: prevCD } = prevDepResults

    const { currentCD: nextCD } = nextDepResults

    const updatedComponentsChecked: any[] = prevShallowState.auxiliary.componentsChecked.concat([]) // copy, so we dont mutate original

    /*
        function getCurrentSlot(flameStructure, level) {
          let currentSubstructure = flameStructure
          while (level--) {
            const l = currentSubstructure.length
            if (!currentSubstructure[l - 1]) { debugger; return }
            currentSubstructure = currentSubstructure[l - 1].children
          }
          // assuming the level given takes us to the end of the graph
          return currentSubstructure
        }
    
        const updatedC = new Map(prevShallowState.auxiliary.c)
        const updatedA = prevShallowState.auxiliary.a.concat([])
        const updatedX = prevShallowState.auxiliary.x.concat([])
        let ci = prevShallowState.auxiliary.ci
        let cr = getCurrentSlot(updatedA, ci)
        let t = prevShallowState.auxiliary.t
    
        if (nextEvent.name === 'onStable') {
          t = nextEvent.payload.componentTree
        }
    
        if (t && nextEvent.name === 'component_lifecycle_hook_invoked') {
    
          debugger
    
          if (nextEvent.payload.hook === 'ngDoCheck') {
            cr.push({ component: nextEvent.payload.componentInstance, event: nextEvent, children: [] })
          }
    
          if (nextEvent.payload.hook === 'ngAfterContentChecked') {
            ci++
          }
    
          if (nextEvent.payload.hook === 'ngAfterViewChecked') {
            ci--
          }
    
          // upsert into map
          const entry = updatedC.get(nextEvent.payload.componentInstance)
            || (
              updatedC.set(nextEvent.payload.componentInstance, {})
              && updatedC.get(nextEvent.payload.componentInstance)
            )
    
          entry[nextEvent.payload.hook] = nextEvent
    
    
    
          console.log([nextEvent.payload.componentInstance, nextEvent.payload.hook])
          console.log(updatedC)
          console.log(updatedA)
        }
    
        */

    if (
      nextCD &&
      nextEvent.name === 'component_lifecycle_hook_invoked' &&
      nextEvent.payload.hook === 'ngDoCheck'
    ) {
      updatedComponentsChecked.push(nextEvent.payload.componentInstance)
    }

    if (prevCD && !nextCD) {
      return {
        result: {
          startEID: prevCD.startEID,
          endEID: nextEvent.id,
          startPerformanceStamp: prevCD.startTime,
          finishPerformanceStamp: nextEvent.creationAtPerformanceStamp,
          componentsChecked: updatedComponentsChecked,
        },
        auxiliary: initState().auxiliary,
      }
    }

    return {
      result: prevShallowState.result,
      auxiliary: {
        componentsChecked: updatedComponentsChecked,
        /*        
                c: updatedC,
                a: updatedA,
                ci,
                x: updatedX,
                t
        */
      },
    }
  }
}
