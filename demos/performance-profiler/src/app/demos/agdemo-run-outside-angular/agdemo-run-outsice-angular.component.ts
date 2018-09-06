import { Component, NgZone, ElementRef, ViewChild } from '@angular/core';
import { } from '@angular/forms';

const COUNT_INTERVAL = 100;

@Component({
  selector: 'agdemo-run-outside-angular',
  template: `
  <div>
    <div>
      use runOutsideAngular()
      <input type='checkbox' [(ngModel)]="outsideAngular">
    </div>
    <div>
      <button [disabled]="buttonDisabled" [style.background-color]="buttonDisabled? 'lightgray' : 'lightblue'" (click)="run()">
      do async count </button>
    </div>
    <div>
      <button> this button has no bindings </button>
      <button (click)="noop()"> this button is bound to an empty function </button>
    </div>
    <div>
      <h2>{{ currentNum }}</h2>
    </div>
  </div>`
})
export class AgDemoRunOutsideAngularComponent {

  currentNum = 0;
  outsideAngular = false;
  buttonDisabled = false;

  @ViewChild('currentNumInput') numInputRef: ElementRef;

  constructor(private _ngZone: NgZone) { }

  noop() { }

  run() {
    this.currentNum = 0
    this.buttonDisabled = true
    if (!this.outsideAngular)
      this.doCount()
    else
      this._ngZone.runOutsideAngular(() => this.doCount())
  }

  doCount() {
    Array(5)
      .fill(true)
      .map((_, i) => i * COUNT_INTERVAL)
      .forEach(intervalLength =>
        setTimeout(
          () => this.currentNum += 1,
          intervalLength
        )
      )
    setTimeout(
      () => this.buttonDisabled = false,
      COUNT_INTERVAL * 6
    )
  }

}