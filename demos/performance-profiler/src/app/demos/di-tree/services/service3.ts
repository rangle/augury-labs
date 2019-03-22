import { Injectable } from '@angular/core';

export class Service3 {
  public value: string = 'service3';
  constructor() {
    this.value = this.value + ' Id: ' + Math.floor(Math.random() * 500);
  }
}
