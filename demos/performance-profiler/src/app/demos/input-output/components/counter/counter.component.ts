import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.css'],
})
export class CounterComponent {
  @Input() public count: number = 0;
  @Output() public result: EventEmitter<number> = new EventEmitter<number>();
  @Output() public displayMessage: EventEmitter<any> = new EventEmitter<any>();

  public increment() {
    this.count++;
    this.result.emit(this.count);
  }

  public sendMessage() {
    const data = { name: 'John11', message: 'Hello there11!!!' };
    this.displayMessage.emit(data);
  }
}
