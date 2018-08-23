vashify [![Build Status](https://travis-ci.org/chevett/vashify.png)](https://travis-ci.org/chevett/vashify)
=======

Use [Vash](https://github.com/kirbysayshi/vash) with [Browserify](https://github.com/substack/node-browserify) and get your templates compiled during the transform
````js
npm install vashify
````
######your-file.js
````js
var template = require('./your-template.vash');
var $ = require('jquery');

$('body').append(template({ name: 'Mike', traits: ['bro', 'tall']}));
````
######your-template.vash
```html
<h1>@model.name</h1>
<ul>
  @model.traits.forEach(function(t){ 
    <li>You are @t</t>
  })
</div>
````
######do the transform
````
browserify -t vashify your-file.js > bundle.js
````

using helpers
-------------
######require vash-runtime to register helpers
````js
var vash = require('vash-runtime');
var tmpl = require('./your-template.vash');

vash.helpers.fullName = function(model){
  return model.first + ' ' + model.last;
};

tmpl({first:'Barbra', last: 'Streisand';});
````
######calling the helpers
````html
@html.fullName(model)... @html.fullName(model).
````


What is happening?
------------------
Module references like require('*.vash') files will be intercepted during the browserify transform.  Once intercepted, the template is compiled and a new module that exports the complied template function is generated.  Next, the generated module is written to disk and the original require('my-template.vash') is replaced with a require to the generated module containing the compiled template.

This means templates that are required multiple times will only appear in the bundle once and the vash-runtime is only included once... which is good for business.
