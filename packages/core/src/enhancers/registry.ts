import { EnhancerRegistry } from '../framework/enhancers';

import { addComponentTree } from './component-tree-enhancer';
import { addRootComponent } from './root-component';

export const enhancerRegistry: EnhancerRegistry = [addComponentTree, addRootComponent];
