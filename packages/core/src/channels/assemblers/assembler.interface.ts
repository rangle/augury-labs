export interface Assembler<Input, Output> {
  process(input: Input): boolean;
  finish(): Output | null;
}
