import { PopupController } from '@augury/core';

declare const require;

export class PerformanceProfilerController extends PopupController {
  private static readonly WindowName = 'Augury Zone Monitor';

  constructor() {
    super(PerformanceProfilerController.WindowName);

    this.writeHtml(require('!!raw-loader!@augury/frontend/dist/index.html'));
    this.addScript(require('!!raw-loader!@augury/frontend/dist/polyfills.js'));
    this.addScript(require('!!raw-loader!@augury/frontend/dist/main.js'));
  }
}
