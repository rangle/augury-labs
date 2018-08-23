#!/usr/bin/env node

var fs = require("fs");
var browserify = require('browserify');
var lessify = require("../index");
var assert = require("assert");

var sampleLESS = __dirname + "/nonsense.less";

var b = browserify(sampleLESS);
//b.add(sampleLESS);
//b.add(sampleCSS);
b.transform(lessify);

b.bundle(function (err, src) {
	if (err) {
		console.error(err);
		assert.fail(err);
	}
	assert.ok(src);
	fs.writeFileSync(__dirname + "/bundle.js", src.toString());
});