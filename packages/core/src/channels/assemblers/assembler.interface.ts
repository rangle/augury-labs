export interface Assembler<Input, Output> {
  collect(input: Input): boolean;
  finish(): Output | null;
}
