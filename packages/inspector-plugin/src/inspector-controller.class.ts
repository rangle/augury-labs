import { PopupController } from '@augury/core';

declare const require;

export class InspectorController extends PopupController {
  private static readonly WindowName = 'Augury Inspector';

  constructor() {
    super(InspectorController.WindowName);

    this.addScript(require('!!raw-loader!@augury/inspector-frontend/dist/runtime-es2015.js'));
    this.addScript(require('!!raw-loader!@augury/inspector-frontend/dist/polyfills-es2015.js'));
    this.addScript(require('!!raw-loader!@augury/inspector-frontend/dist/scripts.js'));
    this.addScript(require('!!raw-loader!@augury/inspector-frontend/dist/main-es2015.js'));
    this.writeHtml('<augury-inspector-ui></augury-inspector-ui>');
  }
}
