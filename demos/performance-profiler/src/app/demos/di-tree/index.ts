import { DITreeComponent } from './components/di-tree';

import { Component1 } from './components/component1';
import { Component2 } from './components/component2';
import { Component3 } from './components/component3';
import { Component4 } from './components/component4';
import { Component5 } from './components/component5';
import { Component6 } from './components/component6';

import { Service1 } from './services/service1';
import { Service2 } from './services/service2';
import { Service3 } from './services/service3';
import { Service4 } from './services/service4';

export const DI_TREE_SERVICES = [Service1, Service2, Service3, Service4];

export const DI_TREE_COMPONENTS = [
  DITreeComponent,
  Component1,
  Component2,
  Component3,
  Component4,
  Component5,
  Component6,
];

export { DITreeComponent };
