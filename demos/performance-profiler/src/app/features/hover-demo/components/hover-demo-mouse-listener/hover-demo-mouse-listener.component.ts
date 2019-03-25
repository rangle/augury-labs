import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Point } from '../../types/point.interface';

@Component({
  selector: 'al-hover-demo-mouse-listener',
  templateUrl: './hover-demo-mouse-listener.component.html',
  styleUrls: ['./hover-demo-mouse-listener.component.scss'],
})
export class HoverDemoMouseListenerComponent {
  @Input()
  public point: Point;

  @Output()
  public pointChange = new EventEmitter<Point>();

  public onMouseMove(event: MouseEvent) {
    this.pointChange.emit({
      x: event.x,
      y: event.y,
    });
  }
}
