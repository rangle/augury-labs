import { Component, ElementRef, Input, NgZone, OnChanges, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { flamegraph } from 'd3-flame-graph';
import * as d3Tip from 'd3-tip';
import { FlameGraphNode } from '../../types/flame-graph-node.interface';
import { round2 } from '../../util/misc-utils';

const tip = (d3Tip as any).default;

@Component({
  selector: 'ag-flame-graph',
  templateUrl: './flame-graph.component.html',
  styleUrls: ['./flame-graph.component.css'],
  // encapsulation: ViewEncapsulation.None
})
export class FlameGraphComponent implements OnChanges {
  @Input() public height: string;
  @Input() public width: string;
  @Input() public data: FlameGraphNode;
  //
  // e.g.
  //
  // data = {
  //   name : 'AppComponent',
  //   value: 100,
  //   children: [
  //     {
  //       name: '__HIDDEN__', // used for offsetting the next segment
  //       value: 20,
  //     },
  //     {
  //       name: 'HeaderComponent',
  //       value: 20,
  //     },
  //     {
  //       name: 'FooterComponent',
  //       value: 40,
  //     }
  //   ]
  // }

  @ViewChild('flameGraphContentContainer') public contentContainerSVGElement: ElementRef;

  constructor(private zone: NgZone) {}

  public ngOnChanges() {
    this.paint();
  }

  public isReady() {
    return this.data && this.contentContainerSVGElement;
  }

  public onResizeContainer() {
    this.paint();
  }

  public ngAfterViewChecked() {
    if (this.contentContainerSVGElement.nativeElement.clientWidth !== this.width) {
      this.paint();
    }
  }

  private paint() {
    if (this.isReady()) {
      d3.select(this.contentContainerSVGElement.nativeElement)
        .selectAll('*')
        .remove();
      this._paint();
    }
  }

  private _paint() {
    this.width = this.contentContainerSVGElement.nativeElement.clientWidth;
    if (!this.data) {
      throw new Error('no data provided');
    }
    const t = tip()
      .direction('s')
      .offset([8, 0])
      .attr('class', 'd3-flame-graph-tip')
      .html(d => `${d.data.name}: ${round2(d.data.value)}ms`);

    const fgraph = flamegraph()
      .width(this.width)
      .tooltip(t);

    d3.select(this.contentContainerSVGElement.nativeElement)
      .datum(this.data)
      .call(fgraph);
  }
}
