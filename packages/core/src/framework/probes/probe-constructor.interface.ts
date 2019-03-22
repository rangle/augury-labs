import { EmitFunction } from './emit-function.type';
import { Probe } from './probe';

export interface ProbeConstructor {
  new (emit: EmitFunction): Probe;
}
