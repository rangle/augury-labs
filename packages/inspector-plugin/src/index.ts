import { ComponentTreeInfoProjection, Plugin } from '@augury/core';

declare const require;

export class InspectorPlugin extends Plugin {
  public doInitialize() {
    const auguryContainerEl = this.createInspectorContainer();
    document.body.append(auguryContainerEl);

    this.getAugury().registerEventProjection(new ComponentTreeInfoProjection(), treeInfo => {
      console.log('Got new tree: ', treeInfo);
    });
  }

  private createInspectorContainer() {
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.bottom = '0';
    container.style.left = '0';
    container.style.right = '0';
    container.style.backgroundColor = '#eee';
    container.style.height = '30%';
    container.style.borderTop = '7px solid #ccc';

    this.addScript(require('!!raw-loader!@augury/inspector-frontend/dist/runtime-es2015.js'));
    this.addScript(require('!!raw-loader!@augury/inspector-frontend/dist/polyfills-es2015.js'));
    this.addScript(require('!!raw-loader!@augury/inspector-frontend/dist/scripts.js'));
    this.addScript(require('!!raw-loader!@augury/inspector-frontend/dist/main-es2015.js'));

    const inspectorApp = document.createElement('augury-inspector-ui');
    container.appendChild(inspectorApp);

    return container;
  }

  private addScript(scriptContent: string) {
    const scriptElement = document.createElement('script');
    scriptElement.innerHTML = scriptContent;

    document.body.appendChild(scriptElement);
  }
}
