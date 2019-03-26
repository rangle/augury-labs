import { SyncEventEmitter } from '@augury/core';
import { active } from 'd3';

// @todo: this should be shared across plugins
// @todo: if you open popouts with the same name from 2 different tabs,
//        i think it'll try to use the same one, causing a bridge conflict

const allControllers: PopoutController[] = [];
window.onunload = window.onbeforeunload = () => allControllers.forEach(c => c.kill());

export function openPopout(name: string) {
  const parameters = ['titlebar=yes', 'location=no'].join(',');

  let popoutWindow: any = open('', name, parameters);

  if (!popoutWindow) {
    throw new Error('please allow popups');
  }

  if (popoutWindow.bridge) {
    popoutWindow.close();
    popoutWindow = open('', name, parameters);
  }

  popoutWindow.moveTo(0, 0);
  popoutWindow.resizeTo(screen.width, screen.height);

  const bridge = {
    in: new SyncEventEmitter(),
    out: new SyncEventEmitter(),
  };

  const controller = new PopoutController(name, popoutWindow, bridge);

  allControllers.push(controller);

  return controller;
}

export class PopoutController {
  constructor(
    public name: string,
    public window,
    public bridge, // @todo: type
  ) {
    this.window.bridge = this.bridge;
  }

  public write(text) {
    this.window.document.open();
    this.window.document.write(text);
  }

  public injectScript(scriptText: string) {
    const tag = this.window.document.createElement('script');
    tag.innerHTML = scriptText;

    this.window.document.body.appendChild(tag);
  }

  public function(name, implementation) {
    this.window[name] = implementation;
  }

  public kill() {
    this.window.close();
  }
}
