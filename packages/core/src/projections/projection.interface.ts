export interface Projection<Input, Result> {
  process(input: Input): boolean;
  collectResult(): Result | null;
}
