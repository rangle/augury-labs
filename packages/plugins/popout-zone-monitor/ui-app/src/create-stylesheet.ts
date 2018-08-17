
// @todo: should be shared by other plugins
export function createStylesheet() {
  var style = document.createElement("style");

  // webkit hack
  style.appendChild(document.createTextNode(""));

  document.head.appendChild(style);

  return style.sheet as any;
}