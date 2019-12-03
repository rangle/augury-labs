import { ChangeDetectionInfo, ChangeDetectionInfoProjection, Plugin } from '@augury/core';

function round2(num) {
  return Math.round(num * 100) / 100;
}

const FADEOUT_TRANSITION_MS = 400;
const FADEOUT_WAIT_MS = 1300;

export class RecentCyclesOverlay extends Plugin {
  public doInitialize(): void {
    const ui = document.createElement('div');

    ui.id = 'augury-performance-indicator';

    ui.style.zIndex = '9999';
    ui.style.position = 'fixed';
    ui.style.width = '20%';
    ui.style.paddingRight = '1%';
    ui.style.left = '80%';
    ui.style.top = '0';
    ui.style.fontSize = '2em';
    ui.style.color = 'red';

    function addStamp(ms) {
      const stamp = document.createElement('div');
      stamp.style.transition = `opacity ${FADEOUT_TRANSITION_MS}ms ease-in-out`;
      stamp.style.textAlign = 'right';
      stamp.innerText = `${ms} ms`;

      function attach() {
        const lastStamp = ui.children[0];
        if (lastStamp) {
          (lastStamp as any).shrink();
          ui.insertBefore(stamp, lastStamp);
        } else {
          ui.appendChild(stamp);
        }
      }

      function show() {
        stamp.style.display = 'block';
        stamp.style.opacity = '1';
      }

      function hide() {
        stamp.style.opacity = '0';
      }

      function detach() {
        ui.removeChild(stamp);
      }

      (stamp as any).shrink = function() {
        this.style.fontSize = '0.55em';
      };

      setTimeout(() => hide(), FADEOUT_WAIT_MS);
      setTimeout(() => detach(), FADEOUT_WAIT_MS + FADEOUT_TRANSITION_MS);

      hide();
      attach();
      show();
    }

    document.body.appendChild(ui);

    this.getAugury().registerEventProjection<ChangeDetectionInfo>(
      new ChangeDetectionInfoProjection(),
      cdInfo => addStamp(round2(cdInfo.endTimestamp - cdInfo.startTimestamp)),
    );
  }
}
