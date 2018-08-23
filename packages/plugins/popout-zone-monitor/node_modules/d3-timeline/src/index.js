require('./index.less');

var d3 = require('d3'),
	color = d3.scale.category20b(),
	_ = require('lodash'),
	util = require('util'),
	dateMath = require('date-math'),
	svgTemplate = require('./index.vash'),
	EventEmitter = require('events').EventEmitter;

var DEFAULTS = {
	beginField: 'beginTime',
	endField: 'endTime',
	getBegin: function(d){ return d[this.beginField]; },
	getEnd: function(d){ return d[this.endField]; },
	setBegin: function(d, v){ d[this.beginField] = v; },
	setEnd: function(d, v){ d[this.endField] = v; },
	getLabel: function(d){ return d.desc; },
	getColor: function(d, i){ return d.color || color(i); },
	getKey: _.identity,
};

util.inherits(Timeline, EventEmitter);

function Timeline(opts){
	if (!(this instanceof Timeline)) return new Timeline(opts);
	opts = _.extend({}, DEFAULTS, opts);

	EventEmitter.call(this);

	var self = this,
		items = [],
		foreground,
		background,
		groups,
		leftArrow,
		rightArrow,
		SCALE_HEIGHT = 32,
		h = opts.height || window.innerHeight*0.8,
		w = opts.width || window.innerWidth,
		barsViewHeight = h - (SCALE_HEIGHT*2),
		svg,
		timeAxis,
		topTimeAxis,
		timeScale,
		verticalScale,
		zoom,
		text,
		getHugeDateString = d3.time.format('%A, %B %e,  %Y %I:%M%p');

	EventEmitter.call(self);

	self.element = window.document.createElement('div');
	self.element.innerHTML = svgTemplate({});

	self.resize = function(item){

		background.filter(function(d){
			return opts.getKey(d) == opts.getKey(item);
		})
		.classed('resize', true)

		foreground.filter(function(d){
			return opts.getKey(d) == opts.getKey(item);
		})
		.classed('resize', true)
		//.style('filter', 'url(#glow)');
	};

	self.add = function(itemsToAdd){
		_.flatten([itemsToAdd])
			.forEach(function(item){
				if (item === null || item === undefined) return;
				items.push(item);
			});

		render();
	};

	self.remove = function(toRemove){
		_.remove(items, toRemove);

		render();
	};

	self.clear = function(){
		items = [];
		render();
	};

	self.update = render;

	function getBarHeight(){
		return Math.min(verticalScale.rangeBand(), h/6);
	}

	function getBeginDateTime(item){
		var val = opts.getBegin(item);
		return  val instanceof Date ? val :new Date(val);
	}

	function getEndDateTime(item){
		var val = opts.getEnd(item);

		if (val){
			return  val instanceof Date ? val :new Date(val);
		}
		return new Date();
	}

	function setEndDateTime(item, dt){
		opts.setEnd(item, dt);
	}

	function exitTransition(selection){
		selection
			.exit()
			//.selectAll('g,rect,text,path')
			.transition()
			.duration(400)
			.style('opacity', 0)
			.style('font-size', 0)
			.remove();
	}

	function dateEquals(a, b){
		return dateMath.second.diff(a, b) === 0;
	}

	function render(){
		//h = window.innerHeight - HEADER_HEIGHT,
		w = +window.innerWidth,

		_.sortBy(items, getBeginDateTime);
		timeScale = ensureTimeScale(items);

		if (svg){
			svg.attr('width', w)
				.attr('height', h);

			svg.selectAll('rect.container')
				.attr('width', w)
				.attr('height', h);

			zoom.x(timeScale);

		} else {
			zoom = d3.behavior.zoom()
				.x(timeScale)
				.translate([0, 0])
				.scale(1)
				.scaleExtent([1,100])
				.on('zoom', onZoom);

			svg = d3.select(self.element)
				.select('svg')
				.classed('the-timeline', true)
				.attr('width', w)
				.attr('height', h);


			svg
				.append('rect')
				.classed('container', true)
				.style('opacity', 0)
				.attr('width', w)
				.attr('height', h);

			svg
				.call(zoom)
				.call(zoom.event);
		}

		verticalScale = d3.scale.ordinal()
			.domain(d3.range(items.length))
			.rangeRoundBands([0,barsViewHeight], 0.15);

		groups = svg.selectAll('g.activity')
			.data(items, function(item){return item._id || item.id;});

		groups.call(exitTransition);

		groups.select('rect.background')
			.transition()
			.call(setVerticalPosition);

		groups.select('rect.foreground')
			.attr('fill', opts.getColor)
			.call(setHorizontalPosition)
			.transition()
			.call(setVerticalPosition);

		var newGroups = groups
			.enter()
			.append('g')
			.classed('activity', true)
			.style('opacity', 0)
			.on('click', function(d){
				d3.event.stopPropagation();

				var $this = d3.select(this);
				if ($this.classed('resize')){

					var dt = getEndDateTime(d);
					dt = dateMath.hour.shift(dt, 4);
					setEndDateTime(d, dt);
					
					render();
					// var w = $this.attr('width');
					// $this.attr('width', w+10);

			// console.dir(w);
				} else {
					self.emit('activity-click', d);
				}
			});

		newGroups
			.transition()
			.style('opacity', 1)
			.attr('data-id', function(d){ return d._id; });

		// background bar
		newGroups
			.append('rect')
			.classed('background', true)
			.attr('x', 0)
			.attr('width', w)
			.style('fill', '#f8f8f8')
			.call(setVerticalPosition);

		var barHeight = getBarHeight();

		// colored graph bar
		newGroups
			.append('rect')
			.classed('foreground', true)
			//.style('filter', 'url(#dropshadow)')
			.attr('rx', '15')
			.attr('ry', '15')
			.attr('width', 10)
			.attr('height', 0)
			.style('opacity', '0')
			.call(setVerticalPosition)
			.style('opacity', '1')
			.attr('fill', opts.getColor)
			.call(setHorizontalPosition)
			// .each(function(d, i){
			// 	var begin = getBeginDateTime(d),
			// 		end = getEndDateTime(d);

			// 	if (dateEquals(begin, end)){
			// 		console.log('should be a circle');
			// 		d3.select(this)
			// 			.attr('height', barHeight/2)
			// 			.attr('width', barHeight/2)
			// 			.attr('rx', barHeight/4)
			// 			.attr('ry', barHeight/4)
			// 			.attr('y', function(){ 
			// 				return verticalScale(i) + SCALE_HEIGHT + (barHeight/4);
			// 			})
			// 			.classed('event', true);
			// 	}
			// });


		var triangleSize = (barHeight*barHeight)/4;

		newGroups
			.append('text')
			.style('opacity', 0.3)
			.attr('fill', function(){ return 'black';/*d.color;*/})

		groups.select('text')
			.text(opts.getLabel)
			.transition()
			.attr('font-size', barHeight/2)
			.attr('y', function(d, i){ 
				var h = barHeight * 3/4;
				return verticalScale(i) +h + SCALE_HEIGHT;
			})
			.call(setTextPosition);

		var arc = d3.svg.symbol()
			.type('triangle-up')
			.size(triangleSize);

		newGroups
			.append('path')
			.classed('left-arrow', true)
			//.style('filter', 'url(#dropshadow)')
			.attr('fill', opts.getColor)
			.on('click', function(d){
				d3.event.stopPropagation();
				// reset the zoom
				// zoom
				// 	.scale(1)
				// 	.translate([0,0]);

				var barStart = computeBarStart(d);
				var barWidth = computeBarWidth(d);

				console.log('2barWidth vs width: ' + barWidth + '  ' + w);


				var s = w*0.8;
				var scale = s/(barWidth + barStart);
				var x = (w-(scale*(barWidth+barStart)))/2;


				svg.transition()
					.call(zoom.translate([x, 200]).scale(scale).event)
				;

				self.emit('left-click', d);
			});

		newGroups
			.append('path')
			.classed('right-arrow', true)
			.on('click', function(){
				d3.event.stopPropagation();
			})
			.attr('fill', opts.getColor)
			.on('click', function(d){
				self.emit('right-click', d);
			});

		groups.select('.left-arrow')
			.attr('d', arc)
			.attr('transform', function(d, i){ 
				var h = verticalScale(i) + (barHeight/2) + SCALE_HEIGHT;
				var x = (barHeight/3) +4;
				return 'translate('+x+',' + h +') rotate(-90)';
			});

		groups.select('.right-arrow')
			.attr('d', arc)
			.attr('transform', function(d, i){ 
				var h = verticalScale(i) + (barHeight/2) + SCALE_HEIGHT;
				var x = w - ((barHeight/3) +4);
				return 'translate('+x+','+  h +') rotate(90)';
			});
		

		background = svg.selectAll('g.activity rect.background');
		foreground = svg.selectAll('g.activity rect.foreground');
		leftArrow = svg.selectAll('g.activity .left-arrow');
		rightArrow = svg.selectAll('g.activity .right-arrow');
		text = svg.selectAll('g.activity text');



		if (!timeAxis){
			timeAxis = d3.svg.axis()
				.scale(timeScale)
				.orient('bottom');

			svg.append('g')
				.attr('class', 'time-axis')
				.attr('transform', 'translate(0, '+(h-SCALE_HEIGHT)+')')
				.call(timeAxis);


		} else {
			
			timeAxis.scale(timeScale);
			svg.select('.time-axis')
				.transition()
				.attr('transform', 'translate(0, '+(h-SCALE_HEIGHT)+')')
				.call(timeAxis);
		}

		if (!topTimeAxis){
			topTimeAxis = d3.svg.axis()
				.scale(timeScale)
				.orient('top')
				.tickValues(timeScale.domain())
				.tickFormat(function(d, i){
						return getHugeDateString(d);
				});

			svg.append('g')
				.attr('class', 'top-time-axis')
				.attr('transform', 'translate(0, '+(SCALE_HEIGHT)+')')
				.call(topTimeAxis);


		} else {
			
			topTimeAxis
				.scale(timeScale)
				.tickValues(timeScale.domain());

			svg.select('.top-time-axis')
				.transition()
				.attr('transform', 'translate(0, '+(SCALE_HEIGHT)+')')
				.call(topTimeAxis);
		}


		setArrowVisibility();
	}

	function getMinDateTime(activities){
		return d3.min(activities, getBeginDateTime);
	}
	function getMaxDateTime(activities){
		return d3.max(activities, getEndDateTime);
	}

	function ensureTimeScale(activities){
		var minTime = getMinDateTime(activities),
			maxTime = getMaxDateTime(activities);

		maxTime = maxTime || new Date();
		minTime = minTime || (function(){ 
				var a = new Date(maxTime);
				a.setHours(a.getHours()-24);
				return a;
			})();

		// console.log('min: ' + minTime);
		// console.log('max: ' + maxTime);
		// console.log('in ensureTimeScale');

		if (!timeScale) 
			timeScale = d3.time.scale();

		timeScale
			.domain([minTime, maxTime])
			.range([10, w-10]);

		return timeScale;
	}


	function computeBarWidth(d){
		var begin = timeScale(getBeginDateTime(d)), v;
		var end = timeScale(getEndDateTime(d));

		if (end) {
			v = end - begin;
		} else {
			v = timeScale(new Date()) - begin;
		}
		return Math.max(v, 6);
	}
	function computeBarStart(d){
		var x = timeScale(getBeginDateTime(d));
		return x;
	}

	function setHorizontalPosition(selection){
		selection
			.attr('x', function(d){
				return computeBarStart(d);
			})
			.filter('*:not(.event)')
			.attr('width', function(d){ 
				return computeBarWidth(d);
			})

		// if (d3.event && d3.translate){
		// 	selection.attr('transform', 'translate(' + d3.event.translate+')');
		// }

		return selection;
	}

	function setVerticalPosition(selection){
		selection
			.each(function(d, i){
				var barHeight = getBarHeight(),
					$this = d3.select(this);

				if (!$this.classed('event')){
					return $this
						.attr('height', barHeight)
						.attr('y', function(){ 
							return verticalScale(i) + SCALE_HEIGHT; 
						});
				}

				$this
					.attr('height', barHeight/2)
					.attr('width', barHeight/2)
					.attr('rx', barHeight/4)
					.attr('ry', barHeight/4)
					.attr('y', function(){ 
						return verticalScale(i) + SCALE_HEIGHT + (barHeight/4);
					});
			});

		return selection;
	}

	function setTextPosition(selection){
		selection
			.attr('x', function(d){
				var beginTime = getBeginDateTime(d);
				var endTime = getEndDateTime(d);
				var x = timeScale(beginTime);
				var begin = timeScale(beginTime), v;

				var txtWidth = this.getComputedTextLength();

				if (endTime) {
					v = timeScale(endTime) - begin;
				} else {
					v = timeScale(new Date()) - begin;
				}

				v = Math.max(v, 6) + x + 10;
				v = Math.max(v, 40);

				return Math.min(v, w-(txtWidth+40));
			});
	}

	function onZoom(){
		if (timeAxis)
			svg.selectAll('.time-axis')
				.call(timeAxis);

		if (timeAxis)
			svg.selectAll('.top-time-axis')
				.call(topTimeAxis);

		if (foreground)
			foreground.call(setHorizontalPosition);

		if (text)
			text.call(setTextPosition);

		if (leftArrow && rightArrow)
			setArrowVisibility();
	}

	function setArrowVisibility(){
		leftArrow
			.attr('visibility', function(d){
				var begin = timeScale(getBeginDateTime(d)), v;

				if (d.endTime) {
					v = timeScale(getEndDateTime(d)) - begin;
				} else {
					v = timeScale(new Date()) - begin;
				}

				return begin+v > 0 ? 'hidden' : 'visible';
			});

		rightArrow
			.attr('visibility', function(d){
				var x = timeScale(getBeginDateTime(d));
				return x < w ? 'hidden' : 'visible';
			});
	}

}


module.exports = Timeline;
