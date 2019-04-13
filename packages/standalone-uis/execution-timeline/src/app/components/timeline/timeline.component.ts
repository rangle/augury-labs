import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

import * as d3 from 'd3';
import { BrushBehavior } from 'd3';
import {
  getMaximumEndTimestamp,
  getMinimumStartTimestamp,
  getSegmentClasses,
} from '../../types/segment/segment.functions';
import { Segment } from '../../types/segment/segment.interface';
import { TimelineGraphAxes } from '../../types/timeline-graph/timeline-graph-axes.interface';
import { TimelineGraphRowTypes } from '../../types/timeline-graph/timeline-graph-row-types.constant';
import { scaleSelectionOnXAxis } from '../../types/timeline-graph/timeline-graph-scales.functions';
import { TimelineGraphScales } from '../../types/timeline-graph/timeline-graph-scales.interface';
import { getTimelineGraphsAxes } from '../../types/timeline-graph/timeline-graphs-axes.functions';
import {
  canTimelineGraphsPaint,
  getTimelineGraphsBoundaries,
} from '../../types/timeline-graph/timeline-graphs-boundaries.functions';
import { TimelineGraphsBoundaries } from '../../types/timeline-graph/timeline-graphs-boundaries.interface';
import { getTimelineGraphsScales } from '../../types/timeline-graph/timeline-graphs-scales.functions';
import { TimelineGraphsScales } from '../../types/timeline-graph/timeline-graphs-scales.interface';
import { TimelineOptions } from '../../types/timeline-options/timeline-options.interface';
import { isD3ZoomByBrush, updateD3RectangleData } from '../../util/d3-utils.functions';

@Component({
  selector: 'ag-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineComponent implements OnChanges {
  private static readonly MinimumElapsedTimeToRepaintInMilliseconds = 500;
  private static readonly BrushSpacingMarginTopAndBottom = 3;
  private static readonly SegmentPadding = 2;

  @Input()
  public segments: Array<Segment<any>>;

  @Input()
  public dragSegments: Array<Segment<any>>;

  @Input()
  public selectedSegment: Segment<any> = null;

  @Input()
  public timelineOptions: TimelineOptions;

  @Output()
  public segmentSelected = new EventEmitter<Segment<any>>();

  @Output()
  public timelineOptionsChange = new EventEmitter<TimelineOptions>();

  @ViewChild('timelineOverviewGraph') public timelineOverviewGraphElement: ElementRef;
  @ViewChild('timelineDetailViewGraph') public timelineDetailViewGraphElement: ElementRef;

  private timelineSelection: [number, number] = [0, 200];
  private lastPaintedTimestamp = performance.now();

  public ngOnChanges(changes: SimpleChanges) {
    if (
      (changes.segments && this.enoughTimeHasElapsedSinceLastPaint()) ||
      changes.timelineOptions
    ) {
      this.paint();
    } else if (changes.selectedSegment) {
      this.refreshSegmentColors();
    }
  }

  public onResize() {
    this.paint();
  }

  private paint() {
    const boundaries = getTimelineGraphsBoundaries(
      this.timelineOverviewGraphElement.nativeElement,
      this.timelineDetailViewGraphElement.nativeElement,
    );

    if (!canTimelineGraphsPaint(boundaries)) {
      return;
    }

    const minimumStartTimestamp = getMinimumStartTimestamp(this.segments);
    const maximumEndTimestamp = getMaximumEndTimestamp(this.segments);

    const scales = getTimelineGraphsScales(boundaries, minimumStartTimestamp, maximumEndTimestamp);
    const axes = getTimelineGraphsAxes(scales);

    this.paintTimelineOverviewAxes(boundaries.overview, axes.overview);
    this.paintTimelineDetailViewAxes(boundaries.detailView, axes.detailView);
    this.paintTimelineOverviewSegments(boundaries.overview, scales.overview, minimumStartTimestamp);
    this.paintTimelineDetailViewSegments(
      boundaries.detailView,
      scales.detailView,
      minimumStartTimestamp,
    );
    this.refreshTimelineDetailViewDragSegments(
      boundaries.detailView,
      scales.detailView,
      minimumStartTimestamp,
    );
    this.paintTimelineGraphsBrushAndZoom(boundaries, scales, axes.detailView);
    this.paintSelectionMask(boundaries.overview);
  }

  private enoughTimeHasElapsedSinceLastPaint() {
    return (
      performance.now() - this.lastPaintedTimestamp >
      TimelineComponent.MinimumElapsedTimeToRepaintInMilliseconds
    );
  }

  private paintTimelineGraphsBrushAndZoom(
    boundaries: TimelineGraphsBoundaries,
    scales: TimelineGraphsScales,
    axes: TimelineGraphAxes,
  ) {
    const brushBehaviour = d3
      .brushX()
      .extent([
        [0, TimelineComponent.BrushSpacingMarginTopAndBottom],
        [
          boundaries.overview.width,
          Math.max(
            0,
            boundaries.overview.height - TimelineComponent.BrushSpacingMarginTopAndBottom,
          ),
        ],
      ])
      .on('brush end', () => {
        const selection = d3.event.selection || scales.overview.xScale.range();

        d3.select(this.timelineOverviewGraphElement.nativeElement)
          .select('#selectionMaskBackground')
          .attr('width', selection[1] - selection[0])
          .attr('x', selection[0]);

        if (d3.event.sourceEvent) {
          switch (d3.event.sourceEvent.type) {
            case 'zoom':
              return;
            case 'end':
              this.timelineSelection = [
                scales.overview.xScale(selection[0]),
                scales.overview.xScale(selection[1]),
              ];
          }
        }

        const transformation = d3.zoomIdentity
          .scale(boundaries.overview.width / (selection[1] - selection[0]))
          .translate(-selection[0], 0);

        if (transformation.x === 0 && transformation.k === 1) {
          return;
        }

        scales.detailView.xScale.domain(transformation.rescaleX(scales.overview.xScale).domain());

        const translation =
          (transformation.k *
            scales.overview.xScale(-scales.detailView.xScale.domain()[0]) *
            boundaries.detailView.width) /
          boundaries.overview.width;

        d3.select(this.timelineDetailViewGraphElement.nativeElement)
          .select('#timeline-detail-container')
          .call(zoomBehavior.transform, transformation);

        d3.select(this.timelineDetailViewGraphElement.nativeElement)
          .select('#timeline-detail-content')
          .attr('transform', `translate(${translation}) scale(${transformation.k}, 1)`);

        this.paintTimelineDetailViewAxes(boundaries.detailView, axes);
      });

    const zoomBehavior = d3
      .zoom()
      .scaleExtent([1, Infinity])
      .translateExtent([[0, 0], [boundaries.detailView.width, boundaries.detailView.height]])
      .extent([[0, 0], [boundaries.detailView.width, boundaries.detailView.height]])
      .on('zoom', () => {
        if (isD3ZoomByBrush()) {
          return;
        }

        const transformation = d3.event.transform;

        scales.detailView.xScale.domain(transformation.rescaleX(scales.overview.xScale).domain());

        const translation =
          (transformation.k *
            scales.overview.xScale(-scales.detailView.xScale.domain()[0]) *
            boundaries.detailView.width) /
          boundaries.overview.width;

        d3.select(this.timelineDetailViewGraphElement.nativeElement)
          .select('#timeline-detail-content')
          .attr('transform', `translate(${translation}) scale(${transformation.k}, 1)`);

        d3.select(this.timelineOverviewGraphElement.nativeElement)
          .select('#timeline-overview-brush')
          .call(brushBehaviour.move, [
            scales.overview.xScale(scales.detailView.xScale.domain()[0]),
            scales.overview.xScale(scales.detailView.xScale.domain()[1]),
          ]);

        this.paintTimelineDetailViewAxes(boundaries.detailView, axes);
      });

    d3.select(this.timelineOverviewGraphElement.nativeElement)
      .select('#timeline-overview-brush')
      .call(brushBehaviour)
      .select('.brush .overlay')
      .attr('mask', 'url(#selectionMask)');

    d3.select(this.timelineDetailViewGraphElement.nativeElement)
      .select('#timeline-detail-container')
      .call(zoomBehavior);

    this.paintTimelineDetailViewMouseWheel(scales, brushBehaviour);
    this.setDefaultBrushPosition(scales.overview, brushBehaviour);
  }

  private paintTimelineDetailViewMouseWheel(
    scales: TimelineGraphsScales,
    brushBehaviour: BrushBehavior<any>,
  ) {
    d3.select(this.timelineDetailViewGraphElement.nativeElement).on('wheel.zoom', () => {
      if (d3.event.shiftKey) {
        const scaledDelta = d3.event.deltaX / 4;
        const selectionRange = [
          scales.overview.xScale(scales.detailView.xScale.domain()[0]),
          scales.overview.xScale(scales.detailView.xScale.domain()[1]),
        ];
        const constrainedDelta =
          scaledDelta > 0
            ? Math.min(scales.overview.xScale.range()[1] - selectionRange[1], scaledDelta)
            : Math.max(scaledDelta, -selectionRange[0]);

        if (scaledDelta !== 0) {
          d3.select(this.timelineOverviewGraphElement.nativeElement)
            .select('#timeline-overview-brush')
            .call(brushBehaviour.move, [
              selectionRange[0] + constrainedDelta,
              selectionRange[1] + constrainedDelta,
            ]);
        }
      }
    });
  }

  private setDefaultBrushPosition(scales: TimelineGraphScales, brushBehaviour: BrushBehavior<any>) {
    const noCurrentBrushSelection = !d3.brushSelection(d3
      .select(this.timelineOverviewGraphElement.nativeElement)
      .select('#timeline-overview-brush')
      .node() as SVGGElement);

    if (noCurrentBrushSelection) {
      d3.select(this.timelineOverviewGraphElement.nativeElement)
        .select('#timeline-overview-brush')
        .call(brushBehaviour.move, scaleSelectionOnXAxis(scales, this.timelineSelection));
    }
  }

  private paintTimelineOverviewAxes(
    boundaries: TimelineOverviewGraphBoundaries,
    axes: TimelineGraphAxes,
  ) {
    d3.select(this.timelineOverviewGraphElement.nativeElement)
      .select('#timeline-overview-axis')
      .attr('transform', `translate(0, ${boundaries.height - 22})`)
      .call(axes.xAxis);
  }

  private paintTimelineDetailViewAxes(
    boundaries: TimelineDetailViewGraphBoundaries,
    axes: TimelineGraphAxes,
  ) {
    d3.select(this.timelineDetailViewGraphElement.nativeElement)
      .select('#timeline-detail-axis')
      .attr('transform', `translate(0, ${boundaries.height - 2})`)
      .call(axes.xAxis);
  }

  private paintTimelineOverviewSegments(
    boundaries: TimelineOverviewGraphBoundaries,
    scales: TimelineGraphScales,
    minimumStartTimestamp: number,
  ) {
    updateD3RectangleData(
      d3
        .select(this.timelineOverviewGraphElement.nativeElement)
        .select('#timeline-overview-content'),
      this.segments,
      selection =>
        selection
          .attr('class', d => getSegmentClasses(d, this.selectedSegment))
          .attr('x', d => scales.xScale(d.start - minimumStartTimestamp))
          .attr('y', d => scales.yScale(d.row) + TimelineComponent.SegmentPadding + 20)
          .attr(
            'width',
            d =>
              scales.xScale(d.end - minimumStartTimestamp) -
              scales.xScale(d.start - minimumStartTimestamp),
          )
          .attr(
            'height',
            Math.max(0, boundaries.innerHeight / TimelineGraphRowTypes.length) -
              TimelineComponent.SegmentPadding,
          ),
    );
  }

  private paintTimelineDetailViewSegments(
    boundaries: TimelineDetailViewGraphBoundaries,
    scales: TimelineGraphScales,
    minimumStartTimestamp: number,
  ) {
    updateD3RectangleData(
      d3
        .select(this.timelineDetailViewGraphElement.nativeElement)
        .select('#timeline-detail-segments'),
      this.segments,
      selection =>
        selection
          .attr('class', segment => getSegmentClasses(segment, this.selectedSegment))
          .attr(
            'x',
            segment =>
              scales.xScale(segment.start - minimumStartTimestamp) +
              TimelineComponent.SegmentPadding,
          )
          .attr('y', d => scales.yScale(d.row))
          .attr(
            'width',
            segment =>
              scales.xScale(segment.end - minimumStartTimestamp) -
              scales.xScale(segment.start - minimumStartTimestamp),
          )
          .attr(
            'height',
            Math.max(
              0,
              boundaries.height / TimelineGraphRowTypes.length - TimelineComponent.SegmentPadding,
            ),
          ),
      segment => this.segmentSelected.emit(segment),
    );
  }

  private refreshTimelineDetailViewDragSegments(
    boundaries: TimelineDetailViewGraphBoundaries,
    scales: TimelineGraphScales,
    minimumStartTimestamp: number,
  ) {
    if (this.timelineOptions.showAuguryDrag) {
      this.paintTimelineDetailViewDragSegments(boundaries, scales, minimumStartTimestamp);
    } else {
      this.deleteTimelineDetailViewDragSegments();
    }
  }

  private paintTimelineDetailViewDragSegments(
    boundaries: TimelineDetailViewGraphBoundaries,
    scales: TimelineGraphScales,
    minimumStartTimestamp: number,
  ) {
    updateD3RectangleData(
      d3
        .select(this.timelineDetailViewGraphElement.nativeElement)
        .select('#timeline-detail-drag-segments'),
      this.dragSegments,
      selection =>
        selection
          .attr('x', segment => scales.xScale(segment.start - minimumStartTimestamp))
          .attr('y', 0)
          .attr(
            'width',
            segment =>
              scales.xScale(segment.end - minimumStartTimestamp) -
              scales.xScale(segment.start - minimumStartTimestamp),
          )
          .attr('height', boundaries.height),
    );
  }

  private deleteTimelineDetailViewDragSegments() {
    d3.select(this.timelineDetailViewGraphElement.nativeElement)
      .select('#timeline-detail-drag-segments')
      .selectAll('*')
      .remove();
  }

  private paintSelectionMask(boundaries: TimelineOverviewGraphBoundaries) {
    d3.select(this.timelineOverviewGraphElement.nativeElement)
      .select('#selectionMaskCutout')
      .style('width', boundaries.width)
      .style('height', boundaries.innerHeight)
      .attr('y', 20);
  }

  private refreshSegmentColors() {
    [
      this.timelineOverviewGraphElement.nativeElement,
      this.timelineDetailViewGraphElement.nativeElement,
    ].forEach(element =>
      d3
        .select(element)
        .selectAll('.segment')
        .attr('class', (segment: Segment<any>) => getSegmentClasses(segment, this.selectedSegment)),
    );
  }
}
