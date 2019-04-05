import { AuguryBootstrapParameters } from './augury-bootstrap-parameters.interface';
import { AuguryCore } from './augury-core';
import { defaultProbes } from './probes';

export function auguryBootstrap({
  platform,
  ngModule,
  NgZone,
  plugins,
}: AuguryBootstrapParameters): Promise<any> {
  const ngZone = new NgZone({ enableLongStackTrace: true });

  (window as any).augury = new AuguryCore(defaultProbes, plugins, ngZone, ngModule);

  return platform().bootstrapModule(ngModule, { ngZone });
}
