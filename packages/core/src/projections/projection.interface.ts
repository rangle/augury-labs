export interface Projection<Input, Output> {
  process(input: Input): boolean;
  collectResult(): Output | null;
}
