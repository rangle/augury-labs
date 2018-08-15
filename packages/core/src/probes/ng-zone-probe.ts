import { Probe } from '../framework/probes/probe'

export class NgZoneProbe extends Probe {
  // commands

  // queries

  // state
  // @question: where are we going to keep the event queue?
  //            feels like it's another probe that should handle dom events
  //            and that the logic should not be part of any probe
  // private detainJobs: boolean = false

  // target
  private ngZone

  beforeNgBootstrap({ ngZone }) {

    if (ngZone._augury_instrumented_)
      throw new Error('ngZone is already instrumented.')

    // @todo: probe should emit error then shut down gracefully.
    //       we should probably have a probe-standard error state query
    //       2 types of error: shutdown and emit warning

    const probe = this
    ngZone._inner = ngZone._inner.fork({
      onInvokeTask: (delegate, current, target, task, applyThis, applyArgs) => {
        probe.emit('onInvokeTask_invoked', { task })

        // detain here

        probe.emit('onInvokeTask_executing', { task })

        try {
          return delegate.invokeTask(target, task, applyThis, applyArgs)
        } finally {
          probe.emit('onInvokeTask_completed', { task })
        }
      },
    })

    ngZone.onStable.subscribe(_ => this.emit('onStable'))
    ngZone.onUnstable.subscribe(_ => this.emit('onUnstable'))
    ngZone._augury_instrumented_ = true
    
    this.ngZone = ngZone
  }
}
