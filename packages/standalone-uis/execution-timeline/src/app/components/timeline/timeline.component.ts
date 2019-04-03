import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  ViewChild,
} from '@angular/core';

import * as d3 from 'd3';

import { SegmentRowType } from '../../types/segment/segment-row-type.type';
import { getSegmentClasses } from '../../types/segment/segment.functions';
import { Segment } from '../../types/segment/segment.interface';
import { TimelineOptions } from '../../types/timeline-options/timeline-options.interface';

const spacingFocus = { marginBottom: 20, paddingInner: 2, tickSize: 10 };
const spacingContext = {
  marginTop: 20,
  marginBottom: 50,
  paddingInner: 2,
  xAxisOffset: 30,
  tickSize: 10,
};
const spacingBrush = { marginTopAndBottom: 3 };
const focusStartSize = 1000;
const horizontalScrollScaleFactor = 4;

@Component({
  selector: 'ag-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineComponent implements OnChanges {
  private static readonly MinimumElapsedTimeToRepaintInMilliseconds = 500;
  private static readonly RowTypes: SegmentRowType[] = [
    'zone task',
    'angular instability',
    'change detection',
  ];

  @Input()
  public segments: Segment[];

  @Input()
  public dragSegments: Segment[];

  @Input()
  public selectedSegment: Segment = null;

  @Input()
  public timelineOptions: TimelineOptions;

  @Output()
  public segmentSelected = new EventEmitter<Segment>();

  @Output()
  public timelineOptionsChange = new EventEmitter<TimelineOptions>();

  @ViewChild('contextOuterContainer') public contextOuterContainerElement: ElementRef;
  @ViewChild('contextContainer') public contextContainerSVGElement: ElementRef;
  @ViewChild('contextContent') public contextContentGElement: ElementRef;
  @ViewChild('contextAxis') public contextAxisGElement: ElementRef;
  @ViewChild('contextBrush') public contextBrushGElement: ElementRef;

  @ViewChild('focusOuterContainer') public focusOuterContainerElement: ElementRef;
  @ViewChild('focusContainer') public focusContainerSVGElement: ElementRef;
  @ViewChild('focusContent') public focusContentGElement: ElementRef;
  @ViewChild('focusMainContent') public focusContentMainGElement: ElementRef;
  @ViewChild('focusAuguryContent') public focusContentAuguryGElement: ElementRef;
  @ViewChild('focusAxis') public focusAxisGElement: ElementRef;

  private timelineSelection = [0, 40];
  private lastPaintedTimestamp = performance.now();

  public ngOnChanges(changes) {
    if (
      (changes.segments && this.enoughTimeHasElapsedSinceLastPaint()) ||
      changes.timelineOptions
    ) {
      this.repaint();
    } else if (changes.selectedSegment) {
      this.refreshSegmentColors();
    }
  }

  public repaint() {
    this.lastPaintedTimestamp = performance.now();
    this.paint();
  }

  private enoughTimeHasElapsedSinceLastPaint() {
    return (
      performance.now() - this.lastPaintedTimestamp >
      TimelineComponent.MinimumElapsedTimeToRepaintInMilliseconds
    );
  }

  private paint() {
    this.clearGraphs();

    const focusWidth = this.focusOuterContainerElement.nativeElement.clientWidth;
    const contextWidth = this.contextOuterContainerElement.nativeElement.clientWidth;

    if (focusWidth <= 0 || contextWidth <= 0 || this.segments.length === 0) {
      return;
    }

    const focusHeight = Math.max(
      0,
      this.focusOuterContainerElement.nativeElement.clientHeight - spacingFocus.marginBottom,
    );
    const contextOuterHeight = Math.max(
      0,
      this.contextOuterContainerElement.nativeElement.clientHeight,
    );
    const contextInnerHeight = Math.max(
      0,
      contextOuterHeight - spacingContext.marginBottom - spacingContext.marginTop,
    );

    const minStart = d3.min(this.segments, d => d.start);
    const maxEnd = d3.max(this.segments, d => d.end);

    const scaleXFocus = d3
      .scaleLinear()
      .domain([0, maxEnd - minStart])
      .range([0, focusWidth] as ReadonlyArray<number>);

    const scaleXContext = d3
      .scaleLinear()
      .domain(scaleXFocus.domain())
      .range([0, contextWidth] as ReadonlyArray<number>);

    const scaleYFocus = d3
      .scaleBand()
      .domain(TimelineComponent.RowTypes as ReadonlyArray<string>)
      .range([0, focusHeight]);

    const scaleYContext = d3
      .scaleBand()
      .domain(scaleYFocus.domain())
      .range([0, contextInnerHeight]);

    const axisXFocus = d3.axisBottom(scaleXFocus).tickFormat((d: number) => `${d} ms`);

    const axisXContext = d3
      .axisBottom(scaleXContext)
      .tickSize(spacingContext.tickSize)
      .tickFormat((d: number) => `${d} ms`);

    d3.select(this.focusAxisGElement.nativeElement)
      .attr('transform', 'translate(0, ' + focusHeight + ')')
      .call(axisXFocus);

    const brush = d3
      .brushX()
      .extent([
        [0, spacingBrush.marginTopAndBottom],
        [contextWidth, Math.max(0, contextOuterHeight - spacingBrush.marginTopAndBottom)],
      ])
      .on('brush end', () => {
        const selection = d3.event.selection || scaleXContext.range();
        d3.select(this.contextContainerSVGElement.nativeElement)
          .select('#selectionMaskBackground')
          .attr('width', selection[1] - selection[0])
          .attr('x', selection[0]);

        if (d3.event.sourceEvent) {
          switch (d3.event.sourceEvent.type) {
            case 'zoom':
              return;
            case 'end':
              this.timelineSelection = [scaleXContext(selection[0]), scaleXContext(selection[1])];
          }
        }

        const transformation = d3.zoomIdentity
          .scale(contextWidth / (selection[1] - selection[0]))
          .translate(-selection[0], 0);

        if (transformation.x === 0 && transformation.k === 1) {
          return;
        }

        scaleXFocus.domain(transformation.rescaleX(scaleXContext).domain());

        const translation =
          (transformation.k * scaleXContext(-scaleXFocus.domain()[0]) * focusWidth) / contextWidth;
        const scale = transformation.k;

        d3.select(this.focusContentGElement.nativeElement).attr(
          'transform',
          `translate(${translation}) scale(${scale}, 1)`,
        );

        d3.select(this.focusContainerSVGElement.nativeElement).call(zoom.transform, transformation);

        d3.select(this.focusAxisGElement.nativeElement).call(axisXFocus);
      });

    const zoom = d3
      .zoom()
      .scaleExtent([1, Infinity])
      .translateExtent([[0, 0], [focusWidth, focusHeight]])
      .extent([[0, 0], [focusWidth, focusHeight]])
      .on('zoom', () => {
        if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'brush') {
          return;
        } // ignore zoom-by-brush
        const transformation = d3.event.transform;

        scaleXFocus.domain(transformation.rescaleX(scaleXContext).domain());

        const translation =
          (transformation.k * scaleXContext(-scaleXFocus.domain()[0]) * focusWidth) / contextWidth;
        const scale = transformation.k;

        d3.select(this.focusContentGElement.nativeElement).attr(
          'transform',
          `translate(${translation}) scale(${scale}, 1)`,
        );

        d3.select(this.focusAxisGElement.nativeElement).call(axisXFocus);

        d3.select(this.contextBrushGElement.nativeElement).call(brush.move, [
          scaleXContext(scaleXFocus.domain()[0]),
          scaleXContext(scaleXFocus.domain()[1]),
        ]);
      });

    d3.select(this.focusContentMainGElement.nativeElement)
      .selectAll('rect')
      .data(this.segments)
      .enter()
      .append('rect')
      .attr('class', d => getSegmentClasses(d, this.selectedSegment))
      .attr('x', d => scaleXFocus(d.start - minStart) + spacingFocus.paddingInner)
      .attr('y', d => scaleYFocus(d.row))
      .attr('width', d => scaleXFocus(d.end - minStart) - scaleXFocus(d.start - minStart))
      .attr(
        'height',
        Math.max(0, focusHeight / TimelineComponent.RowTypes.length - spacingFocus.paddingInner),
      )
      .on('click', segment => this.segmentSelected.emit(segment));

    if (this.timelineOptions.showAuguryDrag) {
      d3.select(this.focusContentAuguryGElement.nativeElement)
        .selectAll('rect')
        .data(this.dragSegments)
        .enter()
        .append('rect')
        .classed('augury-segment', true)
        .attr('x', d => scaleXFocus(d.start - minStart))
        .attr('y', 0)
        .attr('width', d => scaleXFocus(d.end - minStart) - scaleXFocus(d.start - minStart))
        .attr('height', focusHeight);
    }

    d3.select(this.contextContentGElement.nativeElement)
      .selectAll('rect')
      .data(this.segments)
      .enter()
      .append('rect')
      .attr('class', d => getSegmentClasses(d, this.selectedSegment))
      .attr('x', d => scaleXContext(d.start - minStart))
      .attr('y', d => scaleYContext(d.row) + spacingContext.paddingInner + spacingContext.marginTop)
      .attr('width', d => scaleXContext(d.end - minStart) - scaleXContext(d.start - minStart))
      .attr(
        'height',
        Math.max(0, contextInnerHeight / TimelineComponent.RowTypes.length) -
          spacingFocus.paddingInner,
      );

    d3.select(this.contextAxisGElement.nativeElement)
      .style('font', '8px times')
      .attr('class', 'axis axis--x')
      .attr('transform', `translate(0, ${contextInnerHeight + spacingContext.xAxisOffset})`)
      .call(axisXContext);

    const lastSegment = this.segments[this.segments.length - 1];

    d3.select(this.contextBrushGElement.nativeElement).call(brush);

    d3.select(this.focusContainerSVGElement.nativeElement).call(zoom);

    d3.select(this.focusOuterContainerElement.nativeElement).on('wheel.zoom', () => {
      if (d3.event.shiftKey) {
        const scaledDelta = d3.event.deltaX / horizontalScrollScaleFactor;
        const selectionRange = [
          scaleXContext(scaleXFocus.domain()[0]),
          scaleXContext(scaleXFocus.domain()[1]),
        ];
        const constrainedDelta =
          scaledDelta > 0
            ? Math.min(scaleXContext.range()[1] - selectionRange[1], scaledDelta)
            : Math.max(scaledDelta, -selectionRange[0]);
        if (scaledDelta !== 0) {
          d3.select(this.contextBrushGElement.nativeElement).call(brush.move, [
            selectionRange[0] + constrainedDelta,
            selectionRange[1] + constrainedDelta,
          ]);
        }
      }
    });

    if (lastSegment) {
      const hasPassedMin = lastSegment.end > focusStartSize + 100;
      const endMs = hasPassedMin ? focusStartSize : lastSegment.end * 0.8;
      const scaleFactor =
        scaleXContext.range()[1] / (scaleXContext.domain()[1] - scaleXContext.domain()[0]);
      const pos: [number, number] = [
        scaleFactor * (this.timelineSelection ? this.timelineSelection[0] : 0),
        scaleFactor * (this.timelineSelection ? this.timelineSelection[1] : endMs),
      ];

      d3.select(this.contextBrushGElement.nativeElement).call(brush.move, pos);
    }

    d3.select(this.contextContainerSVGElement.nativeElement)
      .select('.brush .overlay')
      .attr('mask', 'url(#selectionMask)');

    d3.select(this.contextContainerSVGElement.nativeElement)
      .select('#selectionMaskCutout')
      .style('width', contextWidth)
      .style('height', contextInnerHeight)
      .attr('y', spacingContext.marginTop);
  }

  private refreshSegmentColors() {
    [this.focusContentGElement.nativeElement, this.contextContentGElement.nativeElement].forEach(
      element => {
        d3.select(element)
          .selectAll('.segment')
          .attr('class', (d: Segment) => getSegmentClasses(d, this.selectedSegment));
      },
    );
  }

  private clearGraphs() {
    this.clearGElement(this.contextContentGElement);
    this.clearGElement(this.focusContentAuguryGElement);
    this.clearGElement(this.focusContentMainGElement);
  }

  private clearGElement(elementRef: ElementRef) {
    d3.select(elementRef.nativeElement)
      .selectAll('*')
      .remove();
  }
}
