import { EmitFunction } from './emit-function.type';

export abstract class Probe {
  constructor(public emit: EmitFunction) {}

  // @todo: how are we handling / exposing errors during attachment?
  public beforeNgBootstrap?(preBootstrapTargets: any): void;
  public afterNgBootstrap?(ngModuleRef: any): void;
}
