import {
  ChangeDetectionInfo,
  ChangeDetectionInfoProjection,
  Plugin,
  Subscription,
} from '@augury/core';

declare const window;

export class UnitTesterPlugin extends Plugin {
  public doInitialize() {
    window.auguryUT = {};

    let subscription: Subscription;
    let cdRuns: ChangeDetectionInfo[] = [];

    window.auguryUT.startMonitoringChangeDetection = () => {
      subscription = this.getAugury().projectRealTimeEvents<ChangeDetectionInfo>(
        new ChangeDetectionInfoProjection(),
        changeDetectionInfo => {
          cdRuns.push(changeDetectionInfo);
        },
      );
    };

    window.auguryUT.finishMonitoringChangeDetection = () => {
      const result = {
        cdRuns: cdRuns.map(cdRun => ({
          // @todo: rename drag to auguryDrag
          runtime: cdRun.endTimestamp - cdRun.startTimestamp - cdRun.drag,
        })),
      };

      subscription.unsubscribe();
      cdRuns = [];

      return result;
    };
  }
}
