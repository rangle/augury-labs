import { Subscription } from './events/event-emitters';
import { HistoryManager } from './history';
import { PluginManager } from './plugins';
import { Plugin } from './plugins';
import { Probe, ProbeManager } from './probes';
import { EventProjection } from './projections';

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

  public registerEventProjection<Result>(
    projection: EventProjection<Result>,
    handleResult: (result: Result) => void,
  ): Subscription {
    return this.probeManager.subscribe(event => {
      if (projection.process(event)) {
        const result = projection.collectResult();

        if (result) {
          handleResult(result);
        }
      }
    });
  }

  public projectFirstResultFromHistory<Result>(
    projection: EventProjection<Result>,
    startEventId: number = null,
    endEventId: number = null,
  ): Result {
    const results = this.projectResultsFromHistory(projection, 1, startEventId, endEventId);

    return results.length > 0 ? results[0] : null;
  }

  public projectResultsFromHistory<Result>(
    projection: EventProjection<Result>,
    maxResults: number = null,
    startEventId: number = null,
    endEventId: number = null,
  ): Result[] {
    return this.historyManager.projectResults(projection, maxResults, startEventId, endEventId);
  }
}
