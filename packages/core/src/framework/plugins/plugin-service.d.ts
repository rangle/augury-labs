import { CommandService } from '../commands'
import { Plugin } from './plugin'
export declare class PluginService {
  private commands
  private plugins
  private callableAPI
  private addSingle
  constructor(commands: CommandService)
  add(plugins: Plugin | Plugin[]): void
}
