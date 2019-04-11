import { ChangeDetectionInfo, ChangeDetectionInfoAssembler, Channel, Plugin } from '@augury/core';

declare const window;

export class UnitTesterPlugin extends Plugin {
  public doInitialize() {
    window.auguryUT = {};

    let cdChannel: Channel<ChangeDetectionInfo>;
    let cdRuns: ChangeDetectionInfo[] = [];

    window.auguryUT.startMonitoringChangeDetection = () => {
      cdChannel = this.getAugury().createAssemblyChannel(new ChangeDetectionInfoAssembler());
      cdChannel.subscribe(changeDetectionInfo => {
        cdRuns.push(changeDetectionInfo);
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
