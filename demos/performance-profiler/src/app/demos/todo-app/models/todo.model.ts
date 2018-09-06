export class TodoModel {
  status: String = 'started';
  constructor(
    public title: String = ''
  ) { }

  toggle() {
    if (this.status === 'started') {
      this.status = 'completed';
    } else {
      this.status = 'started';
    }
  }
}
