import { PluginWindowSupport } from './plugin-window-support.class';

declare const require;

export class PerformanceProfilerWindow extends PluginWindowSupport {
  private static readonly WindowName = 'Augury Zone Monitor';

  constructor() {
    super(PerformanceProfilerWindow.WindowName);

    this.writeHtml(require('!!raw-loader!@augury/execution-timeline-ui/dist/index.html'));
    this.addScript(require('!!raw-loader!@augury/execution-timeline-ui/dist/polyfills.js'));
    this.addScript(require('!!raw-loader!@augury/execution-timeline-ui/dist/main.js'));
  }
}
