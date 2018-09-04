'use strict'
// @todo: types
Object.defineProperty(exports, '__esModule', { value: true })
exports.keys = obj => Object.keys(obj)
exports.values = obj => exports.keys(obj).map(k => obj[k])
exports.merge = (...objs) => Object.assign({}, ...objs)
exports.objToPairs = obj => exports.keys(obj).map(k => ({ k, v: obj[k] }))
exports.pairsToObj = kvPairs =>
  kvPairs.reduce((obj, { k, v }) => exports.merge(obj, { [k]: v }), {})
exports.kebabToCamel = kebabString => kebabString.replace(/-\w/g, m => m[1].toUpperCase())
exports.valuesEqual = (obj1, obj2) =>
  exports
    .objToPairs(obj1)
    .map(({ k, v }) => [v, obj2[k]])
    .every(pair => pair[0] === pair[1])
//# sourceMappingURL=misc.js.map
