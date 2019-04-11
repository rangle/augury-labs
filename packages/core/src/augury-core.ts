import { Subscription } from './event-emitters';
import { HistoryManager } from './history';
import { PluginManager } from './plugins';
import { Plugin } from './plugins';
import { Probe, ProbeManager } from './probes';
import { AuguryEventProjection } from './projections';

export class AuguryCore {
  private readonly probeManager: ProbeManager;
  private readonly historyManager: HistoryManager;
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
        const output = projection.collectResult();

        if (output) {
          handleOutput(output);
        }
      }
    });
  }

  public project<Output>(
    projection: AuguryEventProjection<Output>,
    startEventId: number = null,
    endEventId: number = null,
  ): Output[] {
    return this.historyManager.project(projection, startEventId, endEventId);
  }
}
