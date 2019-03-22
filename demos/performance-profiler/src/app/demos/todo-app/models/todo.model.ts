export class TodoModel {
  public status = 'started';
  constructor(public title = '') {}

  public toggle() {
    if (this.status === 'started') {
      this.status = 'completed';
    } else {
      this.status = 'started';
    }
  }
}
