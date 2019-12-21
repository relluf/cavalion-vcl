define(function(require) {

	var Class = require("js/Class");
	var Control = require("../Control");
	var Element = require("./Element");

	var Tab = {
		inherits: Element,
		prototype: {
			"@css": {
				"&:not(.closeable) .close": {
					display: "none"
				},
				"a": {
					"color": "inherit",
					"text-decoration": "none"
				},
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
				i: "display:none;margin-left:4px;", 
				"&:not(.without-menu).selected i": "display:inline-block;", 
				"i:not(:hover)": "color:silver;"
			},

			//_element: "li",
			_content:
				"<a class='text'></a>" +
				"<i class='menu fa fa-caret-down'></i>" +
				"<a class='close'>×</a>",
			_groupIndex: 1,

			_text: "", _textReflects: "textContent",
			_closeable: false,
			_control: null,
			_onCloseClick: null,

			initializeNodes: function() {
				/** @overrides ../Control.prototype.initializeNodes */
                this.inherited(arguments);
				this._nodes.text = this._node.childNodes[0];
				this._nodes.close = this._node.childNodes[2];
			},
			render: function() {
				/** @overrides ../Control.prototype.render */
				if(this._textReflects === "textContent") {
					this._nodes.text.textContent = this.getText();
				} else {
					this._nodes.text.innerHTML = this.getText();
				}
			},
			select: function() {
				/** @overrides ../Control.prototype.select */
				if(this._control !== null) {
					this.setTimeout("selected", function() {
						if(this.isSelected() === false) return;
						
						// console.log("delayed select");
						
						this._control.setVisible(true);
						this._control.bringToFront();
						this._control.setFocus();
					}.bind(this), 175);
					
					var app = this.app();
					app.setTimeout("render", function() {
						// TODO MAYOR HACK !!!
						app.down(":root").updateChildren(true, true);
					}, 500);
				}
				this.inherited(arguments);
			},
			unselect: function() {
				/** @overrides ../Control.prototype.unselect */
				if(this._control !== null) {
					this._control.setVisible(false);
					this.clearTimeout("selected");
				}
				this.inherited(arguments);
			},
			ontap: function(evt) {
				/** @overrides ../Control.prototype.ontap */
				var r = this.inherited(arguments);

				if(r !== false) {
					if(evt.target === this._nodes.close || evt.target.parentNode === this._nodes.close) {
						this.dispatch("closeclick", evt);
					} else if(evt.target.classList.contains("menu")) {
						this.dispatch("menuclick", evt);
					} else {
						this.setSelected(this._groupIndex < -1 ? !this.getSelected() : true);
						//this._node.childNodes[0].blur();
					}
				}

				return r;
			},
			determineClasses: function() {
				/** @overrides ../Control.prototype.determineClasses */
				var classes = this.inherited(arguments);

				if(this._closeable === true) {
					classes.push("closeable");
				}

				return classes;
			},
			oncloseclick: function() {
				return this.fire("onCloseClick", arguments);
			},
			onmenuclick: function() {
				return this.fire("onMenuClick", arguments);
			},
			// setSelected: function() {
			// 	try {
			// 		return this.inherited(arguments);
			// 	} finally {
			// 		this._update();
			// 	}
			// },
			getCloseable: function() {
				return this._closeable;
			},
			setCloseable: function(value) {
				if(this._closeable !== value) {
					this._closeable = value;
					this.setState("classesInvalidated", true);
				}
			},
			getOnCloseClick: function() {
				return this._onCloseClick;
			},
			setOnCloseClick: function(value) {
				if(this._onCloseClick !== value) {
					this._onCloseClick = value;
				}
			},
			getText: function() {
				return this._text;
			},
			setText: function(value) {
				if(this._text !== value) {
					this._text = value;
					this.setState("invalidated", true);
				}
			},
			getTextReflects: function() {
				return this._textReflects;
			},
			setTextReflects: function(value) {
				if(this._textReflects !== value) {
					this._textReflects = value;
					this.setState("invalidated", true);
				}
			},
		
			getControl: function() {
				return this._control;
			},
			setControl: function(value) {
				if(this._control !== value) {
					this._control = value;
				}
			}
		},
		properties: {
			"text": {
				set: Function,
				type: Class.Type.STRING },
			"textReflects": {
				type: ["innerHtml", "textContent"],
				set: Function
			},
			"closeable": {
				set: Function,
				type: Class.Type.BOOLEAN },
			"control": {
				set: Function,
				type: Control },
			"groupIndex": {
				set: Function,
				type: Class.Type.INTEGER },
			"onCloseClick": {
				type: Class.Type.EVENT },
			"onMenuClick": {
				type: Class.Type.EVENT }
		}
	};

	return (Tab = Class.define(require, Tab));
});