import { SyncEventEmitter } from '@augury/core'

// @todo: this should be shared across plugins
// @todo: if you open popouts with the same name from 2 different tabs,
//        i think it'll try to use the same one, causing a bridge conflict

export function openPopout(name: string) {
  let popoutWindow: any = open('', name, 'height=800,width=800,titlebar=yes,location=no')

  if (!popoutWindow) {
    throw new Error('please allow popups')
  }

  if (popoutWindow.bridge) {
    popoutWindow.close()
    popoutWindow = open('', name, 'height=400,width=800,titlebar=yes,location=no')
  }

  const bridge = {
    in: new SyncEventEmitter(),
    out: new SyncEventEmitter(),
  }

  return new PopoutController(name, popoutWindow, bridge)
}

export class PopoutController {
  constructor(
    public name: string,
    public window,
    public bridge, // @todo: type
  ) {
    this.window.bridge = this.bridge
  }

  public write(text) {
    this.window.document.open()
    this.window.document.write(text)
  }

  public injectScript(scriptText: string) {
    const tag = this.window.document.createElement('script')
    tag.innerHTML = scriptText

    this.window.document.body.appendChild(tag)
  }

  public function(name, implementation) {
    this.window[name] = implementation
  }
}
