'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
// @todo: command classes. it will help to overload the parameter types,
//        since the command class can take care of them in the constructor.
//        in this case, we can just pass a reducer directly, if we dont want any other opts
exports.requestCustomChannel = {
  name: 'request-custom-channel',
  methodName: 'createChannel',
  availableToPlugins: true,
  parseReactions(reactionResults) {
    const { channel } = reactionResults['create-custom-channel-from-reducer']
    return { success: true, channel }
  },
}
//# sourceMappingURL=request-custom-channel.js.map
