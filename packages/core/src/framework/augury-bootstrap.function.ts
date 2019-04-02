import { defaultCommands } from '../commands';
import { defaultEnhancers } from '../enhancers';
import { defaultProbes } from '../probes';
import { defaultReactions } from '../reactions';
import { AuguryBootstrapParameters } from './augury-bootstrap-parameters.interface';
import { AuguryCore } from './augury-core';

export function auguryBootstrap(parameters: AuguryBootstrapParameters): Promise<any> {
  const auguryCore = new AuguryCore(
    defaultProbes,
    defaultEnhancers,
    defaultReactions,
    defaultCommands,
  );

  (window as any).augury = auguryCore;

  return auguryCore.bootstrap(parameters);
}
