re-require [![Build Status](https://travis-ci.org/chevett/re-require.png)](https://travis-ci.org/chevett/re-require)
=========

find some require statements and maybe change them if you feel like it


```js
var rerequire = require('re-require');
var fs = require('fs');
var strOldCode = fs.readFileSync('./your-killer-module.js', 'utf-8');

var strNewCode = rerequire(strOldCode, function(arg){
  // if there is a single string argument to the require call 
  // then it be passed to the callback as the only parameter.
  console.dir(arg);

  // this.value is the esprima node for a require call.
  // you can change it by overwriting or modifying this.value
  console.dir(this.value);
});
```

