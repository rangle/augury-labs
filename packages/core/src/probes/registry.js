'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const root_zone_1 = require('./root-zone')
const ng_zone_1 = require('./ng-zone')
const ng_debug_1 = require('./ng-debug')
const component_hooks_1 = require('./component-hooks')
const module_methods_1 = require('./module-methods')
exports.probeRegistry = [
  root_zone_1.RootZoneProbe,
  ng_zone_1.NgZoneProbe,
  ng_debug_1.NgDebugProbe,
  component_hooks_1.ComponentHooksProbe,
  module_methods_1.ModuleMethodsProbe,
]
//# sourceMappingURL=registry.js.map
