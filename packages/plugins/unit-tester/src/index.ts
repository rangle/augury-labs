import { LastElapsedCDReducer, Plugin } from '@augury/core';

declare const window;

export class UnitTesterPlugin extends Plugin {
  public doInitialize() {
    window.auguryUT = {};

    let cdChannel: any;
    let cdRuns: any = [];

    window.auguryUT.startMonitoringChangeDetection = () => {
      cdChannel = this.getAugury().createLiveChannel(new LastElapsedCDReducer());
      cdChannel.subscribe(lastElapsedCD => {
        cdRuns.push(lastElapsedCD);
      });
    };

    window.auguryUT.finishMonitoringChangeDetection = () => {
      const result = {
        cdRuns: cdRuns.map(cdRun => ({
          // @todo: rename drag to auguryDrag
          runtime: cdRun.endTimestamp - cdRun.startTimestamp - cdRun.drag,
        })),
      };

      cdChannel.kill();
      cdChannel = undefined;
      cdRuns = [];

      return result;
    };
  }
}
