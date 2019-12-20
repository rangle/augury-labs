import * as clone from 'clone';
import { Dependency, InputProperty, Node, OutputProperty, Path, Property } from './tree-types';

declare const Reflect;

export const AUGURY_TOKEN_ID_METADATA_KEY = '__augury_token_id';

export const transform = (
  path: Path,
  element,
  cache: Map<string, Node>,
  count: (n: number) => void,
): Node => {
  if (element == null) {
    return null;
  }

  const serializedPath = serializePath(path);

  const existing = cache.get(serializedPath);
  if (existing) {
    return existing;
  }

  const listeners = element.listeners.map(l => clone(l));

  const name = getComponentName(element);

  const isComponent = isDebugElementComponent(element);

  const metadata = element.componentInstance
    ? componentMetadata(element.componentInstance.constructor)
    : null;

  const changeDetection = isComponent ? getChangeDetection(metadata) : null;

  const node: Node = {
    id: serializedPath,
    augury_token_id: element.componentInstance
      ? Reflect.getMetadata(AUGURY_TOKEN_ID_METADATA_KEY, element.componentInstance.constructor)
      : null,
    name,
    listeners,
    isComponent,
    providers: getComponentProviders(element, name).filter(p => p.key != null),
    attributes: clone(element.attributes),
    classes: clone(element.classes),
    styles: clone(element.styles),
    children: null, // initial value
    directives: [],
    source: element.source,
    changeDetection,
    nativeElement: () => element.nativeElement, // this will be null in the frontend
    description: Description.getComponentDescription(element),
    input: componentInputs(metadata, element.componentInstance),
    output: componentOutputs(metadata, element.componentInstance),
    properties: clone(element.properties),
    dependencies: isDebugElementComponent(element)
      ? getDependencies(element.componentInstance)
      : [],
  };
  /// Set before we search for children so that the value is cached and the
  /// reference will be correct when transform runs on the child
  cache.set(serializedPath, node);

  node.children = [];

  const transformChildren = (children: any[]) => {
    let subindex = 0;

    children.forEach(c =>
      node.children.push(transform(path.concat([subindex++]), c, cache, count)),
    );
  };

  const getChildren = (test: (compareElement) => boolean): any[] => {
    const children = element.children.map(c => matchingChildren(c, test));

    return children.reduce((previous, current) => previous.concat(current), []);
  };

  const childHybridComponents = () => {
    return getChildren(e => e.providerTokens && e.providerTokens.length > 0);
  };

  transformChildren(childHybridComponents());

  count(1 + node.children.length);

  return node;
};

const recursiveSearch = (children: any[], test: (element) => boolean): any[] => {
  const result = new Array<any>();

  for (const c of children) {
    if (test(c)) {
      result.push(c);
    } else {
      Array.prototype.splice.apply(
        result,
        ([result.length, 0] as any).concat(recursiveSearch(c.children, test)),
      );
    }
  }

  return result;
};

const serializePath = (path: Path): string => {
  return path.join(' ');
};

const matchingChildren = (element, test: (element) => boolean): any[] => {
  if (test(element)) {
    return [element];
  }
  return recursiveSearch(element.children, test);
};

const getComponentProviders = (element, name: string): Property[] => {
  let providers = new Array<Property>();

  if (element.providerTokens && element.providerTokens.length > 0) {
    providers = element.providerTokens.map(provider =>
      Description.getProviderDescription(provider, element.injector.get(provider)),
    );
  }

  if (name) {
    return providers.filter(provider => provider.key !== name);
  } else {
    return providers;
  }
};

const getChangeDetection = (metadata): number => {
  if (metadata && metadata.changeDetection !== undefined && metadata.changeDetection !== null) {
    return metadata.changeDetection;
  } else {
    return 1;
  }
};

const getDependencies = (instance): Dependency[] => {
  const parameterDecorators = injectedParameterDecorators(instance) || [];
  const normalizedParamTypes = parameterTypes(instance).map((type, i) =>
    type
      ? type
      : Array.isArray(parameterDecorators[i])
      ? (() => {
          const decoratorToken = parameterDecorators[i].find(item => item.token !== undefined);
          return decoratorToken ? decoratorToken.token : 'unknown';
        })()
      : 'unknown',
  );

  return normalizedParamTypes
    .filter(paramType => typeof paramType === 'function')
    .map((paramType, i) => ({
      id: Reflect.getMetadata(AUGURY_TOKEN_ID_METADATA_KEY, paramType),
      name: functionName(paramType) || paramType.toString(),
      decorators: parameterDecorators[i] ? parameterDecorators[i].map(d => d.toString()) : [],
    }));
};

const componentMetadata = token => {
  if (!token) {
    return null;
  }

  const ANNOTATIONS_PROP_KEY = '__annotations__';

  // since angular v5 this should work
  const metadata = (token[ANNOTATIONS_PROP_KEY] || []).find(
    d => Object.getPrototypeOf(d).ngMetadataName === 'Component',
  );

  return metadata
    ? metadata
    : // Otherwise we fall back to the old way
      (Reflect.getOwnMetadata('annotations', token) || []).find(d => d.toString() === '@Component');
};

const functionName = (fn: () => {}): string => {
  const extract = (value: string) => value.match(/^function ([^\(]*)\(/);

  let name: string = (fn as any).name;
  if (!name || name.length === 0) {
    const match = extract(fn.toString());
    if (match != null && match.length > 1) {
      name = match[1];
    }
  }

  if (typeof name !== 'string' || name === '') {
    name = 'anonymous';
  }

  name = name.replace(/[^\w]/gi, '_');

  if (!isNaN(parseInt(name[0], 10))) {
    name = '__num_' + name[0];
  }

  return name;
};

const componentInstanceExistsInParentChain = debugElement => {
  const componentInstanceRef = debugElement.componentInstance;
  while (componentInstanceRef && debugElement.parent) {
    if (componentInstanceRef === debugElement.parent.componentInstance) {
      return true;
    }
    debugElement = debugElement.parent;
  }
  return false;
};

const isDebugElementComponent = element =>
  !!element.componentInstance && !componentInstanceExistsInParentChain(element);

const getComponentName = (element): string => {
  if (
    element.componentInstance &&
    element.componentInstance.constructor &&
    !componentInstanceExistsInParentChain(element)
  ) {
    return functionName(element.componentInstance.constructor);
  } else if (element.name) {
    return element.name;
  }

  return element.nativeElement.tagName.toLowerCase();
};

const propertyDecorators = (instance): any[] =>
  Reflect.getOwnMetadata('propMetadata', instance.constructor) || [];

const parameterTypes = (instance): any[] => {
  return (Reflect.getOwnMetadata('design:paramtypes', instance.constructor) || []).map(param =>
    typeof param !== 'function' || param.name === 'Object' ? null : param,
  );
};

const injectedParameterDecorators = (instance): any[] =>
  Reflect.getOwnMetadata('parameters', instance.constructor) ||
  instance.constructor.__parameters__ ||
  instance.constructor.__paramaters__; // angular 5.1 has a typo

const iteratePropertyDecorators = (instance, fn: (key: string, decorator) => void) => {
  if (instance == null) {
    return;
  }

  const decorators = propertyDecorators(instance);

  for (const key of Object.keys(decorators)) {
    for (const meta of decorators[key]) {
      fn(key, meta);
    }
  }
};

const componentInputs = (metadata, instance): InputProperty[] => {
  const inputs: InputProperty[] = ((metadata && metadata.inputs) || []).map(p => ({
    propertyKey: p,
  }));

  iteratePropertyDecorators(instance, (key: string, meta) => {
    if (inputs.find(i => i.propertyKey === key) == null) {
      if (meta.toString() === '@Input') {
        inputs.push({ propertyKey: key, bindingPropertyName: meta.bindingPropertyName });
      }
    }
  });

  return inputs;
};

const componentOutputs = (metadata, instance): OutputProperty[] => {
  const outputs: OutputProperty[] = ((metadata && metadata.outputs) || []).map(p => ({
    propertyKey: p,
  }));

  iteratePropertyDecorators(instance, (key: string, meta) => {
    if (meta.toString() === '@Output') {
      outputs.push({ propertyKey: key, bindingPropertyName: meta.bindingPropertyName });
    }
  });

  return Array.from(outputs);
};

const pathExists = (object: any, ...args: any[]): boolean => {
  return getAtPath(object, ...args).exists;
};

const getAtPath = (obj: any, ...args: any[]): any => {
  // tslint:disable-next-line: prefer-for-of
  for (let i = 0; i < args.length; i++) {
    if (!obj || !(args[i] in obj)) {
      return { exists: false, value: void 0 };
    }

    obj = obj[args[i]];
  }
  return {
    exists: true,
    value: obj,
  };
};

const getPropsIfTheyExist = (object: any, props: any[][]): any[] => {
  const properties: any[] = [];
  props.forEach((prop: any[]) => {
    const label = prop[0];
    const path = prop.length > 1 ? prop.slice(1, prop.length) : prop[0];

    if (pathExists(object, ...path)) {
      properties.push({ key: label, value: getAtPath(object, ...path).value });
    }
  });
  return properties;
};

export const randomId = () => {
  return Math.random()
    .toString(36)
    .substring(7);
};

abstract class Description {
  public static getProviderDescription(provider, instance): Property {
    if (typeof provider === 'string') {
      return {
        key: provider,
        value: null,
      };
    }
    return {
      id: Reflect.getMetadata(AUGURY_TOKEN_ID_METADATA_KEY, provider),
      key: provider.name,
      value: null,
    };
  }

  public static getComponentDescription(debugElement: any): Property[] {
    if (debugElement == null) {
      return [];
    }

    let componentName: any;
    const element: any = pathExists(debugElement, 'nativeElement')
      ? debugElement.nativeElement
      : null;

    if (debugElement.componentInstance && !componentInstanceExistsInParentChain(debugElement)) {
      componentName = pathExists(debugElement, 'componentInstance', 'constructor', 'name')
        ? debugElement.componentInstance.constructor.name
        : null;
    } else {
      componentName = pathExists(element, 'tagName') ? element.tagName.toLowerCase() : null;
    }

    const properties = [];

    switch (componentName) {
      case 'a':
        return getPropsIfTheyExist(element, [['text'], ['hash']]);
      case 'form':
        return getPropsIfTheyExist(element, [['method']]);
      case 'input':
        return getPropsIfTheyExist(element, [['id'], ['name'], ['type'], ['required']]);
      case 'router-outlet':
        const routerOutletProvider = debugElement.providerTokens.reduce(
          (prev, curr) => (prev ? prev : curr.name === 'RouterOutlet' ? curr : null),
          null,
        );
        return getPropsIfTheyExist(debugElement.injector.get(routerOutletProvider), [['name']]);
      case 'NgSelectOption':
        return element ? Description._getSelectOptionDesc(element) : [];
      case 'NgIf':
        return Description._getNgIfDesc(debugElement.componentInstance);
      case 'NgControlName':
        return Description._getControlNameDesc(debugElement.componentInstance);
      case 'NgSwitch':
        return Description._getNgSwitchDesc(debugElement.componentInstance);
      case 'NgSwitchWhen':
      case 'NgSwitchDefault':
        return Description._getNgSwitchWhenDesc(debugElement.componentInstance);
    }
    return properties;
  }

  private static _getSelectOptionDesc(element: HTMLElement): Property[] {
    return getPropsIfTheyExist(element, [['label', 'innerText']]).concat([
      { key: 'value', value: element.getAttribute('value') },
    ]);
  }

  private static _getControlNameDesc(instance: any): Property[] {
    return getPropsIfTheyExist(instance, [['name'], ['value'], ['valid']]);
  }

  private static _getNgSwitchDesc(instance: any): Property[] {
    const properties = getPropsIfTheyExist(instance, [
      ['useDefault', '_useDefault'],
      ['switchDefault', '_switchValue'],
      ['valuesCount', '_valueViews'],
    ]);

    properties
      .filter(element => element.key === 'valuesCount')
      .forEach(element => (element.value = element.value ? element.value.size : 0));

    return properties;
  }

  private static _getNgSwitchWhenDesc(instance: any): Property[] {
    return getPropsIfTheyExist(instance, [['value', '_value']]);
  }

  private static _getNgIfDesc(instance: any): Property[] {
    return getPropsIfTheyExist(instance, [['condition', '_prevCondition']]);
  }
}
