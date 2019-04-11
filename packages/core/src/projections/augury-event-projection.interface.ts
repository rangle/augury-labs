import { AuguryEvent } from '../events';
import { Projection } from './projection.interface';

export interface AuguryEventProjection<Output> extends Projection<AuguryEvent, Output> {}
