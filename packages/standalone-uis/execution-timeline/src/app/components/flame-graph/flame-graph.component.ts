import {
  AfterViewChecked,
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import * as d3 from 'd3';
import { flamegraph } from 'd3-flame-graph';
import * as d3Tip from 'd3-tip';
import { FlameGraphNode } from '../../types/flame-graph-node.interface';
import { round2 } from '../../util/misc-utils';

const tip = (d3Tip as any).default;

/*
  //
  // e.g.
  //
  // rootNode = {
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
 */

@Component({
  selector: 'ag-flame-graph',
  templateUrl: './flame-graph.component.html',
  styleUrls: ['./flame-graph.component.scss'],
})
export class FlameGraphComponent implements OnChanges, AfterViewChecked {
  @Input()
  public rootNode: FlameGraphNode;

  @ViewChild('flameGraphContainer')
  public container: ElementRef;

  private isReady: boolean;
  private width: number;

  public ngOnChanges(changes: SimpleChanges): void {
    this.isReady = Boolean(this.rootNode) && Boolean(this.container);

    this.paint();
  }

  public ngAfterViewChecked(): void {
    if (this.container.nativeElement.clientWidth !== this.width) {
      this.paint();
    }
  }

  public paint() {
    if (this.isReady) {
      this.clearExistingGraph();

      this.width = this.container.nativeElement.clientWidth;

      const t = tip()
        .direction('s')
        .offset([8, 0])
        .attr('class', 'd3-flame-graph-tip')
        .html(d => `${d.data.name}: ${round2(d.data.value)}ms`);

      const fgraph = flamegraph()
        .width(this.width)
        .tooltip(t);

      d3.select(this.container.nativeElement)
        .datum(this.rootNode)
        .call(fgraph);
    }
  }

  private clearExistingGraph() {
    d3.select(this.container.nativeElement)
      .selectAll('*')
      .remove();
  }
}
