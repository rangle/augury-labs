import { Component } from '@angular/core';

@Component({
  selector: 'ngstyle-directive',
  template: `
    <h1 [ngStyle]="{ 'font-style': style, 'font-size': size, 'font-weight': weight }">
      Change style of this text!
    </h1>

    <hr />
    <label>Italic: <input type="checkbox" (change)="changeStyle($event)"/></label>
    <label>Bold: <input type="checkbox" (change)="changeWeight($event)"/></label>
    <label>Size: <input type="text" [value]="size" (change)="size = $event.target.value"/></label>
  `,
})
export default class NgStyleDirective {
  public style = 'normal';
  public weight = 'normal';
  public size = '20px';

  public changeStyle($event: any) {
    this.style = $event.target.checked ? 'italic' : 'normal';
  }

  public changeWeight($event: any) {
    this.weight = $event.target.checked ? 'bold' : 'normal';
  }
}
