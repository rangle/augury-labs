import {
  Channel,
  LastElapsedChangeDetection,
  LastElapsedChangeDetectionAssembler,
  Plugin,
} from '@augury/core';

declare const window;

export class UnitTesterPlugin extends Plugin {
  public doInitialize() {
    window.auguryUT = {};

    let cdChannel: Channel<LastElapsedChangeDetection>;
    let cdRuns: LastElapsedChangeDetection[] = [];

    window.auguryUT.startMonitoringChangeDetection = () => {
      cdChannel = this.getAugury().createAssemblyChannel(new LastElapsedChangeDetectionAssembler());
      cdChannel.subscribe(lastElapsedChangeDetection => {
        cdRuns.push(lastElapsedChangeDetection);
      });
    };

    window.auguryUT.finishMonitoringChangeDetection = () => {
      const result = {
        cdRuns: cdRuns.map(cdRun => ({
          // @todo: rename drag to auguryDrag
          runtime: cdRun.endTimestamp - cdRun.startTimestamp - cdRun.drag,
        })),
      };

      cdChannel.shutdown();
      cdRuns = [];

      return result;
    };
  }
}
