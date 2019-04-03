import { Component } from '@angular/core';

@Component({
  selector: 'nglocalization-directive',
  template: `
    <h4>Value = {{ value }}</h4>
    <button class="btn btn-warning" (click)="inc()">Increment</button>
    <h4 [ngPlural]="value">
      <ng-template ngPluralCase="=0">there is nothing</ng-template>
      <ng-template ngPluralCase="=1">there is one</ng-template>
      <ng-template ngPluralCase="few">there are a few</ng-template>
      <ng-template ngPluralCase="other">there is some number</ng-template>
    </h4>
  `,
})
export default class NgLocalizationDirective {
  public value: any = 'init';
  public inc() {
    this.value = this.value === 'init' ? 0 : this.value + 1;
  }
}
