var tt = require('browserify-transform-tools'),
	fs = require('fs'),
	path = require('path'),
	mkdirp = require('mkdirp'),
	path = require('path'),
	resolve = require('resolve'),
	rerequire = require('re-require'),
	vash = require('vash');

vash.config.debug = !(/^prod(uction)?$/i).test(process.env.NODE_ENV);

var counter = 0;
var lookup = Object.create(null);
var moduleTemplate = vash.compile(fs.readFileSync(__dirname + '/module.vash').toString());

var VASH_DIRECTORY = path.dirname(resolve.sync('vash'));
var VASH_RUNTIME_LOCATION = path.join(VASH_DIRECTORY, 'vash-runtime-all.min.js');
var VASH_TEMPLATE_REGEX = [
	/\.vash$/i,
	/\.aspx$/i
];

mkdirp.sync(__dirname + '/.temp');

function isVashTemplate(fileName){
	return VASH_TEMPLATE_REGEX.some(function(regex){
		return regex.test(fileName);
	});
}

function isVashLibrary(fileName){
	return (/^vash-runtime$/i).test(fileName);
}

function postProcessVashTemplate(strJavascript, absoluteFileLocation){
	var dirName = path.dirname(absoluteFileLocation);

	return rerequire(strJavascript, function(){

		var arg = this.value.arguments[0].value;

		if (!/\.vash$/i.test(arg)) return;

		var fn;
		var file = path.resolve(dirName, arg); 
		var strTmpl = fs.readFileSync(file, 'utf-8');

		try {
			fn = vash.compile(strTmpl);
		}
		catch (e){
			process.stderr.write('Error compiling: ' + file + '\n');
			throw e;
		}

		this.value.arguments[0].value = writeCompiledTemplate(fn.toClientString(), file);
	});
}

function writeCompiledTemplate(strJavascript, absoluteFileName){
	var moduleLocation = lookup[absoluteFileName];
	if (moduleLocation) return moduleLocation;

	var basename = path.basename(absoluteFileName);

	var moduleContents = postProcessVashTemplate(moduleTemplate({
		vashRuntimeLocation: VASH_RUNTIME_LOCATION.replace(/\\/g, '\\\\'),
		clientString: strJavascript
	}), absoluteFileName);

	moduleLocation = lookup[absoluteFileName] = path.join(__dirname,  '.temp', counter++ + '_'+basename + '.js');
	fs.writeFileSync(path.normalize(moduleLocation), moduleContents);

	return moduleLocation;
}

function compileVashTemplate(relativeTemplateReference, moduleFile){
	var templateFileName = relativeTemplateReference.match(/[^\/]*$/)[0];
	var moduleDirName = path.dirname(moduleFile);
	var fullTemplateFileName = path.resolve(moduleDirName, relativeTemplateReference);

	var strTmpl;
	try {
		strTmpl = fs.readFileSync(fullTemplateFileName);
	}
	catch (e){
		process.stderr.write('Error reading: ' + templateFileName + '\n');
		throw e;
	}

	var fn;
	try {
		fn = vash.compile(strTmpl.toString());
	}
	catch (e){
		process.stderr.write('Error compiling: ' + templateFileName + '\n');
		throw e;
	}

	var moduleLocation = writeCompiledTemplate(fn.toClientString(), fullTemplateFileName);
	return 'require("'+moduleLocation.replace(/\\/g, '\\\\') + '")';
}

var makeTransform = tt.makeRequireTransform.bind(tt, 'vashify', {evaluateArguments: true, jsFilesOnly: true});
var myTransform = makeTransform(function(args, opts, cb) {
	var arg0 = args[0];

	if (isVashLibrary(arg0)) {
		return cb(null, 'require("' + VASH_RUNTIME_LOCATION.replace(/\\/g, '\\\\') + '")');
	}
	
	if (isVashTemplate(arg0)) {
		return cb(null, compileVashTemplate(arg0, opts.file));
	}

	return cb();
});


module.exports = myTransform;
