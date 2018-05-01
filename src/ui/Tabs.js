define(function(require) {

    var Tabs = require("js/defineClass");
    var Bar = require("./Bar");
    var Type = require("js/Type");
    var js = require("js");

    return (Tabs = Tabs(require, {
    	inherits: Bar,
    	prototype: {
	    	'@css': {
	            // typical usage vertical: 4px 16px 4px
	            "background-color": "#f0f0f0",
	            'height': "26px",
	            "padding-left": "2px",
	            "padding-top": "3px",
	            // "border-top": "1px solid silver",
	            
	            "&.gradient":{
	                "background-image": "-webkit-gradient(linear, 0% 0%, 0% 100%, from(#F5F5F5), to(#E5E5E5))",
	            },
	            "&:not(.bottom)": {
	                "border-bottom": "1px solid silver"
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
	                    "margin-top": "0"
	                }
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
	                padding: "2px 4px 2px 4px",
	                "margin-top": "2px",
	                "margin-left": "3px",
	                "margin-right": "3px",
	                "&.selected": {
	                    "background-color": "white",
	                    "border-color": "#a0a0a0",
	                    ".hashcode": "font-size: 7pt;"
	                },
	                "&:not(.selected) .hashcode": "display: none;"
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
	    		var r = this.inherited(arguments);
    			var selected = this.getSelectedControl(1);
	    		
    			function move(direction) {
    				var l = selected._parent._controls.length;
    				if(evt.ctrlKey === true) {
    					selected.setIndex(direction < 0 ? 0 : l - 1);
    				} else {
    					var index = (selected.getIndex() + direction + l) % l;
    					selected.setIndex(index);
    				}
    			}
    			
	    		if(r !== false && selected !== null) {
	    			switch(evt.keyCode) {
	    				case evt.KEY_LEFT_ARROW:
		    				evt.shiftKey ? move(-1) : this.selectPrevious();
	    					break;
	    					
	    				case evt.KEY_RIGHT_ARROW:
		    				evt.shiftKey ? move(1) : this.selectNext();
	    					break;
	    			}
	    		}
	    		return r;
	    	},
	    	selectNext: function() {
	    	    var index = this.getSelectedControl(1).getIndex();
	    	    if(++index === this._controls.length) {
	    	        index = 0;
	    	    }
	    	    this.getControl(index).setSelected(true);
	    	},
	    	selectPrevious: function() {
	    	    var index = this.getSelectedControl(1).getIndex();
	    	    if(--index < 0) {
	    	        index = this._controls.length - 1;
	    	    }
	    	    this.getControl(index).setSelected(true);
	    	},
	    	selectNth: function(n) {
	    	    this.getControl(index).setSelected(true);
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
    				if((selected = this.getSelectedControl(1)) !== null) {
    					selected.update(this.checkOverflow.bind(this));	
    				}
    				return r;
    			}
    		},
    		onchange: function() {
				return this.fire("onChange", arguments);
    		}
    	},
    	properties: {
    		"onChange": {
    			type: Type.EVENT
    		}
    	}
    }));
});