var STOP = {
	no: -1,
	soft: 0,
	hard: 1
};

var isArray = (function(){
	var toString = Object.prototype.toString;
	return function(x){
		return toString.call(x) === '[object Array]';
	};
})();

var walk = function(objectToWalk, cb){
	var keys = getKeys(objectToWalk),
		state = {
			name: null,
			value: objectToWalk,
			depth: 0,
			path: [],
			_parent: null,
			_stop: STOP.no,
			get isOwn (){ return !this.isRoot && this._parent.hasOwnProperty(this.name); },
			get isRoot (){ return this.value === objectToWalk; },
			get isCycle (){
				var o = objectToWalk;
				for (var i=0, l=this.path.length-1; i<l; i++){
					if (o === this.value) return true;
					o = o[this.path[i]];
				}
				return false;
			},
			stop: function(everything){
				if (everything){
					this._stop = STOP.hard;
				} else if (this._stop !== STOP.hard){
					this._stop = STOP.soft;
				}
			}
		};
	
	var keepGoing = cb.call(state);
	objectToWalk = state.value;

	if (keepGoing !== false && state._stop === STOP.no){
		doWalk(objectToWalk, keys, state, cb);
	}

	return objectToWalk;
};

var doWalk = function(node, keys, state, cb){
	var newKeys, value;
	state._parent = node;

	for (var i=0, l=keys.length; i<l; i++){
		state.name = keys[i];
		state.path.push(state.name);
		state.depth = state.path.length;
		state.value = value = node[state.name];
		state._stop = STOP.no;

		newKeys = getKeys(state.value);
		state.isLeaf = !newKeys || !newKeys.length;

		var keepGoing = cb.call(state);

		if (keepGoing === false){
			state.stop();
		}

		if (state.value !== value){
			if ('value' in state){
				node[state.name] = state.value;
			} else {

				// do the delete
				if (isArray(node)){
					node.splice(state.name, 1);
					i -= 1;
					l -= 1;
				}
				else {
					delete node[state.name];
				}

				state.stop();
			}
		}

		if (state._stop === STOP.no && !state.isCycle) {
			doWalk(node[state.name], newKeys, state, cb);
			if (state._stop === STOP.hard) return;
		}

		state.path.pop();

		if (state._stop === STOP.hard) return;
	}
};

var getKeys = function(value){
	var isString = typeof value === 'string';
	var arr = [];
	for (var key in value){
		if (isString && /^\d+$/.test(key)) continue;
		arr.push(key);
	}

	return arr;
};

module.exports = walk;
