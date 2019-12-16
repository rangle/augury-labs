export interface Query {
  propertyKey: string;
  selector: string;
}

export type Path = Array<string | number>;

export interface Dependency {
  id: string;
  name: string;
  decorators: string[];
}

export interface Property {
  id?: string;
  key: string;
  value;
}

export interface EventListener {
  name: string;
  callback: () => {};
}

export interface InputProperty {
  propertyKey: string;
  bindingPropertyName?: string;
}

// tslint:disable-next-line: no-empty-interface
export interface OutputProperty extends InputProperty {}

export interface Node {
  id: string;
  augury_token_id?: string;
  name: string;
  isComponent: boolean;
  changeDetection: number;
  description: Property[];
  nativeElement: () => HTMLElement; // null on frontend
  listeners: EventListener[];
  dependencies: Dependency[];
  directives: string[];
  providers: Property[];
  input: InputProperty[];
  output: OutputProperty[];
  source: string;
  children: Node[];
  properties: {
    [key: string]: any;
  };
  attributes: {
    [key: string]: string;
  };
  classes: {
    [key: string]: boolean;
  };
  styles: {
    [key: string]: string;
  };
}
