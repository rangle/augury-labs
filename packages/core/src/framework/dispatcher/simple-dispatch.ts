/*

  @question:
  the dispatcher module does not implement this interface. 
  this is meant for modules that dont want to have to create their own 
    events, and prefer a simple interface that is fulfilled by their smarter parent
  not sure if this should be here..

*/

// @todo: eventName enum
export type SimpleDispatch = (eventName: string, eventPayload: any) => void;
