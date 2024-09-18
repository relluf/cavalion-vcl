define(function(require) {

	var Node = require("js/defineClass");
	var Tree = require("js/referenceClass!./Tree");
	var Deferred = require("js/Deferred");
	var Type = require("js/Type");
//	var HtmlElement = require("../util/HtmlElement");
	var Group = require("./Group");

	return (Node = Node(require, {
		inherits: Group,
		prototype: {

			'@css': {},

			_content:
			/** @overrides ../Control.prototype */
				"<div class=\"selection\">&nbsp;</div>" +
				"<div class=\"icon\"></div>" +
				"<div tabindex=\"1\" class=\"text\"></div>" +
				"<ol></ol>" +
				"",

			_element: "li",

			_text: "",  _textReflects: "innerHtml",
			_expanded: false,
			_expandable: "auto",

			_childNodesLoaded: false,
			_onChildNodesNeeded: null,

			_onCollapse: null,
			_onCollapsed: null,
			_onExpand: null,
			_onExpanded: null,
			
			// loaded: function() {
			// 	var r = this.inherited(arguments);
			// 	if(this._expanded === true) {
			// 		this.childNodesNeeded();
			// 	}
			// 	return r;
			// },

			createNode: function() {
				/** @overrides ../Component.prototype.loaded */
				var expanded = this._expanded;
				this._expanded = false;

				this.inherited(arguments);

				this.setExpanded(expanded);
			},
			insertControl: function() {
				/** @overrides ../Control.prototype.insertControl */
				this.setState("classesInvalidated");
				this.inherited(arguments);
			},
			removeControl: function(control) {
				/** @overrides ../Control.prototype.insertControl */
				this.setState("classesInvalidated");
				this.inherited(arguments);

				var tree = this.getTree();
				if(tree !== null) {
					var selection = tree.getSelection(), index;
					if((index = selection.indexOf(control)) !== -1) {
						selection.splice(index, 1);
						tree.setSelection(selection);
					}
				}
			},
			determineClasses: function() {
				/** @overrides ../Control.prototype.determineClasses */
				var r = this.inherited(arguments);
				if(this.isExpandable()) {
					r.push("expandable");
				}
				return r;
			},
			initializeNodes: function() {
				/** @overrides ../Control.prototype.initializeNodes */
				this.inherited(arguments);

				this._nodes.selection = this.getChildNode(0);
				this._nodes.icon = this.getChildNode(1);
				this._nodes.text = this.getChildNode(2);
				this._nodes.container = this.getChildNode(3);

				if(!this._nodes.text) {
					throw new Error("No text node");
				}

				if(!this._nodes.container) {
					throw new Error("No container node");
				}
			},
			render: function() {
				/** @overrides ../Control.prototype.render */
				var tree = this.getTree(), text = this._text;
				if(tree) {
					var evt = { 
						detail: { 
							text: this._text, 
							nodes: this._nodes, 
							node: this._node 
						},
						target: this 
					};
					if((tree.dispatch("rendernode", evt)) === true) {
						return;
					}
				}
				
				if(text instanceof Array) {
					this._nodes.text.innerHTML = String.format.apply(String, text);
				} else if(this._textReflects === "innerHtml") {
					this._nodes.text.innerHTML = text;
				} else {
					this._nodes.text.textContent = text;
				}
				
				if(this._icon) {
					this._nodes.icon.style.backgroundImage = js.sf("url(%s)", this._icon);
				}
			},

			isExpanded: function() {
				/** @overrides ../Control.prototype.isExpanded */
				return this._expanded;
			},
			isControlVisible: function(control) {
				/** @overrides ../Control.prototype.isControlVisible */
				return this._expanded === true && this.inherited(arguments);
			},
			isContainerShowing: function() {
				/** @overrides ../Control.prototype.isContainerShowing */
				return this.isExpanded();
			},

			getClientNode: function() {
				/** @overrides ../Control.prototype.getClientNode */
				if(this._node === null) {
					this._nodeNeeded();
				}
				return this._nodes.container;
			},
			textChanged: function(newValue, oldValue) {
				this.setState("invalidated", true);
			},

			reloadChildNodes: function(callback) {
                delete this._childNodesLoaded;
                this.destroyControls();
                this.childNodesNeeded(callback);
			},
			childNodesNeeded: function(callback) {
				callback = callback || function() {};
				
				if(!this.hasOwnProperty("_childNodesLoaded")) {
					this._childNodesLoaded = this.dispatch("childnodesneeded");
				}
				if(this._childNodesLoaded instanceof Deferred) {
					var me = this;

					this.addClass("expanding");

					this._childNodesLoaded.addCallback(function(res) {
						me._childNodesLoaded = true;
						me.update(function() {
    						if(typeof callback === "function") {
    							callback();
    						}
						});
                        me.removeClass("expanding");
						return res;
					});
				} else if(this._childNodesLoaded instanceof Promise) {
					this.addClass("expanding");
					this._childNodesLoaded.then(res => {
							this.update(() => callback(res));
							return res;
						})
						.finally(() => this.removeClass("expanding"));
					
				} else if(this._childNodesLoaded !== false && typeof callback === "function") {
					callback();
				}
			},
			
			// updateChildren: function(recursive, directly) {
			// 	/** @overrides */
			// 	var args = js.copy_args(arguments); args.callee = arguments.callee;
			// 	// inherited.apply(this, arguments); // --> inherited.js
			// 	return Group.prototype.updateChildren.apply(this, [recursive, true]);
			// },
			
			onclick: function(evt, force) {
				/** @overrides ../Control.prototype.onclick */
				var r = this.inherited(arguments);
				if(r !== false && (force === true || (evt.target === this._nodes.icon && this.isExpandable()))) {
					if(this._expanded === true) {
						this.dispatch("collapse", evt);
					} else {
						this.dispatch("expand", evt);
					}
				}
				return r;
			},
			ondblclick: function(evt) {
				/** @overrides ../Control.prototype.ondblclick */
				var r = this.inherited(arguments);
				if(r !== false && this.isExpandable() && evt.shiftKey !== true) {
					if(this._expanded === true) {
						this.dispatch("collapse", evt);
					} else {
						this.dispatch("expand", evt);
					}
				}
				return r;
			},
			onexpand: function(evt) {
				if(this._childNodesLoaded instanceof Deferred) {
					return;
				}

				if(this._onExpand !== null) {
					this._expanded = this._onExpand.apply(this, [evt]) !== false;
				} else {
					this._expanded = true;
				}

				if(this._expanded === true) {
					this.childNodesNeeded();
					this._update();
				}

				return this._expanded;
			},
			oncollapse: function(evt) {
				if(this._onCollapse !== null) {
					this._expanded = (this._onCollapse.apply(this, [evt]) === false);
				} else {
					this._expanded = false;
				}

				if(this._expanded === false) {
					this._update();
				}
				return this._expanded;
			},
			onchildnodesneeded: function(evt) {
				var tree, r;

				if(this.hasOwnProperty("_onChildNodesNeeded")) {
					r = this.fire("onChildNodesNeeded", [this]);
				}

				if(r !== false && (tree = this.getTree()) !== null) {
					r = tree.dispatch("nodesneeded", this);
				} else {
					r = true;
				}

				return r;
			},
			onnodeinserted: function() {
				if(this._expandable === "auto") {
					// console.log("onnodeinserted", this._expandable);
					this.childNodesNeeded();
				}
				return this.inherited(arguments);
			},
			getChildNodesLoaded: function() {
				return this._childNodesLoaded;
			},
			whenChildNodesLoaded: function(callback) {
				this.childNodesNeeded(callback);
			},
			
			getTree: function() {
				if(this._parent instanceof Tree) {
					return this._parent;
				} else if(this._parent instanceof Node) {
					return this._parent.getTree();
				}
				return null;
			},
			
			getText: function() {
				if(this.isDesigning()) {
					return this._text || this._name;
				}
				return this._text;
			},
			setText: function(value) {
				if(this._text !== value) {
					value = [value, this._text];
					this._text = value[0];
					this.textChanged(this._text, value[1]);
				}
			},
			getIcon: function() {
				if(this.isDesigning()) {
					return this._icon || this._name;
				}
				return this._icon;
			},
			setIcon: function(value) {
				if(this._icon !== value) {
					value = [value, this._icon];
					this._icon = value[0];
					this.setState("invalidated", true);
				}
			},
			
			expand: function() {
				this.setExpanded(true);
			},
			collapse: function() {
				this.setExpanded(false);
			},

			getExpanded: function() {
				return this._expanded;
			},
			setExpanded: function(value) {
				if(this._expanded !== value) {
					if(this.isExpandable() && this._node !== null && this.isLoading() === false) {
						if(this._expanded === true) {
							this.dispatch("collapse");
						} else if(this._expanded === false) {
							this.dispatch("expand");
						}
					} else {//if(value === true && this.isExpandable()) {
						if((this._expanded = value)) {
							this._expandable = true;
						}
					}
				}
			},
			isExpandable: function() {
				return this._expandable === "auto" ?
						this.hasOwnProperty("_controls") && this._controls.length > 0 : this._expandable;
			},
			getExpandable: function() {
				return this._expandable;
			},
			setExpandable: function(value) {
				if(this._expandable !== value) {
					this._expandable = value;
					this.setState("classesInvalidated");
				}
			},

			getOnChildNodesNeeded: function() {
				return this._onChildNodesNeeded;
			},
			setOnChildNodesNeeded: function(value) {
				this._onChildNodesNeeded = value;
			},
			getOnCollapse: function() {
				return this._onCollapse;
			},
			setOnCollapse: function(value) {
				this._onCollapse = value;
			},
			getOnExpand: function() {
				return this._onExpand;
			},
			setOnExpand: function(value) {
				this._onExpand = value;
			},
			getOnCollapsed: function() {
				return this._onCollapsed;
			},
			setOnCollapsed: function(value) {
				this._onCollapsed = value;
			},
			getOnExpanded: function() {
				return this._onExpanded;
			},
			setOnExpanded: function(value) {
				this._onExpanded = value;
			}
		},
		properties: {
			"text": {
				set: Function,
				type: Type.STRING
			},
			"icon": {
				set: Function,
				type: Type.STRING
			},
			"expanded": {
				set: Function,
				type: Type.BOOLEAN
			},
			"expandable": {
				set: Function,
				type: [
					true, false, "auto"
				]
			},
			"onChildNodesNeeded": {
				type: Type.EVENT,
				set: Function
			},
			"onNodesNeeded": {
				type: Type.EVENT,
				set: function(value) {
					this._onChildNodesNeeded = value;
				},
				get: function() {
					return this._onChildNodesNeeded;
				}
			},
			"onCollapse": {
				set: Function,
				type: Type.EVENT
			},
			"onCollapsed": {
				set: Function,
				type: Type.EVENT
			},
			"onExpand": {
				set: Function,
				type: Type.EVENT
			},
			"onExpanded": {
				set: Function,
				type: Type.EVENT
			}
		},
		statics: {
			/*-* Example: vcl-comps/app/Home.tree.js */
			build: function($, config, obj) {
				var arr = []; config = config || {};
				for(var k in obj) {
					var props = obj[k][0], Class = props['@class'] || "vcl/ui/Node";
					var kids = arguments.callee($, config, obj[k][1]);
					
					for(var cdk in config.defaults) {
						if(!props.hasOwnProperty(cdk)) {
							props[cdk] = config.defaults[cdk];
						}
					}

					if(typeof props.vars === "string") {
						props.vars = js.str2obj(props.vars);
					}
					
					if(props.hasOwnProperty("uri")) {
						props.uri = (config.prefix || "") + props.uri;
						props.vars = js.mixIn(props.vars || {}, {formUri: props.uri});
						delete props.uri;
					}
					if(props.control) {
						props.vars = js.mixIn(props.vars || {}, {control: props.control});
						delete props.control;
					}
					if(!props.hasOwnProperty("text")) {
						props.text = k;
					}
					if(props.aliases) {
						props.vars = js.mixIn(props.vars || {}, { aliases: Array.as(props.aliases) });
						delete props.aliases;
					}
					
					arr.push($(Class, props.name || ("node_" + k), props, kids));
				}
				return arr;
			}
		}
	}));

});