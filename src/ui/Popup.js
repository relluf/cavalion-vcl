define(function(require) {

	var Class = require("js/Class");
	var js = require("js");
	var DocumentHook = require("../../util/DocumentHook");
	var HtmlElement = require("../../util/HtmlElement");
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
						var hasParent = HtmlElement.hasParent(evt.target, popup._node);
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

			popup: function(position, relativeTo, onClose) {
				/**
				 *
				 * @param position
				 * @param relativeTo
				 * @param onClose
				 */
				const align = () => {
	
						var p = relativeTo.clientToDocument(0, 0);
						var cs = relativeTo.getComputedStyle();
						var cs_ = this.getComputedStyle();

						if(this._parent) {
							p = this._parent.documentToClient(p);
						}
						
						if(position.origin === "bottom-left") {
							this.setLeft(p.x + (position.dx || 0));
							this.setTop(p.y + parseInt(cs.height, 10) + (position.dy || 0));
						} else if(position.origin === "bottom-right") {
							this.setLeft(p.x + parseInt(cs.width, 10) + (position.dx || 0) - parseInt(cs_.width, 10));
							this.setTop(p.y + parseInt(cs.height, 10) + (position.dy || 0));
						}
					};

				var n = 2;
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
