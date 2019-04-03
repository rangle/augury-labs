import { Enhancer } from '../framework/enhancers';
import { addComponentTree } from './component-tree-enhancer';
import { addRootComponent } from './root-component-enhancer';

export const defaultEnhancers: Enhancer[] = [addComponentTree, addRootComponent];
