import { PopupController } from '@augury/core';

declare const require;

export class PerformanceProfilerController extends PopupController {
  private static readonly WindowName = 'Augury Zone Monitor';

  constructor() {
    super(PerformanceProfilerController.WindowName);

    this.addScript(require('!!raw-loader!@augury/frontend/dist/runtime-es2015.js'));
    this.addScript(require('!!raw-loader!@augury/frontend/dist/polyfills-es2015.js'));
    this.addScript(require('!!raw-loader!@augury/frontend/dist/scripts.js'));
    this.addScript(require('!!raw-loader!@augury/frontend/dist/main-es2015.js'));
    this.writeHtml('<augury-ui></augury-ui>');
  }
}
