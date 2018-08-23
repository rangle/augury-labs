var fs = require('fs');
var expect = require('chai').expect;
var rerequire = require('./index.js');

var esprima = require('esprima'),
	escodegen = require('escodegen');

// i lose some formatting running it through esprima/escodegen, so just do that for the expected value too.
function _getExpectedOutput(){
	var fileContents = fs.readFileSync('./examples/output.js', 'utf-8');
	return escodegen.generate(esprima.parse(fileContents));
}

describe('rerequire', function(){
	it('should work', function(){
		var input = fs.readFileSync('./examples/input.js', 'utf-8');

		var actualOutput = rerequire(input, function(){
			switch (this.value.arguments[0].value){
				case 'a':
					this.value.arguments[0].value = '1';
					break;
				case 'b':
					this.value.arguments[0].value = '2';
					break;
				case 'c':
					this.value.arguments[0].value = '3';
					break;
			}
		});

		var expectedOutput = _getExpectedOutput();
		expect(actualOutput).to.be.equal(expectedOutput);
	});
});
