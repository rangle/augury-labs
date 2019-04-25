import { AuguryWindow } from '../augury-window.interface';

interface WindowSizeAndPosition {
  position: { x: number; y: number };
  size: { width: number; height: number };
}

export class PopupController {
  public readonly window: AuguryWindow;
  private storageKey = 'augury-popup-settings';
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

  private initializeWindow(): AuguryWindow {
    const parameters = ['titlebar=yes', 'location=no'].join(',');
    const pluginWindow = open('', this.name, parameters) as AuguryWindow;

    if (!pluginWindow) {
      throw new Error('Please allow popup windows');
    }

    const sizeAndPosition = this.getWindowSizeAndPositionFromStorage();
    if (sizeAndPosition) {
      pluginWindow.moveTo(sizeAndPosition.position.x, sizeAndPosition.position.y);
      pluginWindow.resizeTo(sizeAndPosition.size.width, sizeAndPosition.size.height);
    }

    window.addEventListener('unload', this.onUnload);

    return pluginWindow;
  }

  private getWindowSizeAndPositionFromStorage(): WindowSizeAndPosition {
    const fromStorage = localStorage.getItem(this.storageKey);
    return !!fromStorage ? JSON.parse(fromStorage) : null;
  }

  private storeWindowSizeAndPosition() {
    // Fallback to screen width/height if popup is already closed
    const outerWidth = this.window.outerWidth === 0 ? screen.width : this.window.outerWidth;
    const outerHeight = this.window.outerHeight === 0 ? screen.height : this.window.outerHeight;

    const windowSizeAndPosition: WindowSizeAndPosition = {
      position: {
        x: this.window.screenX,
        y: this.window.screenY,
      },
      size: {
        width: outerWidth,
        height: outerHeight,
      },
    };

    localStorage.setItem(this.storageKey, JSON.stringify(windowSizeAndPosition));
  }

  private kill() {
    this.storeWindowSizeAndPosition();
    this.window.close();

    window.removeEventListener('unload', this.onUnload);
  }
}
