define(function(require) {

	var Select = require("js/defineClass");
	var Type = require("js/Type");
	var Element = require("./Element");
	var EventDispatcher = require("../EventDispatcher");

	return (Select = Select(require, {
		inherits: Element,
		prototype: {
			'@css': {},

			_element: "select",
			_options: null,
			_onChange: null,
			
			// loaded: function() {
			// 	/* @see ../Component.prototype.loaded */
			// 	if(this.hasOwnProperty("_value")) {
			// 		this.nodeNeeded().value = this._value;
			// 		delete this._value;
			// 	}
			// 	return this.inherited(arguments);
			// },
			initializeNodes: function() {
	            /*  @see ../Control.prototype.initializeNodes */
				["cut", "paste", "change"].forEach(function(e) {
					var k = "on" + e;
					if(this._node[k] === null) {
						this._node[k] = EventDispatcher.handleEvent;
					}
				}, this);
			    return this.inherited(arguments);
			},
			render: function() {
	            /*  @see ../Control.prototype.render */
	            var options = (this._options || []), value;
				this._node.innerHTML = options.map(option => {
				    if(typeof option === "string") {
				    	if(value === undefined) value = option;
    					return js.sf("<option>%H</option>", option);
				    } else {
				    	if(value === undefined) value = option.value;
				        return js.sf("<option value=\"%s\">%H</option>", option.value, option.content);
				    }
				}).join("");
				this._node.value = this._value || value;
			},
			onchange: function() {
				return this.fire("onChange", arguments);
			},
			getSelectedContent: function() {
				var options = this.nodeNeeded().options;
				return (options[this._node.selectedIndex] || "").textContent;
			},
			getSelectedOption: function() {
				return this.getOption();
			},
			getSelectedValue: function() {
				return this.getValue();
			},
			hasValue: function() { return !!this.getValue(); },
			getValue: function() {
				if(this.isLoading() || this.hasState("invalidated")) {
					return this._value;
				}
			    return this.nodeNeeded().value;
			},
			setValue: function(value, force) {
				if(this.isLoading()) {
					this._value = value;
				} else if(force || (this._value !== value || (this._node && this._node.value !== value))) {
					this.nodeNeeded().value = (this._value = value);
					this.dispatch("change");
				}
			},
			getOption: function() {
				const value = this.getValue();
				return this.getOptions().find(o => o.value === value);
			},
			getOptions: function() { return this._options; },
			setOptions: function(value) {
			    this._options = value;
			    this.setState("invalidated", true);
			}
			
		},
		properties: {
			"onChange": {
				type: Type.EVENT
			},
			"options": {
				type: Type.ARRAY,
				set: Function
			},
			"value": {
				type: Type.STRING,
				set: Function
			}
		}
	}));

});