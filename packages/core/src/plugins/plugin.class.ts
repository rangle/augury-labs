import { AuguryCore } from '../augury-core.class';

export abstract class Plugin {
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
