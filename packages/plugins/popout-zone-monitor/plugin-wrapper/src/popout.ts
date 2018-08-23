import { SyncEventEmitter } from '../../../../core/src/index'

// @todo: this should be shared across plugins
// @todo: if you open popouts with the same name from 2 different tabs, 
//        i think it'll try to use the same one, causing a bridge conflict

export function openPopout(name: string) {

  const popoutWindow = open('', name, 'height=400,width=800,titlebar=yes,location=no')

  if (!popoutWindow)
    throw new Error('please allow popups')

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
    public bridge // @todo: type
  ) {
    this.window.bridge = this.bridge
  }

  write(text) {
    this.window.document.open()
    this.window.document.write(text)
  }

  injectScript(scriptText: string) {

    const tag = this.window.document.createElement('script')
    tag.innerHTML = scriptText

    this.window.document.body.appendChild(tag)
  }

  function(name, implementation) {
    this.window[name] = implementation
  }

}