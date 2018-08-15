// @todo: types

export const keys = obj => Object.keys(obj)
export const values = obj => keys(obj).map(k => obj[k])
export const merge = (...objs) => Object.assign({}, ...objs)
export const objToPairs = obj => keys(obj).map(k => ({ k, v: obj[k] }))
export const pairsToObj = kvPairs => kvPairs.reduce((obj, { k, v }) => merge(obj, { [k]: v }), {})
export const kebabToCamel = kebabString => kebabString.replace(/-\w/g, m => m[1].toUpperCase())
