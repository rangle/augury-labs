import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.css']
})
export class CounterComponent{

  @Input() count: number = 0;
  @Output() result: EventEmitter<number> = new EventEmitter<number>();
  @Output() displayMessage: EventEmitter<any> = new EventEmitter<any>();

  increment() {
    this.count++;
    this.result.emit(this.count);
  }

  sendMessage() {
    const data = { 'name': 'John11', 'message': 'Hello there11!!!' };
    this.displayMessage.emit(data);
  }
}
