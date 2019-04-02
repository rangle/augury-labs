import { Subscribable, SyncEventEmitter } from '../event-emitters';
import { AuguryEvent } from '../events';
import { HistoryManager } from '../history';
import { Reducer } from '../reducers';

export class Scanner {
  // @todo: types, how do we get the reducer types in here?
  public emitter = new SyncEventEmitter<any>();

  private subscription;
  private lastReducerState;

  constructor(private reducer: Reducer, private historyManager: HistoryManager) {}

  public scan(subscribable: Subscribable<AuguryEvent>) {
    this.subscription = subscribable.subscribe(event => {
      const nextReducerState = this.reducer.deriveState(
        this.lastReducerState,
        event,
        this.historyManager.getLastElapsedEvent(),
      );
      const nextResult = Reducer.getResultFromState(nextReducerState);
      const prevResult = Reducer.getResultFromState(this.lastReducerState);

      if (nextResult !== prevResult) {
        this.emitter.emit(nextResult);
      }

      this.lastReducerState = nextReducerState;
    });
  }

  public last() {
    return Reducer.getResultFromState(this.lastReducerState);
  }

  public stop() {
    this.subscription.unsubscribe();
  }

  public reset() {
    this.stop();
    this.lastReducerState = undefined;
  }
}
