import { CallableAPI } from '../commands'

// @todo: definitions such as this should exist separate from rest of core package.
//        because plugins extending this class dont need to bring in the rest of core into their bundle.
//        otherwise we could end up with 2 versions of the core in the final app bundle

export abstract class Plugin {

  api?: CallableAPI

  name() {
    return this.constructor.name
  }

  init(api: CallableAPI): void {
    this.api = api
    if (this.onInit) this.onInit()
  }

  // hooks
  onInit?(): void
  onPluginAdded?(): void // @todo: not implemented
  onAuguryInit?(): void // @todo: not implemented
  onAppInit?(): void // @todo: not implemented

}