import { RootTaskCompletedEvent, RootTaskInvokedEvent } from '../../events/zone';
import { Probe } from '../probe.class';

declare const Zone;

export class RootZoneProbe extends Probe {
  private rootZone;

  public doInitialize(ngZone, ngModule) {
    // @todo: assuming executing in root zone. should be moving up parent chain.
    const rootZone = Zone.current;
    const ZoneDelegate = rootZone._zoneDelegate.constructor;

    const probe = this;

    rootZone._zoneDelegate = new ZoneDelegate(rootZone, rootZone._zoneDelegate, {
      onInvokeTask(delegate, current, target, task, applyThis, applyArgs) {
        probe.emit(() => new RootTaskInvokedEvent(probe, task));

        try {
          return delegate.invokeTask(target, task, applyThis, applyArgs);
        } finally {
          probe.emit(() => new RootTaskCompletedEvent(probe, task));
        }
      },
    });

    this.rootZone = rootZone;
  }
}
