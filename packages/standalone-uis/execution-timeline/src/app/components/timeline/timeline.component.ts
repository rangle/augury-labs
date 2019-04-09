import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChange,
  SimpleChanges,
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

  @ViewChild('timelineOverviewGraph') public timelineOverviewGraphElement: ElementRef;
  @ViewChild('timelineDetailViewGraph') public timelineDetailViewGraphElement: ElementRef;

  private timelineSelection = [0, 40];

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.segments || changes.dragSegments || changes.timelineOptions) {
      this.repaint(
        this.getLastSegmentIndex(changes.segments),
        this.getLastSegmentIndex(changes.dragSegments),
      );
    } else if (changes.selectedSegment) {
      this.refreshSegmentColors();
    }
  }

  private repaint(lastSegmentIndex: number, lastDragSegmentIndex: number) {
    const segmentsToPaint = this.segments.filter((_, index) => index > lastSegmentIndex);
    const dragSegmentsToPaint = this.dragSegments.filter(
      (_, index) => index > lastDragSegmentIndex,
    );

    const boundaries = this.getGraphBoundaries();

    if (boundaries.overview.width <= 0 || boundaries.detail.width <= 0) {
      return;
    }

    const minimumMilliseconds = d3.min(this.segments, segment => segment.start);
    const maximumMilliseconds = d3.max(this.segments, segment => segment.end);

    const scaleXFocus = d3
      .scaleLinear()
      .domain([0, maximumMilliseconds - minimumMilliseconds])
      .range([0, boundaries.detail.width] as ReadonlyArray<number>);

    const scaleYFocus = d3
      .scaleBand()
      .domain(TimelineComponent.RowTypes as ReadonlyArray<string>)
      .range([0, boundaries.detail.height]);

    this.createTimelineOverviewBrush(boundaries);

    d3.select(this.timelineOverviewGraphElement.nativeElement)
      .select('#timeline-detail-segments')
      .selectAll('rect')
      .data(segmentsToPaint)
      .enter()
      .append('rect')
      .attr('class', d => getSegmentClasses(d, this.selectedSegment))
      .attr('x', d => scaleXFocus(d.start - minimumMilliseconds) + spacingFocus.paddingInner)
      .attr('y', d => scaleYFocus(d.row))
      .attr('width', d => scaleXFocus(d.end - minimumMilliseconds) - scaleXFocus(d.start - minimumMilliseconds))
      .attr(
        'height',
        Math.max(0, boundaries.detail.height / TimelineComponent.RowTypes.length - spacingFocus.paddingInner),
      )
      .on('click', segment => this.segmentSelected.emit(segment));

    /*
    const scaleXContext = d3
      .scaleLinear()
      .domain(scaleXFocus.domain())
      .range([0, contextWidth] as ReadonlyArray<number>);

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
      .data(segmentsToPaint)
      .enter()
      .append('rect')
      .attr('class', d => getSegmentClasses(d, this.selectedSegment))
      .attr('x', d => scaleXFocus(d.start - minimumMilliseconds) + spacingFocus.paddingInner)
      .attr('y', d => scaleYFocus(d.row))
      .attr('width', d => scaleXFocus(d.end - minimumMilliseconds) - scaleXFocus(d.start - minimumMilliseconds))
      .attr(
        'height',
        Math.max(0, focusHeight / TimelineComponent.RowTypes.length - spacingFocus.paddingInner),
      )
      .on('click', segment => this.segmentSelected.emit(segment));

    if (this.timelineOptions.showAuguryDrag) {
      d3.select(this.focusContentAuguryGElement.nativeElement)
        .selectAll('rect')
        .data(dragSegmentsToPaint)
        .enter()
        .append('rect')
        .classed('augury-segment', true)
        .attr('x', d => scaleXFocus(d.start - minimumMilliseconds))
        .attr('y', 0)
        .attr('width', d => scaleXFocus(d.end - minimumMilliseconds) - scaleXFocus(d.start - minimumMilliseconds))
        .attr('height', focusHeight);
    }

    d3.select(this.contextContentGElement.nativeElement)
      .selectAll('rect')
      .data(segmentsToPaint)
      .enter()
      .append('rect')
      .attr('class', d => getSegmentClasses(d, this.selectedSegment))
      .attr('x', d => scaleXContext(d.start - minimumMilliseconds))
      .attr('y', d => scaleYContext(d.row) + spacingContext.paddingInner + spacingContext.marginTop)
      .attr('width', d => scaleXContext(d.end - minimumMilliseconds) - scaleXContext(d.start - minimumMilliseconds))
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
      */
  }

  private refreshSegmentColors() {
    /*
    [this.focusContentGElement.nativeElement, this.contextContentGElement.nativeElement].forEach(
      element => {
        d3.select(element)
          .selectAll('.segment')
          .attr('class', (d: Segment) => getSegmentClasses(d, this.selectedSegment));
      },
    );
    */
  }

  private clearGElement(elementRef: ElementRef) {
    d3.select(elementRef.nativeElement)
      .selectAll('*')
      .remove();
  }

  private getLastSegmentIndex(segments: SimpleChange) {
    return (
      (segments && segments.previousValue ? segments.previousValue.length : this.segments.length) -
      1
    );
  }

  private createTimelineOverviewBrush(boundaries) {
    const brush = d3
      .brushX()
      .extent([
        [0, spacingBrush.marginTopAndBottom],
        [boundaries.overview.width, Math.max(0, boundaries.overview.height - spacingBrush.marginTopAndBottom)],
      ])
      .on('brush end', () => {
        const selection = d3.event.selection || scaleXContext.range();
        d3.select(this.timelineOverviewGraphElement.nativeElement)
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
          .scale(boundaries.overview.width / (selection[1] - selection[0]))
          .translate(-selection[0], 0);

        if (transformation.x === 0 && transformation.k === 1) {
          return;
        }

        scaleXFocus.domain(transformation.rescaleX(scaleXContext).domain());

        const translation =
          (transformation.k * scaleXContext(-scaleXFocus.domain()[0]) * focusWidth) / contextWidth;
        const scale = transformation.k;

        d3.select(this.timelineOverviewGraphElement.nativeElement)
          .select('#timeline-overview-content')
          .attr('transform', `translate(${translation}) scale(${scale}, 1)`);

        d3.select(this.focusContainerSVGElement.nativeElement).call(zoom.transform, transformation);

        d3.select(this.focusAxisGElement.nativeElement).call(axisXFocus);
      });
  }

  private getGraphBoundaries() {
    const overviewHeight = Math.max(
      0,
        this.timelineOverviewGraphElement.nativeElement.clientHeight,
    );

    return {
      overview: {
        width: this.timelineOverviewGraphElement.nativeElement.clientWidth,
        height: overviewHeight,
        innerHeight: Math.max(
          0,
          overviewHeight - spacingContext.marginBottom - spacingContext.marginTop,
        )
      },
      detail: {
        width: this.timelineDetailViewGraphElement.nativeElement.clientWidth,
        height: Math.max(
          0,
          this.timelineDetailViewGraphElement.nativeElement.clientHeight - spacingFocus.marginBottom,
        )
      }
    }
  }
}
