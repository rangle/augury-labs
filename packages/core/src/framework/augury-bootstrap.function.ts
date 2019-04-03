import { defaultCommands } from '../commands';
import { defaultEnhancers } from '../enhancers';
import { defaultProbes } from '../probes';
import { defaultReactions } from '../reactions';
import { AuguryBootstrapParameters } from './augury-bootstrap-parameters.interface';
import { AuguryCore } from './augury-core';

export function auguryBootstrap({
  platform,
  ngModule,
  NgZone,
  plugins,
}: AuguryBootstrapParameters): Promise<any> {
  const ngZone = new NgZone({ enableLongStackTrace: true });

  (window as any).augury = new AuguryCore(
    defaultProbes,
    defaultEnhancers,
    defaultReactions,
    defaultCommands,
    plugins,
  ).initialize(ngZone, ngModule);

  return platform().bootstrapModule(ngModule, { ngZone });
}
