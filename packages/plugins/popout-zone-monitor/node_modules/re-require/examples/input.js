var someModule = require('a');
var someModule1 = require('b'),
	someModule2 = require('c');


module.exports = someModule() + someModule1() + someModule2();


