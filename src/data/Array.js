define(function(require) {

	var Array = require("js/defineClass");
	var Type = require("js/Type");
	var NativeArray = this.Array;

	var Source = require("../../data/Source");
	var SourceEvent = require("../../data/SourceEvent");
	var Component = require("../Component");

	return Array(require, {
		inherits: Component,
		implementing: [Source],
		prototype: {

			_arr: null,					/*- the actual array exposed (beit filtered)*/
			_array: null,				/*- property array */
			_monitors: null,
			_busy: false,
			_onFilterObject: null,
    		_notifications: null,
    		
			_onUpdate: null,
			_onChange: null,
    		_onBusyChanged: null,
    		_onActiveChanged: null,
    		_onGetAttributeValue: null,

			constructor: function() {
				this._monitors = [];
			},
			getSize: function() {
				/** @overrides ../data/Source.prototype.getSize */
				return this._arr !== null ? this._arr.length : 0;
			},
			getObject: function(index) {
				/** @overrides ../data/Source.prototype.getObject */
				this.assertArray(index);
				return this._arr[index || 0];
			},
			getObjects: function(start, end) {
				/** @overrides ../data/Source.prototype.getObjects */
				this.assertArray(start);
				return this._arr;
			},
			getMonitor: function(start, end) {
				/** @overrides ../data/Source.prototype.getMonitor */
				this.assertArray();

	// TODO reuse code from org.cavalion.persistence.ResultList
	// create class ../data/SourceMonitor, maybe SourceMonitor can have a destroy mechanism in itself

				var monitor = {
					start: start,
					end: end,
					source: this,

					__name: function() {
						return String.format("[monitor %d-%d]", this.start, this.end);
					}
				};
				this._monitors.push(monitor);
				return monitor;
			},
			releaseMonitor: function(monitor) {
				/** @overrides ../data/Source.prototype.releaseMonitor */
				var index = this._monitors.indexOf(monitor);
				if(index === -1) {
					throw new Error("Unknown monitor");
				}
				this._monitors.splice(index, 1);
			},
			isActive: function() {
				/** @overrides ../data/Source.prototype.isActive */
				return this._arr !== null;
			},
			isBusy: function() {
				/** @overrides ../data/Source.prototype.isBusy */
				return this._busy;
			},
			notifyEvent: function(event, data) {
				/** @overrides ../data/Source.prototype.notifyEvent */
				var args = js.copy_args(arguments); args.shift();
				if(event === SourceEvent.busyChanged) {
					this.fire("onBusyChanged", args);
				} else if(event === SourceEvent.activeChanged) {
					this.fire("onActiveChanged", args);
				} else if(event === SourceEvent.updated) {
					this.fire("onUpdate", args);
				} else if(event === SourceEvent.changed) {
					this.fire("onChange", args);
				}
				this.emit("event", arguments);
			},
			getAttributeNames: function() {
				/** @overrides ../data/Source.prototype.getAttributeNames */
				if(this._arr === null) {
					return [];
				}
				var keys = [];
				this._arr.forEach(function(obj) {
					if(typeof obj !== "object") {
						obj = {'.':'.'};
					}
					if(typeof obj.getAttributeNames === "function") {
						obj.getAttributeNames.apply(this, arguments).forEach(function(name) {
							if(keys.indexOf(name) === -1) keys.push(name);
						});
					} else {
						js.keys(obj).forEach(function(key) {
							if(keys.indexOf(key) === -1) {
								keys.push(key);
							}
						});
					}
				});

				return keys;
			},
			getAttributeValue: function(name, index) {
				/** @overrides ../data/Source.prototype.getAttributeValue */
				this.assertArray(index);
				var obj = this.getObject(index || 0);
				if(name === ".") {
					return obj;
				}
				var value = typeof obj.getAttributeValue === "function" ? 
					obj.getAttributeValue(name) : 
					js.get(name, this.getObject(index || 0));
					
				if(this._onGetAttributeValue !== null) {
					value = this.fire("onGetAttributeValue", [name, index, value]);
				}
				return value;
			},
			setAttributeValue: function(name, value, index) {
				/** @overrides ../data/Source.prototype.getAttributeValue */
				this.assertArray(index);
				try {
					if(name !== ".") {
						var obj = this.getObject(index);
						if(typeof obj.setAttributeValue === "function") {
							return obj.setAttributeValue(name, value);
						}
						return js.set(name, value, obj);
					} else if(this._onFilterObject !== null) {
						index = this._array.indexOf(this._arr[index]);
					}
					return (this._array[index] = value);
				} finally {
					this.notifyEvent("updated", {start:index, end: index});
				}
			},
			loaded: function() {
				/** @overrides org.cavalion.comp.Component.prototype.loaded */
				if(this._arrayDuringLoad !== undefined) {
					this.setArray(this._arrayDuringLoad);
					delete this._arrayDuringLoad;
				}
				if(this.hasOwnProperty("_notifications")) {
				    var me = this;
				    this._notifications.forEach(function(args) {
				        me.notifyEvent.apply(this, args);
				    });

				    delete this._notifications;
				}
				return this.inherited(arguments);
			},

			notify: function() {
	            this.notifyEvent.apply(this, arguments);
			},
			indexOf: function(obj) {
				return this._arr.indexOf(obj);
			},
			assertArray: function(index) {
				if(this.isActive() === false) {
					throw new Error("No array available");
				}
				if(index !== undefined && (index < 0 || index >= this.getSize())) {
					throw new Error(String.format("Index out of bounds (%d / %d)", index, this.getSize()));
				}
			},
			
			updateFilter: function(notify) {
				if(this._onFilterObject !== null && this._array !== null) {
					var arr = [], context = { source: this };
					this._arr = this._array;
					for(var i = 0; i < this._array.length; ++i) {
						var obj = this._array[i];
						if(obj === Source.Pending || this.fire("onFilterObject", [obj, i, context]) !== true) {
							arr.push(obj);
						}
					}
					this._arr = arr;
				} else {
					this._arr = this._array;
				}
				if(notify !== false) {
					this.notify(SourceEvent.changed);
				}
			},
			getOnFilterObject: function() {
				return this._onFilterObject;
			},
			setOnFilterObject: function(value) {
				if(this._onFilterObject !== value) {
					this._onFilterObject = value;
					if(!this.isLoading()) {
						this.updateFilter();
					}
				}
			},

			getBusy: function() {
				return this._busy;
			},
			setBusy: function(value) {
				if(this._busy !== value) {
					this._busy = value;
					this.notify(SourceEvent.busyChanged, value);
				}
			},
			getArray: function() {
				return this._array;
			},
			setArray: function(value) {
				/*- if a number create an empty Array with that size */
				if(typeof value === "number") {
					return this.setArray(
						NativeArray.from(NativeArray(value), () => Source.Pending)
					);
				} else if(this.isLoading()) {
					this._arrayDuringLoad = value;
				}  else if(this._array !== value) {
					var wasActive = this.isActive();
					var isActive;

					this._array = value;

					this.updateFilter(false);

					if(wasActive !== (isActive = this.isActive())) {
						this.notify(SourceEvent.activeChanged, isActive);
					} else {
						this.notify(SourceEvent.changed);
					}

					this.notify(SourceEvent.layoutChanged);
				}
			},
			arrayChanged: function() {
				this.updateFilter(false);
				//this.notify(SourceEvent.layoutChanged);
				this.notify(SourceEvent.changed);
			},
			
			push: function() {
				this.assertArray();
				try {
					return window.Array.prototype.push.apply(this._array, arguments);
				} finally {
					this.arrayChanged();
				}
			},
			splice: function() {
				this.assertArray();
				try {
					return window.Array.prototype.splice.apply(this._array, arguments);
				} finally {
					this.arrayChanged();
				}
			},
			slice: function() {
				this.assertArray();
				try {
					return window.Array.prototype.slice.apply(this._array, arguments);
				} finally {
					this.arrayChanged();
				}
			},
			shift: function() {
				this.assertArray();
				try {
					return window.Array.prototype.shift.apply(this._array, arguments);
				} finally {
					this.arrayChanged();
				}
			},
			concat: function() {
				this.assertArray();
				return window.Array.prototype.concat.apply(this._array, arguments);
			},
			sort: function() {
				if(arguments.length === 1 && typeof arguments[0] === "string") {
					var attrs = arguments[0].split(",");
					
					var fns = attrs.map(a => (i1, i2) => i1[a] === i2[a] ? 0 : i1[a] < i2[a] ? -1 : 1);	
					
					return this.sort((i1, i2) => {
						var r = 0;
						for(var i = 0; r === 0 && i < fns.length; ++i) {
							if((r = fns[i](i1, i2)) !== 0) {
								return r;	
							}
						}
						// hmm, can not return 0... right?
						return r;
					});
				}

				var A = this._arr;
				this.assertArray();
				try {
					// TODO Hmm, this sorting of _arr feels a lil' dodgy TBH...
					// this._arr && window.Array.prototype.sort.apply(this._arr, arguments);
					this._arr = this._array;
					return window.Array.prototype.sort.apply(this._array, arguments);
				} finally {
					this._arr = A;
					this.arrayChanged();
				}
			}
		},
		properties: {
			"array": {
				type: Type.ARRAY,
				set: Function
    		},
    		"onActiveChanged": {
    			type: Type.EVENT
    		},
    		"onBusyChanged": {
    			type: Type.EVENT
			},
    		"onUpdate": {
    			type: Type.EVENT
			},
			"onChange": {
    			type: Type.EVENT
			},
			"onFilterObject": {
				type: Type.EVENT,
				editorInfo: {
					defaultValue: "(function(object, index, context) {\n\t//return {true} to exclude item from exposed array\n})"
				}
			},
			"onGetAttributeValue": {
				type: Type.EVENT,
				f: function(name, index, value) { }
			}
		}
	});

});
