var tmpl = require('./template.vash');
var vash = require('vash-runtime');

vash.helpers.fullName = function (model){
	return model.first + ' ' + model.last;
};

console.log(tmpl({first:'Skeet', last:'Ulrich'}));
