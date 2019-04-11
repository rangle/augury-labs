export interface Projection<Input, Output> {
  transform(input: Input): Output | null;
}
