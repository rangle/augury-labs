var esprima = require('esprima'),
	walker = require('merle'),
	escodegen = require('escodegen');

// um, i guess this is good enough... :/
// where can i find this function?
function _isRequire(node){
	if (!node) return false;
	if (node.type !== 'CallExpression') return false;
	if (!node.callee || node.callee.type !== 'Identifier') return false;
	if (node.callee.name !== 'require') return false;

	return true;
}

function _transform(strCode, fn){
	var ast = esprima.parse(strCode);

	walker(ast, function(){
		if (!_isRequire(this.value)) return;

		var hasArg = this.value && 
			this.value.arguments && 
			this.value.arguments.length === 1;
			
		fn.call(this, hasArg? this.value.arguments[0].value : undefined);
	});

	return escodegen.generate(ast);
}

module.exports = _transform;
