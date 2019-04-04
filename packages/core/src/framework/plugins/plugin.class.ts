import { AuguryCore } from '../augury-core';
import { AuguryBridge } from './bridge';

// @todo: definitions such as this should exist separate from rest of core package.
//        because plugins extending this class dont need to bring in the rest of core into their bundle.
//        otherwise we could end up with 2 versions of the core in the final app bundle

export abstract class Plugin {
  protected readonly bridge: AuguryBridge = AuguryBridge.getInstance();
  protected augury: AuguryCore | null = null;

  public initialize(augury: AuguryCore): void {
    this.augury = augury;

    this.doInitialize();
  }

  public abstract doInitialize(): void;

  public getAugury(): AuguryCore {
    if (this.augury) {
      return this.augury;
    } else {
      throw new Error('Augury has not initialized this plugin');
    }
  }
}
