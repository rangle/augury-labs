'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
// @todo: definitions such as this should exist separate from rest of core package.
//        because plugins extending this class dont need to bring in the rest of core into their bundle.
//        otherwise we could end up with 2 versions of the core in the final app bundle
class Plugin {
  name() {
    return this.constructor.name
  }
  init(api) {
    this.api = api
    if (this.onInit) this.onInit()
  }
}
exports.Plugin = Plugin
//# sourceMappingURL=plugin.js.map
