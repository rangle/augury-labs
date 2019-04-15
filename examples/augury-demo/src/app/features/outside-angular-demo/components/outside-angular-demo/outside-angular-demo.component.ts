import { Component, NgZone } from '@angular/core';

@Component({
  selector: 'al-outside-angular-demo',
  templateUrl: './outside-angular-demo.component.html',
})
export class OutsideAngularDemoComponent {
  private static readonly Interval = 100;

  public isRunning = false;
  public runOutsideAngular = false;
  public currentNumber = 0;

  constructor(private ngZone: NgZone) {}

  public noop() {
    // do nothing
  }

  public run() {
    this.currentNumber = 0;
    this.isRunning = true;

    if (this.runOutsideAngular) {
      this.ngZone.runOutsideAngular(() => this.performCounting());
    } else {
      this.performCounting();
    }
  }

  private performCounting() {
    const intervalLengths = Array(5)
      .fill(true)
      .map((_, i) => i * OutsideAngularDemoComponent.Interval);

    intervalLengths.forEach(intervalLength =>
      setTimeout(() => (this.currentNumber += 1), intervalLength),
    );

    setTimeout(() => (this.isRunning = false), OutsideAngularDemoComponent.Interval * 6);
  }
}
