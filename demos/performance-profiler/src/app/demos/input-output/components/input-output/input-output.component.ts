import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'input-output',
  templateUrl: './input-output.component.html',
  styleUrls: ['./input-output.component.css'],
})
export class InputOutputComponent {
  public message: string;
  public name: string;
  public num: number;
  public parentCount: number;
  public isOn = false;
  public isDisabled = false;

  constructor() {
    this.num = 0;
    this.parentCount = 0;
  }

  public onChange(val: any) {
    this.parentCount = val;
  }

  public toggle(newState) {
    if (!this.isDisabled) {
      this.isOn = newState;
    }
  }

  public displayMessage(data: any) {
    this.message = data.message;
    this.name = data.name;
  }
}
