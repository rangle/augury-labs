import { PopupController } from '@augury/core';

declare const require;

export class PerformanceProfilerController extends PopupController {
  private static readonly WindowName = 'Augury Zone Monitor';

  constructor() {
    super(PerformanceProfilerController.WindowName);

    this.addScript(require('!!raw-loader!@augury/frontend/dist/runtime.js'));
    this.addScript(require('!!raw-loader!@augury/frontend/dist/polyfills.js'));
    this.addScript(require('!!raw-loader!@augury/frontend/dist/scripts.js'));
    this.addScript(require('!!raw-loader!@augury/frontend/dist/main.js'));
    this.writeHtml('<augury-ui></augury-ui>');
  }
}
