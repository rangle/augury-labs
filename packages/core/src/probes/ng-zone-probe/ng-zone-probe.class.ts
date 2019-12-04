import {
  ZoneStabilizedEvent,
  ZoneTaskCompletedEvent,
  ZoneTaskInvokedEvent,
  ZoneUnstabilizedEvent,
} from '../../events/zone';
import { Probe } from '../probe.class';
import { getComponentTree } from '../types/component-tree-node';

export class NgZoneProbe extends Probe {
  private ngZone;

  public doInitialize(ngZone, ngModule) {
    if (ngZone._augury_instrumented_) {
      throw new Error('ngZone is already instrumented.');
    }

    // @todo: probe should emit error then shut down gracefully.
    //        we should probably have a probe-standard error state query
    //        2 types of error: shutdown and emit warning

    const probe = this;

    ngZone._inner = ngZone._inner.fork({
      onInvokeTask: (delegate, current, target, task, applyThis, applyArgs) => {
        probe.emit(() => new ZoneTaskInvokedEvent(task));

        try {
          return delegate.invokeTask(target, task, applyThis, applyArgs);
        } finally {
          probe.emit(() => new ZoneTaskCompletedEvent(task));
        }
      },
    });

    ngZone.onStable.subscribe(() => probe.emit(() => new ZoneStabilizedEvent(getComponentTree())));
    ngZone.onUnstable.subscribe(() => probe.emit(() => new ZoneUnstabilizedEvent()));
    ngZone._augury_instrumented_ = true;

    this.ngZone = ngZone;
  }
}
