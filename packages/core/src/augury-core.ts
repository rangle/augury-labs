import { Subscription } from './event-emitters';
import { HistoryManager } from './history';
import { PluginManager } from './plugins';
import { Plugin } from './plugins';
import { Probe, ProbeManager } from './probes';
import { AuguryEventProjection } from './projections';

export class AuguryCore {
  public readonly historyManager: HistoryManager;
  private readonly probeManager: ProbeManager;
  private readonly pluginManager: PluginManager;

  constructor(probes: Probe[], plugins: Plugin[], ngZone, ngModule) {
    this.probeManager = new ProbeManager(probes, ngZone, ngModule);
    this.historyManager = new HistoryManager();
    this.pluginManager = new PluginManager(plugins, this);
    this.probeManager.subscribe(event => this.historyManager.addEvent(event));
  }

  public subscribeToEvents<Output>(
    projection: AuguryEventProjection<any>,
    handleOutput: (output: Output) => void,
  ): Subscription {
    return this.probeManager.subscribe(event => {
      if (projection.process(event)) {
        const output = projection.finish();

        if (output) {
          handleOutput(output);
        }
      }
    });
  }

  public project<Output>(
    projection: AuguryEventProjection<Output>,
    startEventId: null,
    endEventId: null,
  ): Output[] {
    return this.historyManager.project(projection, startEventId, endEventId);
  }
}
