export interface AuguryEventSource {
  type: 'action' | 'probe' | 'plugin';
  name: string;
}
