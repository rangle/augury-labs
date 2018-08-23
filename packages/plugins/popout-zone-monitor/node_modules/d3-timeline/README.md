d3-timeline
===========

```js
	var myTimeline = timeline({
			getBegin: function(d){ return d.beginTime; },
			getEnd: function(d){ return d.endTime; },
			getLabel: function(d){ return d.desc; },
		});

	myTimeline.add([{
			beginTime: new Date(2014, 7, 30),
			endTime: new Date(2014, 8, 1),
			desc: 'pizza',
		},
		{
			beginTime: new Date(2014, 8, 2),
			endTime: new Date(2014, 8, 4),
			desc: 'sandwich'
		},
		{
			beginTime: new Date(2014, 8, 2),
			endTime: new Date(2014, 8, 3),
			desc: 'cheeseburger',
		},
		{
			beginTime: new Date(2014, 8, 2),
			endTime: new Date(2014, 8, 6),
			desc: 'broccoli',
		}]);

	window.document.body.appendChild(myTimeline.element);
```
