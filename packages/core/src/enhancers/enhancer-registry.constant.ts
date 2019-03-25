import { EnhancerRegistry } from '../framework/enhancers';

import { addComponentTree } from './component-tree-enhancer';
import { addRootComponent } from './root-component-enhancer';

export const enhancerRegistry: EnhancerRegistry = [addComponentTree, addRootComponent];
