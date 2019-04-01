import { CallableAPI } from '../commands';

// @todo: definitions such as this should exist separate from rest of core package.
//        because plugins extending this class dont need to bring in the rest of core into their bundle.
//        otherwise we could end up with 2 versions of the core in the final app bundle

export abstract class Plugin {
  public api?: CallableAPI;

  public name() {
    return this.constructor.name;
  }

  public init(api: CallableAPI): void {
    this.api = api;

    this.onInit();
  }

  public abstract onInit(): void;
}
