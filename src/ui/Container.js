define(["require", "js/defineClass", "./Element", "js/Type"], function(require, Container, Element, Type) {

	return (Container = Container(require, {
		inherits: Element,
		prototype: {
			getInnerHtml: function() {
				/** @overrides ../Control.prototype.getInnerHtml */
				return this._content || "";
			},
			isContainer: function() {
				/** @overrides ../Control.prototype.isContainer */
				return true;
			},
			
            align: function (control, origin) {
            	// No hay nada de hacer yo creo
			},
			storeScroll: function() {
				/** @overrides ../Control.prototype.storeScroll */
				this.hasOwnProperty("_controls") && this._controls.forEach(function(control) {
					control.storeScroll();
				});
				return this.inherited(arguments);
			},
			restoreScroll: function() {
				/** @overrides ../Control.prototype.restoreScroll */
				this.hasOwnProperty("_controls") && this._controls.forEach(function(control) {
					control.restoreScroll();
				});
				return this.inherited(arguments);
			},
			parentScrolled: function(parent, evt) {
				if(this.hasOwnProperty("_controls")) {
					for (var i = 0, l = this._controls.length; i < l; ++i) {
						this._controls[i].parentScrolled(parent, evt);
					}
				}
			}
		},
		properties: {
			"controls": {
				type: Type.ARRAY,
				visible: false,
				stored: false
			},
			"onReceiveParams": {
				type: Type.EVENT
			}
		}
	}));
});