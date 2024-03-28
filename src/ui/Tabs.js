define(function(require) {

    var Tabs = require("js/defineClass");
    
    var js = require("js");
    var Bar = require("./Bar");
    var Type = require("js/Type");

    return (Tabs = Tabs(require, {
    	inherits: Bar,
    	prototype: {
	    	'@css': {
	            // typical usage vertical: 4px 16px 4px
	            'background-color': "#f0f0f0",
	            'height': "26px",
	            'padding-left': "2px",
	            'padding-bottom': "0",

	            // 'z-index': "999", // Ace really f's things up
	            
	            "&.gradient":{
	                "background-image": "-webkit-gradient(linear, 0% 0%, 0% 100%, from(#F5F5F5), to(#E5E5E5))",
	            },
	            '&:not(.bottom)': {
		            'padding-top': "3px",
	                'border-bottom': "1px solid silver"
	            },
	            "&.bottom.inset": {
	                "padding-top": "0px",
	                ".{./Tab}": {
	                	"border-radius": "5px",
	                    "margin-top": "2px",
	                    "&.selected": "border: 1px inset; background-color: rgba(25,25,25,0.2);"
	                }
	            },
	            
	            "&.bottom": {
	                "padding-top": "0px",
	                "border-top": "1px solid silver",
	                ".{./Tab}": {
	                    // border: "1px solid silver",
	                    "&.selected": {
	                    	// "border-radius": "5px",
	                    	"border-bottom": "1px solid #a0a0a0"
	                    },
	                    "border-top": "none",
	                    "margin-top": "0",
	                    "height": "20px"
	                },
	            },
	            
	            "&.sizeable": {
	                "padding-right": "10px",
	                "&.overflowing": {
	                    "padding-right": "24px"
	                },
	                ".overflow_handler": {
	                    right: "4px"
	                }
	            },
	            ">#size_handle": {
	                "margin-top": "9px"
	            },
	            ".{./Tab}": {
	                display: "inline-block",
	                border: "1px solid transparent",
	                "border-bottom": "none",
	                padding: "2px 4px 0px 4px",
	                "margin-top": "2px",
	                "margin-left": "3px",
	                "margin-right": "3px",
	                
	                "&.selected": "background-color:white; border-color: #a0a0a0;",// font-weight:bold;",
                    "&.selected .hashcode": "font-size: 7pt;",
                    
	                // Euh? move this to cavalion-devtools?
	                "&:not(.selected) .hashcode": "display: none;",
					"&:not(.closeable) .close": "display: none;",
					
					"a": "color: inherit; text-decoration: none;",
					".text": "display:inline-block;max-width:250px;text-overflow:ellipsis;overflow:hidden;",
					".hashcode": "vertical-align:text-top;",
					// ".menu:not(.close)": "vertical-align:text-top;",
					".close": {
						"vertical-align": "top",
						"margin-left": "4px",
						color: "silver",
						cursor: "pointer",
						"&:hover": {
							"font-weight": "bold",
							color: "black"
						}
					},
					"i.menu": "display:none;margin-left:4px;padding:2px;vertical-align:top;", 
					"&:not(.without-menu).selected i.menu": "display:inline-block;", 
					"i.menu:not(:hover)": "color:silver;"
	            }
	    	},
    	
    		_history: null,
    		_onChange: null,

	    	constructor: function() {
	    		this._history = [];
	    		js.mixIn(this._history, {
	    			remove: function(item) {
	    				for(var i = 0; i < this.length;) {
	    					if(this[i] === item) {
	    						this.splice(i, 1);
	    					} else {
	    						++i;
	    					}
	    				}
	    			}
	    		});
	    	},
	    	onkeyup: function(evt) {
	    		/** @overrides ../Control.prototype.onkeyup */
	    		var r = this.inherited(arguments);
    			var selected = this.getSelectedControl(1);
    			var query = this._name;
    			if(query !== "") {
    				query = "#" + query;
    			}
	    		
    			function moveH(direction) {
    				var l = selected._parent._controls.length;
    				if(evt.ctrlKey === true) {
    					// selected.setIndex(direction < 0 ? 0 : l - 1);
    				} else {
    					var index = (selected.getIndex() + direction + l) % l;
    					selected.setIndex(index);
    				}
    			}
    			
    			function moveV(direction) {
					var tabs = null;
    				if(evt.ctrlKey === true) {
    					// selected.setIndex(direction < 0 ? 0 : l - 1);
    				} else {
    					if(direction < 0) {
	    					tabs = selected.up().udown("vcl/ui/Tabs" + query);
	    					if(!tabs) tabs = selected.up().udown("vcl/ui/Tabs");
    					} else {
    						tabs = this.down("vcl/ui/Tabs" + query);
	    					if(!tabs) tabs = this.down("vcl/ui/Tabs");
    					}
						selected.setParent(tabs);
						selected._control && selected._control.setParent(tabs && tabs.up());
						selected.setSelected();
						tabs && tabs.focus();
    				}
    			}
    			
	    		if(r !== false && selected !== null) {
	    			switch(evt.keyCode) {
	    				case evt.KEY_LEFT_ARROW:
		    				evt.shiftKey ? moveH(-1) : this.selectPrevious();
	    					break;
	    					
	    				case evt.KEY_RIGHT_ARROW:
		    				evt.shiftKey ? moveH(1) : this.selectNext();
	    					break;

	    				case evt.KEY_UP_ARROW:
		    				evt.shiftKey ? moveV(-1) : this.selectUp();
	    					break;
	    					
	    				case evt.KEY_DOWN_ARROW:
		    				evt.shiftKey ? moveV(1) : this.selectDown();
	    					break;
	    			}
	    		}
	    		return r;
	    	},
	    	selectUp: function() {
	    		var selected = this.getSelectedControl();
	    		if(selected) {
	    			var tabs = this.udown("vcl/ui/Tabs");
	    			tabs && tabs.focus();
	    		}
	    	},
	    	selectDown: function() {
	    		
	    	},
	    	selectNext: function() {
	    		var controls = this._controls.filter(c => c._groupIndex === 1);
	    		var index = controls.indexOf(this.getSelectedControl(1));
	    	    if(++index === controls.length) {
	    	        index = 0;
	    	    }
	    	    this.selectNth(controls[index]);
	    	},
	    	selectPrevious: function() {
	    		var controls = this._controls.filter(c => c._groupIndex === 1);
	    		var index = controls.indexOf(this.getSelectedControl(1));
	    	    if(--index < 0) {
	    	        index = controls.length - 1;
	    	    }
	    	    this.selectNth(controls[index]);
	    	},
	    	selectNth: function(index) { // index can be reference to control as well
	    	    var control = typeof index === "number" ? this.getControl(index) : index;
	    	    control.setSelected(true);
	    	    this.makeVisible(control);
	    	},
	   // 	clearSelected: function(index, s) {
				// while((s = this.getSelectedControl(index || 1))) {
				// 	s.setSelected(false);
				// }
	   // 	},
	    	makeVisible: function(control) {
	    		if(control) {
		    		/*- this assumes horizontal scrolling only */
		    		if(control.getIndex() === 0) {
		    			control.scrollIntoView();
			    		this.nodeNeeded().scrollTop = 0; // HACK
			    	    this.nextTick("position-scrollbar", function() {
				    		if(this._node.scrollLeft < 100) {
				    			this._node.scrollLeft = 0;
				    		} else {
				    			this._node.scrollLeft += 100;
				    		}
			    	    }.bind(this));
		    		} else {
		    	    	control.scrollIntoView({behavior: "smooth", block: /*control.getIndex() === 0 ? "start" :*/ "end"}); 
		    		}
		    	    // HACK
		    		// this.nodeNeeded().scrollTop = 0;
	    		} else {
					return this.inherited(arguments);
	    		}
	    	},
    		initializeNodes: function(control) {
	    		/** @overrides ../Control.prototype.initializeNodes */
    			this._node.tabIndex = 1;
    			return this.inherited(arguments);
    		}, 
    		insertControl: function(control) {
	    		/** @overrides ../Control.prototype.insertControl */
    		    this.inherited(arguments);
    		},
    		removeControl: function(control) {
	    		/** @overrides ../Control.prototype.removeControl */
    			if(this._history.length > 0) {
    				if(control.isSelected()) {
    					this._history.pop().setSelected(true);
    				}
    				this._history.remove(control);
    			} else if(this._controls.length > 1) {
    				var index = control.getIndex();
    				index += (index > 0 ? - 1 : 1);
					this._controls[index].setSelected(true);
    			}
    			var r = this.inherited(arguments);
    			if(this._controls.length === 0) {
				    this.dispatch("change", null, control);
    			}
    			return r;
    		},
    		selectControl: function(control) {
	    		/** @overrides ../Control.prototype.selectControl */
    			var selected = this.getSelectedControl(1);
    			if(this.isDesigning() === true || 
    				this.dispatch("change", control, selected) !== false) {
        			if(selected !== null) {
        				this._history.push(selected);
        			}
    				var r = this.inherited(arguments);
    				// selected.update();
    				if((selected = this.getSelectedControl(1)) !== null) {
    					selected.update(this.checkOverflow.bind(this));	
    				}
    				return r;
    			}
    		},
    		onchange: function() {
				return this.fire("onChange", arguments);
    		},
            onresize: function (evt) {
            /** @overrides Panel.prototype.onresize */
            	this.setTimeout("after-resize-make-selected-visible", function() {
	            	var control = this.getSelectedControl(1);
	            	control && this.makeVisible(control);
            	}.bind(this), 100);
            }

    	},
    	properties: {
    		"onChange": {
    			type: Type.EVENT
    		}
    	}
    }));
});
