'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const scanner_channel_1 = require('./scanner-channel')
class ChannelService {
  constructor() {
    this.channels = []
  }
  createFromScanner(scanner) {
    const channel = new scanner_channel_1.ScannerChannel(scanner)
    this.channels.push(channel)
    return channel.createDelegate(() => this.releaseDeadChannel(channel))
  }
  releaseDeadChannel(channel) {
    this.channels = this.channels.filter(c => c !== channel)
  }
}
exports.ChannelService = ChannelService
//# sourceMappingURL=channel-service.js.map
