import { SyncEventEmitter } from '../utils'
import { Scanner } from '../scanner'
import { Channel } from './channel'
export declare class ScannerChannel extends Channel {
  type: string
  private scanner
  constructor(scanner: Scanner)
  shutdown(): void
  events(): SyncEventEmitter<any>
}
