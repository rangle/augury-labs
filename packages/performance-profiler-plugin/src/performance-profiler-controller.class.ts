import { AuguryPluginController } from '@augury/core';
import { AuguryBridge } from '@augury/core';

declare const require;

export class PerformanceProfilerController extends AuguryPluginController {
  private static readonly WindowName = 'Augury Zone Monitor';

  constructor(bridge: AuguryBridge) {
    super(PerformanceProfilerController.WindowName, bridge);

    this.writeHtml(require('!!raw-loader!@augury/frontend/dist/index.html'));
    this.addScript(require('!!raw-loader!@augury/frontend/dist/polyfills.js'));
    this.addScript(require('!!raw-loader!@augury/frontend/dist/main.js'));
  }
}
