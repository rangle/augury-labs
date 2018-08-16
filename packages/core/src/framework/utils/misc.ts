// @todo: types

export const keys = obj => Object.keys(obj)
export const values = obj => keys(obj).map(k => obj[k])
export const merge = (...objs) => Object.assign({}, ...objs)
export const objToPairs = obj => keys(obj).map(k => ({ k, v: obj[k] }))
export const pairsToObj = kvPairs => kvPairs.reduce((obj, { k, v }) => merge(obj, { [k]: v }), {})
export const kebabToCamel = kebabString => kebabString.replace(/-\w/g, m => m[1].toUpperCase())
export const valuesEqual = (obj1, obj2) => objToPairs(obj1).map(({ k, v }) => [v, obj2[k]]).every(pair => pair[0] === pair[1])
