import { LastElapsedCDReducer, Plugin } from '@augury/core';

declare const window;

export class UnitTesterPlugin extends Plugin {
  public doInitialize() {
    window.auguryUT = {};

    let cdChannel: any;
    let cdRuns: any = [];

    window.auguryUT.startMonitoringChangeDetection = () => {
      cdChannel = this.run('createLiveChannel', {
        reducer: new LastElapsedCDReducer(),
      }).channel;

      cdChannel.events.subscribe(lastElapsedCD => {
        cdRuns.push(lastElapsedCD);
      });
    };

    window.auguryUT.finishMonitoringChangeDetection = () => {
      console.log(cdRuns);

      const result = {
        cdRuns: cdRuns.map(cdRun => ({
          // @todo: rename drag to auguryDrag
          runtime: cdRun.finishPerformanceStamp - cdRun.startPerformanceStamp - cdRun.drag,
        })),
      };

      cdChannel.kill();
      cdChannel = undefined;
      cdRuns = [];

      return result;
    };
  }
}
