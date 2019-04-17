import { AuguryPluginWindow } from './augury-plugin-window.interface';

export class AuguryPluginController {
  public readonly window: AuguryPluginWindow;
  private readonly onUnload: () => void;

  constructor(protected readonly name: string) {
    this.onUnload = this.kill.bind(this);
    this.window = this.initializeWindow();
  }

  protected writeHtml(html) {
    this.window.document.open();
    this.window.document.write(html);
  }

  protected addScript(scriptContent: string) {
    const scriptElement = this.window.document.createElement('script');
    scriptElement.innerHTML = scriptContent;

    this.window.document.body.appendChild(scriptElement);
  }

  private initializeWindow(): AuguryPluginWindow {
    const parameters = ['titlebar=yes', 'location=no'].join(',');
    const pluginWindow = open('', this.name, parameters) as AuguryPluginWindow;

    if (!pluginWindow) {
      throw new Error('Please allow popup windows');
    }

    pluginWindow.moveTo(0, 0);
    pluginWindow.resizeTo(screen.width, screen.height);

    window.addEventListener('unload', this.onUnload);

    return pluginWindow;
  }

  private kill() {
    this.window.close();
    window.removeEventListener('unload', this.onUnload);
  }
}
