import { Component, Input } from '@angular/core';

@Component({
  selector: 'ngclass-directive',
  template: `
    <div class="button" [ngClass]="{ active: isOn, disabled: isDisabled }" (click)="toggle(!isOn)">
      <h4>Click me!</h4>
    </div>
  `,
  styles: [
    `
      .button {
        padding: 10px;
        border: medium solid black;
      }

      .active {
        background-color: red;
      }

      .disabled {
        color: gray;
        border: medium solid gray;
      }
    `,
  ],
})
export default class NgClassDirective {
  public isOn = false;
  @Input() public isDisabled: boolean = false;

  public toggle(newState) {
    if (!this.isDisabled) {
      this.isOn = newState;
    }
  }
}
