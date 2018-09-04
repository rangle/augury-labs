'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.subscribeToLastElapsedCycle = {
  name: 'subscribe-to-last-elapsed-cycle',
  availableToPlugins: true,
  parseReactions(reactionResults) {
    const { channel } = reactionResults['create-last-elapsed-cycle-channel']
    return { success: true, channel }
  },
}
//# sourceMappingURL=subscribe-to-last-elapsed-cycle.js.map
