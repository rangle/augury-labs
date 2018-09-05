import { Probe } from './probe'

// @todo: how to get the constructor params for probe class?
//        i basically just want to say "array of probe classes"
//        "typeof Probe" doesnt let me instantiate because its an abstract class
//        i want to say "Array<typeof <P extends Probe>>", but that's not valid syntax
export type ProbeRegistry = Array<new (constructorParams) => Probe>
