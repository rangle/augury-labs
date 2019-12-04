import { ChangeDetectionInfo, ChangeDetectionInfoProjection, Plugin } from '@augury/core';

import { CircleUI } from './circle-ui';
import { tooManyCycles } from './triggers';

function someTriggerFired(cyclesOverTime) {
  return tooManyCycles(cyclesOverTime);
}

export class HealthIndicatorOverlay extends Plugin {
  private circle = new CircleUI();
  private cyclesOverTime = new Map();

  public doInitialize(): void {
    (window as any).circle = this.circle;

    this.getAugury().registerEventProjection<ChangeDetectionInfo>(
      new ChangeDetectionInfoProjection(),
      cdInfo => {
        this.cyclesOverTime.set(cdInfo.startTimestamp, cdInfo.startEventId);

        if (someTriggerFired(this.cyclesOverTime)) {
          this.circle.flash('red');
        } else {
          this.circle.flash('green');
        }
      },
    );
  }
}
