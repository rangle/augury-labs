'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
class Channel {
  createDelegate(didShutdown) {
    return {
      events: this.events(),
      kill: () => {
        this.shutdown()
        didShutdown(this)
      },
    }
  }
}
exports.Channel = Channel
//# sourceMappingURL=channel.js.map
