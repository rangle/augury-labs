export function intersection<T>(a: Set<T>, b: Set<T>): Set<T> {
  return new Set<T>([...a].filter(x => b.has(x)));
}

export function difference<T>(a: Set<T>, b: Set<T>): Set<T> {
  return new Set<T>([...a].filter(x => !b.has(x)));
}
