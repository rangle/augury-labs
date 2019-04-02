import { AuguryPluginController } from '@augury/core';

declare const require;

export class PerformanceProfilerController extends AuguryPluginController {
  private static readonly WindowName = 'Augury Zone Monitor';

  constructor() {
    super(PerformanceProfilerController.WindowName);

    this.writeHtml(require('!!raw-loader!@augury/execution-timeline-ui/dist/index.html'));
    this.addScript(require('!!raw-loader!@augury/execution-timeline-ui/dist/polyfills.js'));
    this.addScript(require('!!raw-loader!@augury/execution-timeline-ui/dist/main.js'));
  }
}