import { CallableAPI } from '../commands'
export abstract class Plugin {
  api?: CallableAPI
  name(): string
  init(api: CallableAPI): void
  onInit?(): void
  onPluginAdded?(): void
  onAuguryInit?(): void
  onAppInit?(): void
}
