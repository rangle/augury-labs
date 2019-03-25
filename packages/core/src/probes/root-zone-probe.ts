import { Probe } from '../framework/probes';

declare const Zone;

export class RootZoneProbe extends Probe {
  private rootZone;

  public beforeNgBootstrap() {
    // @todo: assuming executing in root zone. should be moving up parent chain.
    const rootZone = Zone.current;
    const ZoneDelegate = rootZone._zoneDelegate.constructor;

    const probe = this;

    rootZone._zoneDelegate = new ZoneDelegate(rootZone, rootZone._zoneDelegate, {
      onInvokeTask(delegate, current, target, task, applyThis, applyArgs) {
        probe.emit('root_task_executing', { task });

        try {
          return delegate.invokeTask(target, task, applyThis, applyArgs);
        } finally {
          probe.emit('root_task_completed', { task });
        }
      },
    });

    this.rootZone = rootZone;
  }
}
