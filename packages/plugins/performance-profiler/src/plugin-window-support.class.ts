import { SyncEventEmitter } from '@augury/core';
import { PluginWindow } from './plugin-window.interface';

export class PluginWindowSupport {
  private window: PluginWindow;

  constructor(protected name: string) {
    this.window = this.initializeWindow();
  }

  public writeHtml(html) {
    this.window.document.open();
    this.window.document.write(html);
  }

  public addScript(scriptContent: string) {
    const scriptElement = this.window.document.createElement('script');
    scriptElement.innerHTML = scriptContent;

    this.window.document.body.appendChild(scriptElement);
  }

  public sendMessage(message) {
    this.window.bridge.in.emit(message);
  }

  public listenToMessageRequests(handleMessageRequest: (request) => void) {
    return this.window.bridge.out.subscribe(handleMessageRequest);
  }

  public kill() {
    this.window.close();
  }

  private initializeWindow(): PluginWindow {
    const parameters = ['titlebar=yes', 'location=no'].join(',');
    const pluginWindow = open('', this.name, parameters) as PluginWindow;

    if (!pluginWindow) {
      throw new Error('Please allow popup windows');
    }

    pluginWindow.moveTo(0, 0);
    pluginWindow.resizeTo(screen.width, screen.height);
    pluginWindow.onunload = () => this.kill();
    pluginWindow.bridge = {
      in: new SyncEventEmitter(),
      out: new SyncEventEmitter(),
    };

    return pluginWindow;
  }
}
