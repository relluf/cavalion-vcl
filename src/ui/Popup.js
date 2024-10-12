define(function(require) {

	var Class = require("js/Class");
	var Control = require("vcl/Control");
	var js = require("js");
	var DocumentHook = require("../../util/DocumentHook");
	var HE = require("../../util/HtmlElement");
	var Panel = require("./Panel");

	var Popup = {
		inherits: Panel,
		prototype: {

			constructor: function() {
				var popup = this;

				this._hook = new DocumentHook(undefined, true);
				js.mixIn(this._hook, {
					keydown: (evt) => {
						if(evt.keyCode === 27) {
							popup.close();
							evt.preventDefault();
						}
					},
					click: (evt) => {
						var hasParent = HE.hasParent(evt.target, popup._node);
						if(popup._autoClose || !hasParent) {
							popup.close();
							if(!hasParent) {
								evt.bubbleUp = false;
								evt.preventDefault(); // for A's
							}
						}
					}
				});
			},

			"@css": {
				"position": "absolute",
				"z-index": "1"
			},

			_visible: false,
			_autoClose: true,
			_autoSize: "both",
			_hook: null,

			_onPopup: null,
			_onClose: null,
			
			getControlBounds: function(control) {
				var bounds = control.getAbsoluteRect();
				var offset = control.clientToDocument(0, 0);
				
				bounds.left = offset.x;
				bounds.top = offset.y;

				if(this._parent !== null) {
					var pt = this._parent.clientToDocument(0, 0, true);

					bounds.left -= pt.x;
					bounds.top -= pt.y;
				}

				bounds.x = bounds.left;
				bounds.y = bounds.top;

				return bounds;
			},
			popup: function(position, relativeTo, onClose) {
				
				const align = () => {

					const align_dom = () => {
						var ar = HE.getAbsoluteRect(relativeTo);
						var p = { x: ar.left, y: ar.top }; // relativeTo.clientToDocument(0, 0);
						var cs = HE.getComputedStyle(relativeTo);
						var cs_ = this.getComputedStyle();
						var ar_ = this.getAbsoluteRect();
						
						var bounds = this.getControlBounds(this);
	
						if(this._parent) {
							p = this._parent.documentToClient(p);
						}
						
						// this.print("popup", {
						// 	bounds: bounds,
						// 	ar: ar,
						// 	ar_: ar_,
						// 	cs: cs,
						// 	cs_: cs_
						// });
						
						if(position.origin === "bottom-left") {
							this.setLeft(p.x + (position.dx || 0));
							this.setTop(p.y + parseInt(cs.height, 10) + (position.dy || 0));
						} else if(position.origin === "bottom-right") {
							var l = p.x + parseInt(cs.width, 10) + (position.dx || 0) - this._node.scrollWidth; //(parseInt(cs_.width, 10) || 0);
							var t = p.y + parseInt(cs.height, 10) + (position.dy || 0);
							
							// this.print("popup-setTopLeft", js.sf("%d %d", p.x, p.y));
							
							this.setLeft(l);
							this.setTop(t);
						}
					};
	
					const align_vcl = () => {
	
						var ar = relativeTo.getAbsoluteRect();
						var p = relativeTo.clientToDocument(0, 0);
						var cs = relativeTo.getComputedStyle();
						var cs_ = this.getComputedStyle();
						var ar_ = this.getAbsoluteRect();
						
						var bounds = this.getControlBounds(this);
	
						if(this._parent) {
							p = this._parent.documentToClient(p);
						}
						
						// this.print("popup", {
						// 	bounds: bounds,
						// 	ar: ar,
						// 	ar_: ar_,
						// 	cs: cs,
						// 	cs_: cs_
						// });
						
						if(position.origin === "bottom-left") {
							this.setLeft(p.x + (position.dx || 0));
							this.setTop(p.y + parseInt(cs.height, 10) + (position.dy || 0));
						} else if(position.origin === "bottom-right") {
							var l = p.x + parseInt(cs.width, 10) + (position.dx || 0) - this._node.scrollWidth; //(parseInt(cs_.width, 10) || 0);
							var t = p.y + parseInt(cs.height, 10) + (position.dy || 0);
							
							// this.print("popup-setTopLeft", js.sf("%d %d", p.x, p.y));
							
							this.setLeft(l);
							this.setTop(t);
						}
					};

					if(relativeTo instanceof Control) {
						return align_vcl();
					}
					return align_dom();
				};

				if(!this._hook.isActive()) {
					
					this.setVisible(true);
					this._hook.activate();

					this._hook.release = function() {
						// Don't you just LOVE JavaScript? :p
						delete this.release;
						this.release.apply(this, arguments);
						onClose();
					};

					this.update(align);
					this.onpopup();
					this.setTimeout("update-align", align, 250);
				}
				
				align();
			},
			close: function() {
				if(this._hook.isActive()) {
					this._hook.release();
					this.setVisible(false);
					this.onclose();
				}
			},
			onpopup: function() {
				/**
				 *
				 */
				this.fire("onPopup", arguments);
			},
			onclose: function() {
				/**
				 *
				 */
				this.fire("onClose", arguments);
			},
			getOnPopup: function() {
				/**
				 *
				 */
				return this._onPopup;
			},
			setOnPopup: function(value) {
				/**
				 *
				 */
				this._onPopup = value;
			},
			getOnClose: function() {
				/**
				 *
				 */
				return this._onClose;
			},
			setOnClose: function(value) {
				/**
				 *
				 */
				this._onClose = value;
			}
		},
		properties: {
			"autoClose": {
				type: Class.Type.BOOLEAN
			},
			"onPopup": {
				type: Class.Type.EVENT
			},
			"onClose": {
				type: Class.Type.EVENT
			}
		}
	};

	return (Popup = Class.define(require, Popup));
});
