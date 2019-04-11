export interface Projection<Input, Output> {
  process(input: Input): boolean;
  finish(): Output | null;
}
