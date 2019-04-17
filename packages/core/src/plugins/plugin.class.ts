import { AuguryCore } from '../augury-core.class';
import { AuguryBridge } from './bridge';

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
