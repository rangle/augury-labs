declare const ng;
declare const getAllAngularRootElements: () => Element[];

export async function collectRoot(selector: string = null) {
  return new Promise((resolve, reject) => {
    let rootEl;

    if (selector) {
      rootEl = document.querySelector(selector);
    } else {
      const roots = getAllAngularRootElements();
      rootEl = roots && roots.length >= 0 ? roots[0] : null;
    }

    // Need to do setTimout to make sure ng.probe is exposed (initialized)
    setTimeout(() => {
      resolve(rootEl ? ng.probe(rootEl) : null);
    });
  });
}
