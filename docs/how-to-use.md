# How To Use

## Performance Profiler

Once you have the the performance profiler [installed](../README.md#installation), you can launch
your application either using `ng -c augury serve` or with the convenience npm script
`npm run start:augury`. This will serve your application with augury collecting information in the
background. Upon launch it display a popup window with the performance profiler dashboard.

_NOTE: The Augury Performance Profiler will add additional load to your application so it will
run noticably slower. Augury tracks its own processing time and subtacts this from results. However,
the overall timeline will be extended due to the instrumentation overhead._

### Overview

The performance profiler is split into 3 main sections (control panel, timeline, and event details).

#### Control Panel

The control panel on the right allows you to start & pause instrumentation along and also clear the
timeline overview. This makes it easier to focus on specific areas that you would like to
investigate in detail for a given period of time.

#### Timeline Overview

The top timeline shows the overall time since recording was started. This will give you the big
picture of when certain events occured while you've been recording. You can select specific areas
by zooming and panning the selected range. This selected area will displayed in the timeline detail
below.

#### Timeline Detail View

The bottom timeline displays the area that is currently selected in the timeline overview. You can
click on different events to display further details.

#### Event Details

When you click on a event in the timeline detail view it will display details below. Each event
type has a different view that is relevenat to the specific event. There are 3 main types of events
that occur within the timeline.

**Zone Task Details**

`Zone.js` wraps all macro & micro tasks that occur as part of the JavaScript event queue. This
allows Angular to determine when something changed and trigger a process to start updating the
application to reflect any changes that occured.

- Displays all `Zone.js` tasks that occurred.
- There are often many zone tasks that occur (typically macro tasks take longer).
- Most zone task events contain details about the trigger and source of the task.
- Zone tasks are normally what triggers an Angular instability period.
- Angular creates a main `NgZone` which most Angular related tasks will be part of. However,
  there is also a global root which some tasks can occur in.
- Some macro tasks include `DOM events`, `xhr`, `setTimeout`, `setInternal`, `setImmediate`,
  `requestAnimationFrame`.
- Some micro tasks include `process.nextTick`, `Promises`, `Object.observe`, `MutationObserver`.
- The profiler can also detect when tasks occur outside of a zone. This is sometimes done
  intentionally to improve performance by avoiding uncessary change detection to occur. Other times this can cause unwanted results.

**Instability Period Details**

In most scenarions a `zone` task will cause Angular to become unstable. This is a period in which
Angular will attempt to reconcile what has occured and what changes must be made and then execute
updates to refresh the component tree and underlying DOM elements.

- The beginning of this event means Angular became unstable.
- The end of this event Angular became stable again.
- There is typically a single change detection cycle within each instablility period.
- Each event contains details about how the component tree changed from the previous period.
- Green represents components that were added while red represents components that were
  removed during this instability period.

**Change Detection Run**

The change dectection runs indicate when & how long it took for Angular to run a single change
detection cycle. This process requires Angular to traverse the component tree in order to see what
has changed and what needs to be updated.

- This segement is always part of an `angular instability` period.
- It is common for change detection to occur fequently when interacting with the application. Too
  many in a short period or cycles that appear to take a long time can indicate an issue ([see below](#tips)).

### Tips

- Consider using `ChangeDetectionStrategy.OnPush` on your components. This will tell Angular to not
  run change detection on the component and children. This can help if you component tree is very
  large or some components take a while to check.
- Make sure your using `trackBy` when using `*ngFor`.
- Avoid complex inline binding expressions in templates.

_NOTE: This topic can be quite involved. There are many online resources on these and other techniques
to help improve performance of your angular applications._
