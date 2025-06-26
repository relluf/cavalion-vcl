define(function (require) {

    var Tree = require("js/defineClass");
    var Node = require("./Node");
    var Panel = require("./Panel");
    var Type = require("js/Type");
    var Event = require("../../util/Event");
    var HtmlElement = require("../../util/HtmlElement");
    var Browser = require("util/Browser");

    var platform = window.navigator.platform;
    var checkbox_top =  Browser.safari ? 0 : 2;
    
    return (Tree = Tree(require, {
        inherits: Panel,
        prototype: {

            '@css': {
            	"padding-left": "0",
                "-webkit-user-select": "none",
                "margin": "0",
				".{Node}.root-invisible": {
					"> *:not(ol)": "display:none;color:blue;",
					"> ol": "padding-left: 0;"
				},
                ".{Node}": {
    		        display: "block",
                	cursor: "pointer",
                    "list-style-type": "none",
                	"line-height": "15px",
                    "white-space": "nowrap",
                    ">.close": {
                    	position: "absolute",
                    	left: "4px", width: "20px",
                    	"padding-top": "2px",
                    	// cursor: "pointer",
                    	display: "none"
                    },
                    ">ol": {
                        "margin": "0",
                        "display": "none",
                        "padding-left": "18px",
                        "-webkit-padding-start": "18px"
                    },
                    // "&.selected.closeable>.close": {
                    // 	display: "block"
                    // },
                    "&:hover.closeable>.close": {
                    	display: "block"
                    },
                    "&.selection-hover.closeable>.close": {
                    	display: "block"
                    },
                    "&.expanded>ol": {
                    	"display": "block"
                    },
                    "&.seperator.top": "border-top: 1px solid #f0f0f0; padding-top: 6px; margin-top: 6px;",
                    ">.selection": {
                        position: "absolute",
                        left: "0",
                        right: "0",
                        height: "21px",
                        "z-index": "0",
                        "border-radius": "3px",
                        // "pointer-events": "none"//,display:"none"
                    },
                    ">.icon": {
                        display: "inline-block",
                        // height: "20px",
                        width: "12px",
                        // "padding-top": "3px",
                        // "vertical-align": "text-top",
                        "&::before": {
                            content: "' '",
                            display: "inline-block",
                            "font-size": platform === "MacIntel" ? "1.4em" : "1.75em",
                            //"margin-top": platform === "MacIntel" ? "1px" : "-8px",
                            "padding-left": platform === "MacIntel" ? "2px" : "0"
                        }
                    },
                    ">.text": {
                        'input[type=checkbox]': `position:relative;top:${checkbox_top}px;`,
                        position: "relative",
                        // cursor: "pointer",//"default",
//        				width: "100%",
                        display: 'inline-block',
                        'margin-left': "2px",
                        padding: "3px 4px 3px 4px",
                        // 'vertical-align': "top"
                    },
                    "&.selected": {
                        ">.selection": {
                            "background-color": "rgb(56, 121, 217)"
                        },
                        ">.text": {
                            "background-color": "rgb(56, 121, 217)",
                        	"padding-bottom": "1px",
                        	"margin-bottom": "2px",
                            // "padding-left": "4px",
                            // "padding-right": "4px",
                            "border-radius": "3px",
                            color: "white"
                        },
                        ">.close": {
                            color: "white",
                            "background-color": "rgb(56, 121, 217)",
                            "font-weight": "bold"
                        },
                        ">.icon": {
                            'opacity': "0.9",
                            'color': "white"
                        }
                    },
					"&.expanding": {
						background: "url(/shared/vcl/images/loading.gif) no-repeat right",
                        '>.selection': {
							'background-image': "url(/shared/vcl/images/loading.gif)",
							'background-repeat': "no-repeat",
							'background-position': "right"
                        },
						'>.text': {
						}
					},
                    "&.expandable:not(.expanding)": {
                        ">.icon::before": {
                            'line-height': "0",
                            content: "'▸'" // http://www.alanwood.net/unicode/geometric_shapes.html
                        }
                    },
                    "&.expandable.expanded:not(.expanding)": {
                        ">.icon::before": {
                            content: "'▾'" // http://www.alanwood.net/unicode/geometric_shapes.html
                        }
                    },
                    ">.container": {
                        "padding-left": "12px"
                    }
                },
                "&.no-selection .{Node}": {
                	"cursor": "default",
                	".icon": "cursor: pointer;",
                	".selection": "visibility: hidden; display: none;"
                }
            },

            /** @overrides ../Control.prototype */
			_executesAction: "onNodeDblClick",

            /** @overrides ./Panel.prototype */
            _align: "client",
            _focusable: true,
            
            _onSelectionChange: null,
            _onNodesNeeded: null,
            _onNodeRender: null,
            _selection: [],
            _element: "ol",
            
            constructor: function() {
                var tree = this;
                
                this._history = [];
                this._history.pointer = 0;
                this._history.back = function() {
                    if(this.pointer > 0) {
                        tree.setSelection(this[(--this.pointer) - 1] || [], false);
                    }
                };
                this._history.forward = function() {
                    if(this.pointer < this.length) {
                        tree.setSelection(this[this.pointer++], false);
                    }
                };
                this._history.push = function() {
                    this.splice(this.pointer);
                    this.pointer += arguments.length;
                    return Array.prototype.push.apply(this, arguments);
                };
            },
            insertControl: function (control) {
            /**
             * @overrides ../Control.prototype.insertControl
             */
                if (! (control instanceof Node)) {
                    throw new Error("Only Node instances can be nested in a Tree");
                }
                return this.inherited(arguments);
            },
            removeControl: function(control) {
            /**
             * @overrides ../Control.prototype.removeControl
             */
				var selection = this.getSelection(), index;
				if((index = selection.indexOf(control)) !== -1) {
					selection.splice(index, 1);
					this.setSelection(selection);
				}
                return this.inherited(arguments);
            },
            dispatchChildEvent: function (component, name, evt, f, args) {
            /**
             * @overrides ../Control.prototype.dispatchChildEvent
             */
                var r = this.inherited(arguments);
                if (r !== false && component instanceof Node && component.isEnabled()) {
                    if (name === "keyup") {
                        r = this.do_keyup(evt);
                    } else if (name === "click") {
                        var rect = HtmlElement.getAbsoluteRect(component._nodes.icon);
                        if(rect.left < evt.clientX && 
                            rect.left + rect.width > evt.clientX && 
                            rect.top < evt.clientY && 
                            rect.top + rect.height > evt.clientY) {
                        	// Node.prototype.onclick will handle event
                        } else {
                        	if(!evt.target.matches(".close")) {
                            	this.setSelection([component]);
                        	}
                        }
                    } else if(name === "dblclick") {
                        this.setSelection([component]);
                    }
                }
                return r;
            },
            loaded: function() {
            /** @overrides ../Component.prototype.loaded */
            	this.invalidateSelection();	
            	return this.inherited(arguments);	
            },
            invalidateSelection: function() {
            	var selection = [];
            	function loop(control) {
        			if(control.isSelected()) {
        				selection.push(control);
        			}
        			control._controls && control._controls.forEach(loop);
            	}
            	loop(this);
            	this.setSelection(selection);
            },
            refresh: function() {
            	var nodes = [].concat(this._controls);
                this.destroyControls();
                this.dispatch("nodesneeded", null);
            },
			makeVisible: function(childNode) {
				if(childNode) {
				    // var node = this.nodeNeeded();
				    // var pos = childNode.nodeNeeded().position();
				    // var top = this.getAbsoluteRect().height / 3;
				    // node.scrollTop -= (top - pos.top);
				    childNode.scrollIntoView({ behavior: "auto", block: "center", inline: "nearest" });
				} else {
					return this.inherited(arguments);
				}
            },
            
            do_keyup: function(evt) {
                if(Event.modifiersMatch(evt, [])) {
                    if(evt.keyCode === evt.KEY_F5) {
                        this._selection.forEach(node => node.reloadChildNodes());
                    } else if(evt.keyCode === 13 && this._selection.length) {
						if(this._action && this._action.isEnabled() && this._executesAction === "onNodeDblClick") {
							this._action.execute(evt, this);
						}
					} else if(evt.keyCode === 37) { // left
						this._selection.forEach(node => node.collapse());
						evt.preventDefault();
					} else if(evt.keyCode === 39) { // right
						this._selection.forEach(node => 
							node.isExpandable() && node.expand());
						evt.preventDefault();
					} else if(evt.keyCode === 38) { // up
						if(this._selection.length === 1) {
							if(this._selection[0].getIndex() === 0) {
								var parent = this._selection[0]._parent;
								if(parent !== this) this.setSelection([parent]);
							}
						}
						
						this.setSelection(this._selection.map(
							node => node._parent._controls[node.getIndex() - 1] 
								|| node));
						evt.preventDefault();
					} else if(evt.keyCode === 40) { // down
						if(this._selection.length === 1) {
							if(this._selection[0].isExpanded()) {
								this.setSelection([this._selection[0]._controls[0]]);
							}
						}
					
						if(!this._selection.length && this._controls.length) {
							this.setSelection([this._controls[0]]);
						} else {
							this.setSelection(this._selection.map(
								node => node._parent._controls[node.getIndex() + 1] 
									|| node));
						}
						evt.preventDefault();
					}
                } else if(Event.modifiersMatch(evt, ["alt"])) {
                    if(evt.keyCode === evt.KEY_LEFT_ARROW) {
                        console.log("alt <-");
                        this._history.back();
                    } else if(evt.keyCode === evt.KEY_RIGHT_ARROW) {
                        console.log("alt ->");
                        this._history.forward();
                    }
                } else {
                	console.log("ignored for modifiers");	
                }
                return true;
            },
            
            onnodesneeded: function (parent) {
                return this.fire("onNodesNeeded", [parent]);
            },
            onnoderender: function(evt) {
                return this.fire("onNodeRender", [evt]);
            },
            onkeyup: function(evt) {
                // this.do_keyup(evt);
                return this.inherited(arguments);
            },
			onkeydown: function(evt) {
				/** @overrides ../Control.prototype.onkeydown */
				var r = this.inherited(arguments);
				if(r !== false) {
					if(evt.keyCode === 13 && this._selection.length) {
						if(this._action && this._action.isEnabled() && this._executesAction === "onNodeDblClick") {
							this._action.execute(evt, this);
						}
					} else if(evt.keyCode === 39) { // right
						this.getSelection().forEach(n => n.isExpandable() && n.expand());
					} else if(evt.keyCode === 38) { // up
						this.setSelection(this.getSelection().map(function(node) {
							return node._parent._controls[node.getIndex() - 1] || node;
						}));
					} else if(evt.keyCode === 40) { // down
						this.setSelection(this.getSelection().map(function(node) {
							return node._parent._controls[node.getIndex() + 1] || node;
						}));
					}
				}
				return r;
			},

            onclick: function (evt) {
            /**
             * @overrides ../Control.prototype.onclick
             */
                var r = this.inherited(arguments);
                if (r !== false) {
                    this.setSelection([]);
                }
                return r;
            },
            onselectionchange: function () {
                return this.fire("onSelectionChange", [this.getSelection()]);
            },
            
            getSelection: function () {
                return [].concat(this._selection);
            },
            setSelection: function (value, allow_history) {
                // FIXME do some smart selection comparing, only (de)select what is needed...
                
            	if(value.length === this._selection.length) {
            		var same = true;
            		for(var i = 0; i < value.length && same; ++i) {
            			same = value[i] === this._selection[i];
            		}
            		if(same) {
            			return;
            		}
            	}

                this._selection.forEach(function (node) {
                    node.setSelected(false);
                });
                this._selection = value;
                this._selection.forEach(function (node) {
                    node.setSelected(true);
                });

                allow_history !== false && this._history.push(this._selection);

                // FIXME do dispatch if order of selected nodes was changed
                this.dispatch("selectionchange", this._selection);
            }

        },
        properties: {
			"executesAction": {
				type: ["No", "onClick", "onNodeDblClick"]
			},
           	"focusable": {
        		type: Type.BOOLEAN,
        		set: Function
        	},
            "onSelectionChange": {
                type: Type.EVENT
            },
            "onNodesNeeded": {
                type: Type.EVENT
            },
            "onNodeRender": {
                type: Type.EVENT
            }
        }
    }));

});
