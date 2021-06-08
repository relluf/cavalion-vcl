define(function(require) {

//	var js = require("js");
	var JsObject = require("js/JsObject");

	var Writer = {
		inherits: JsObject,
		prototype: {
			_root: null,
			_str: null,
			_writeAll: false,
			_stack: null,
			_inherited: false,
			
			constructor: function(root, uri, inherited, all) {
				this._str = [];
				this._root = root;
				this._inherited = inherited === true;
				this._uri = uri || this._root.getUri();
				this._writeAll = all;
			},
			isComponentInherited: function(component) {
				if(this._inherited === false) {
					return false;
				}
				return component !== this._root ? component.getUri() !== this._uri : this._inherited;
			},
			includeComponent: function(component) {
				return true;
			},
			includeProperty: function(component, property) {
				return true;
			},
			beginRedirect: function() {
				if(!this._stack) {
					this._stack = [];
				}
				this._stack.push(this._str);
				return (this._str = []);
			},
			endRedirect: function() {
				if(!this._stack) {
					throw new Error("No stack");
				}
				var str = this._str;
				this._str = this._stack.pop();
				if(!this._stack.length) {
					this._stack = null;
				}
				return str;
			},
			write: function(component, semicolon) {
				/** Writes a component and its owned components. */
				this._writeComponent(component || this._root);
				return this._str.join("") + (semicolon !== false ? ";" : "");
			},

			/* TODO refactor these underscores away */	
			_write: function(s) {
				/** Writes s */
				this._str.push(s);
			},
			_writeComponent: function(component) {
				/** Writes a component and its owned components. */
				var n = component.getName();
				var isInherited = this.isComponentInherited(component);
				var properties;
				var children;
				var r, e;
	
				var strP = this.beginRedirect();
				try {
					properties = this._writeProperties(component);
				} finally {
					this.endRedirect();
				}
	
				var strC = this.beginRedirect();
				try {
					children = this._writeChildren(component);
				} finally {
					this.endRedirect();
				}
	
				if(isInherited && n === "" && component !== this._root) {
					if(properties === true) {
						e = new Error(String.format("Unnamed component detected with overridden properties (%n)", component));
						e.str = strP;
						throw e;
					}
					if(children === true) {
						var thisObj = this;
						var test = function(child) {
							if(!thisObj.isComponentInherited(child)) {
								e = new Error(String.format("Unnamed component (%n) detected with child (%n)", component, child));
								e.str = strC;
								throw e;
							}
						};
						component.getChildren(test, this._root);
	
						this._write(strC.join(""));
						return true;
					}
				}
	
	// FIXME could check here to see whether all children are inherited and no properties are set, so that only the children can be written
	
				if(component === this._root || (r = isInherited === false || properties === true || children === true || this._writeAll === true) === true) {
					if(!this._writeAll && isInherited) {
						if(component === this._root) {
							this._write("$root(");
							// FIXME if(n !== "" || nobaseforthiscomponent) {
							this._write(String.format("\"%s\"", component.getClass().getName()));
							if(n !== "") {
								this._write(String.format(",\"%s\"", n));
							}
	//						this._write(",");
						} else {
							this._write("$i(");
							this._write(String.format("\"%s\"", n));
							//this._write(",");
						}
					} else {
						this._write((component === this._root) ? "$root(" : "$(");
						this._write(String.format("\"%s\"", component.getClass().getName()));
						if(n !== "") {
							this._write(String.format(",\"%s\"", n));
						}
					}
					if(children || properties) {
						this._write(",");
						this._write(strP.join(""));
					}
					if(children) {
						this._write(",[");
						this._write(strC.join(""));
						this._write("]");
					}
					this._write(")");
				}
				return r;
			},
			_writeProperties: function(component) {
				/** Writes the properties of a component. */
				var r = false;
				var props = component.defineProperties();
				var hadValue = false;
				var keys = js.keys(props).sort();
				var str = this.beginRedirect();
				var isInherited = this.isComponentInherited(component);
	
				try {
					if(this.includeComponent(component)) {
						for(var p = 0, l = keys.length; p < l; ++p) {
							var key = keys[p];
							var prop = props[key];
	
							if(prop.isStored(component) && this.includeProperty(component, prop)) {
								var hasInheritedValue = isInherited && prop.hasInheritedValue(component);
	
								if(this._writeAll || !hasInheritedValue) {
									try {
										var value = prop.get(component);
										// FIXME reference?
										if(value instanceof org.cavalion.comp.Component) {
											if(value.getName() && (value === this._root || value.getOwner() === this._root)) {
												value = value ? value.getName() : "";
											} else {
												continue;
											}
										}
										r = true;
										if(hadValue) {
											this._write(",");
										} else {
											hadValue = true;
										}
										if(js.keyNeedsEscape(key)) {
											key = String.escape(key);
										}
										if(typeof(value) !== "function") {
											if(value === null || typeof(value) !== "object" || !value.getClass) {
												this._write(String.format("%s:%s", key, js.sj(value)));
											} else {
												this._write(String.format("%s:", key));
												this._writeProperties(value);
											}
										} else {
											this._write(String.format("%s:%s", key, value));
										}
									} catch(e) {
										throw new Error(String.format("Could not write property %n.%s", component, key), e);
									}
								}
							}
						}
					}
				} finally {
					this.endRedirect();
				}
				if(r === true) {
					this._write("{");
					this._write(str.join(""));
					this._write("}");
				} else {
					this._write("{}");
				}
	
				return r;
			},
			_writeChildren: function(component, array) {
				/** Writes the children of the component, nested. */
				var hasChildren = false;
	
				// FIXME This must be optimized
				var test = function(child) { hasChildren = true; };
				component.getChildren(test, this._root);
	
				if(hasChildren) {
					var self = this;
					var n = 0;
					var str = this.beginRedirect();
	
					try {
	
						function func(child) {
							var str = self.beginRedirect();
							var written = this._writeAll || self._writeComponent(child);
							self.endRedirect();
							if(written) {
								if(n) {
									self._write(",");
								}
								n++;
								for(var i = 0, l = str.length; i < l; ++i) {
									self._write(str[i]);
								}
							}
	
						}
	
						component.getChildren(func, this._root);
					} finally {
						this.endRedirect();
					}
					if(str.length > 0) {
						this._write(str.join(""));
					}
					return str.length > 0;
				}
				return false;
			}
		},
		statics: {
			write: function(component, uri, inherited) {
				var writer = new org.cavalion.comp.Writer(component, uri, inherited);
				return writer.write(component);
			}
		},
		properties: {}
	};

	return (Writer = Class.define("./Writer", Writer));
});


/**
 * org/cavalion/comp/Writer.js
 */
// js.lang.Class.declare("org.cavalion.comp.Writer", {

// 	/**
// 	 * Base class
// 	 */
// 	Extends: js.lang.Object,

// 	/**
// 	 * Implemented interfaces
// 	 */
// 	Implements: [

// 	],

// 	/**
// 	 * Member definitions
// 	 */
// 	Members: {
// 		_root: null,
// 		_str: null,
// 		_writeAll: false,
// 		_stack: null,
// 		_inherited: false
// 	},

// 	/**
// 	 * Constructor
// 	 */
// 	Constructor: function(root, uri, inherited, all) {
// 		this._str = [];
// 		this._root = root;
// 		this._inherited = inherited === true;
// 		this._uri = uri || this._root.getUri();
// 		this._writeAll = all;
// 	},

// 	/**
// 	 * Method definitions
// 	 */
// 	Methods: {

// 		/**
// 		 *
// 		 */
// 		isComponentInherited: function(component) {
// 			if(this._inherited === false) {
// 				return false;
// 			}
// 			return component !== this._root ? component.getUri() !== this._uri : this._inherited;
// 		},

// 		/**
// 		 *
// 		 */
// 		includeComponent: function(component) {
// 			return true;
// 		},

// 		/**
// 		 *
// 		 */
// 		includeProperty: function(component, property) {
// 			return true;
// 		},

// 		/**
// 		 *
// 		 */
// 		beginRedirect: function() {
// 			if(!this._stack) {
// 				this._stack = [];
// 			}
// 			this._stack.push(this._str);
// 			return (this._str = []);
// 		},

// 		/*
// 		 *
// 		 */
// 		endRedirect: function() {
// 			if(!this._stack) {
// 				throw new Error("No stack");
// 			}
// 			var str = this._str;
// 			this._str = this._stack.pop();
// 			if(!this._stack.length) {
// 				this._stack = null;
// 			}
// 			return str;
// 		},

// 		/**
// 		 *	Writes a component and its owned components.
// 		 */
// 		write: function(component, semicolon) {
// 			this._writeComponent(component || this._root);
// 			return this._str.join("") + (semicolon !== false ? ";" : "");
// 		},

// 		/**
// 		 *	Writes s
// 		 */
// 		_write: function(s) {
// 			this._str.push(s);
// 		},

// 		/**
// 		 *	Writes a component and its owned components.
// 		 */
// 		_writeComponent: function(component) {
// 			var n = component.getName();
// 			var isInherited = this.isComponentInherited(component);
// 			var properties;
// 			var children;
// 			var r, e;

// 			var strP = this.beginRedirect();
// 			try {
// 				properties = this._writeProperties(component);
// 			} finally {
// 				this.endRedirect();
// 			}

// 			var strC = this.beginRedirect();
// 			try {
// 				children = this._writeChildren(component);
// 			} finally {
// 				this.endRedirect();
// 			}

// 			if(isInherited && n === "" && component !== this._root) {
// 				if(properties === true) {
// 					e = new Error(String.format("Unnamed component detected with overridden properties (%n)", component));
// 					e.str = strP;
// 					throw e;
// 				}
// 				if(children === true) {
// 					var thisObj = this;
// 					var test = function(child) {
// 						if(!thisObj.isComponentInherited(child)) {
// 							e = new Error(String.format("Unnamed component (%n) detected with child (%n)", component, child));
// 							e.str = strC;
// 							throw e;
// 						}
// 					};
// 					component.getChildren(test, this._root);

// 					this._write(strC.join(""));
// 					return true;
// 				}
// 			}

// // FIXME could check here to see whether all children are inherited and no properties are set, so that only the children can be written

// 			if(component === this._root || (r = isInherited === false || properties === true || children === true || this._writeAll === true) === true) {
// 				if(!this._writeAll && isInherited) {
// 					if(component === this._root) {
// 						this._write("$root(");
// 						// FIXME if(n !== "" || nobaseforthiscomponent) {
// 						this._write(String.format("\"%s\"", component.getClass().getName()));
// 						if(n !== "") {
// 							this._write(String.format(",\"%s\"", n));
// 						}
// //						this._write(",");
// 					} else {
// 						this._write("$i(");
// 						this._write(String.format("\"%s\"", n));
// 						//this._write(",");
// 					}
// 				} else {
// 					this._write((component === this._root) ? "$root(" : "$(");
// 					this._write(String.format("\"%s\"", component.getClass().getName()));
// 					if(n !== "") {
// 						this._write(String.format(",\"%s\"", n));
// 					}
// 				}
// 				if(children || properties) {
// 					this._write(",");
// 					this._write(strP.join(""));
// 				}
// 				if(children) {
// 					this._write(",[");
// 					this._write(strC.join(""));
// 					this._write("]");
// 				}
// 				this._write(")");
// 			}
// 			return r;
// 		},

// 		/**
// 		 *	Writes the properties of a component.
// 		 */
// 		_writeProperties: function(component) {
// 			var r = false;
// 			var props = component.defineProperties();
// 			var hadValue = false;
// 			var keys = js.keys(props).sort();
// 			var str = this.beginRedirect();
// 			var isInherited = this.isComponentInherited(component);

// 			try {
// 				if(this.includeComponent(component)) {
// 					for(var p = 0, l = keys.length; p < l; ++p) {
// 						var key = keys[p];
// 						var prop = props[key];

// 						if(prop.isStored(component) && this.includeProperty(component, prop)) {
// 							var hasInheritedValue = isInherited && prop.hasInheritedValue(component);

// 							if(this._writeAll || !hasInheritedValue) {
// 								try {
// 									var value = prop.get(component);
// 									// FIXME reference?
// 									if(value instanceof org.cavalion.comp.Component) {
// 										if(value.getName() && (value === this._root || value.getOwner() === this._root)) {
// 											value = value ? value.getName() : "";
// 										} else {
// 											continue;
// 										}
// 									}
// 									r = true;
// 									if(hadValue) {
// 										this._write(",");
// 									} else {
// 										hadValue = true;
// 									}
// 									if(js.keyNeedsEscape(key)) {
// 										key = String.escape(key);
// 									}
// 									if(typeof(value) !== "function") {
// 										if(value === null || typeof(value) !== "object" || !value.getClass) {
// 											this._write(String.format("%s:%s", key, js.sj(value)));
// 										} else {
// 											this._write(String.format("%s:", key));
// 											this._writeProperties(value);
// 										}
// 									} else {
// 										this._write(String.format("%s:%s", key, value));
// 									}
// 								} catch(e) {
// 									throw new Error(String.format("Could not write property %n.%s", component, key), e);
// 								}
// 							}
// 						}
// 					}
// 				}
// 			} finally {
// 				this.endRedirect();
// 			}
// 			if(r === true) {
// 				this._write("{");
// 				this._write(str.join(""));
// 				this._write("}");
// 			} else {
// 				this._write("{}");
// 			}

// 			return r;
// 		},

// 		/**
// 		 *	Writes the children of the component, nested.
// 		 */
// 		_writeChildren: function(component, array) {
// 			var hasChildren = false;

// 			// FIXME This must be optimized
// 			var test = function(child) { hasChildren = true; };
// 			component.getChildren(test, this._root);

// 			if(hasChildren) {
// 				var self = this;
// 				var n = 0;
// 				var str = this.beginRedirect();

// 				try {

// 					function func(child) {
// 						var str = self.beginRedirect();
// 						var written = this._writeAll || self._writeComponent(child);
// 						self.endRedirect();
// 						if(written) {
// 							if(n) {
// 								self._write(",");
// 							}
// 							n++;
// 							for(var i = 0, l = str.length; i < l; ++i) {
// 								self._write(str[i]);
// 							}
// 						}

// 					}

// 					component.getChildren(func, this._root);
// 				} finally {
// 					this.endRedirect();
// 				}
// 				if(str.length > 0) {
// 					this._write(str.join(""));
// 				}
// 				return str.length > 0;
// 			}
// 			return false;
// 		}
// 	},

// 	/**
// 	 * Property definitions
// 	 */
// 	Properties: {

// 	},

// 	/**
// 	 * Static members
// 	 */
// 	Statics: {

// 		write: function(component, uri, inherited) {
// 			var writer = new org.cavalion.comp.Writer(component, uri, inherited);
// 			return writer.write(component);
// 		}

// 	}

// });