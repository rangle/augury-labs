export declare const keys: (obj: any) => string[]
export declare const values: (obj: any) => any[]
export declare const merge: (...objs: any[]) => any
export declare const objToPairs: (
  obj: any,
) => {
  k: string
  v: any
}[]
export declare const pairsToObj: (kvPairs: any) => any
export declare const kebabToCamel: (kebabString: any) => any
export declare const valuesEqual: (obj1: any, obj2: any) => boolean
