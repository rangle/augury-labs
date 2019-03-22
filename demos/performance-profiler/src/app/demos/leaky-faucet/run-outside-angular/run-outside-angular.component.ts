import { Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import {} from '@angular/forms';

const COUNT_INTERVAL = 500;

@Component({
  selector: 'app-run-outside-angular',
  templateUrl: './run-outside-angular.component.html',
  styleUrls: ['./run-outside-angular.component.css'],
})
export class RunOutsideAngularComponent {
  public currentNum = 0;
  public outsideAngular = false;
  public buttonDisabled = false;

  @ViewChild('currentNumInput') public numInputRef: ElementRef;

  public numberChildren = 0;
  public status = 'change me';

  constructor(private ngZone: NgZone) {}

  public test(x) {
    console.log(x);
  }

  public noop() {
    // do nothing
  }

  public run() {
    this.currentNum = 0;
    this.buttonDisabled = true;
    if (!this.outsideAngular) { this.doCount(); }
    else { this.ngZone.runOutsideAngular(() => this.doCount()); }
  }

  public doCount() {
    Array(5)
      .fill(true)
      .map((_, i) => i * COUNT_INTERVAL)
      .forEach(intervalLength => setTimeout(() => (this.currentNum += 1), intervalLength));
    setTimeout(() => (this.buttonDisabled = false), COUNT_INTERVAL * 6);
  }

  public getInputVal() {
    return parseInt(this.numInputRef.nativeElement.value || 0, 10);
  }

  public onSubmit() {
    this.status = 'starting runOutsideAngular(fn)';
    this.ngZone.runOutsideAngular(() => {
      const el = document.getElementById('populateChildren');
      clearEl(el);
      addChildrenTo(el, this.numberChildren);
    });
  }

  public clearChildren() {
    const el = document.getElementById('populateChildren');
    clearEl(el);
    this.status = 'cleared';
  }
}

// utility vanilla JS functions
function addChildrenTo(el: Element, count: number) {
  for (let i = 0; i < count; i++) {
    const text = makeString(Math.ceil(Math.random() * 10));
    const timeout = Math.ceil(Math.random() * 1000);
    setTimeout(() => {
      addInputTo(el, 'child' + i, text);
      updateStatus('child' + i + ' =  ' + text);
    }, timeout);
  }
}

function clearEl(el: Element) {
  while (el.firstChild) {
    el.removeChild(el.firstChild);
  }
}

function addInputTo(el: Element, name: string, value: string) {
  const box = document.createElement('input');
  const attrName = document.createAttribute('name');
  attrName.value = name;
  const attrValue = document.createAttribute('value');
  attrValue.value = value;
  box.setAttributeNode(attrName);
  box.setAttributeNode(attrValue);
  el.appendChild(box);
}

function updateStatus(text: string) {
  const statusElement = document.getElementById('status') as HTMLInputElement;
  statusElement.value = text;
}

function makeString(numCharacters: number) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < numCharacters; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
