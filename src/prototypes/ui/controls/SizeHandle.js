"use vcl/Dragger";
	
[("vcl/ui/Element"), {
	draggable: true,
	css: {
		position: "absolute",
    	right: "0", top: "0",
    	"z-index": "999999999999",
    	"background-repeat": "no-repeat",
    	"background-position": "center",
    	// "background-color": "rgba(155,155,155,.25)",
		"&.horizontal": {
	    	"background-image": "url(/shared/vcl/images/statusbarResizerHorizontal.png)",
	    	cursor: "ew-resize",
	    	height: "24px",
	    	width: "16px"
		},
		"&.vertical": {
    		"background-image": "url(/shared/vcl/images/statusbarResizerVertical.png)",
        	cursor: "ns-resize",
        	height: "8px",
        	"margin-top": "7px",
        	width: "20px"
		},
		'&.left': "left: 0;",
		'&.bottom': "bottom: 0;"  // TODO move this to some central place (#0/window)
	},
	onLoad() {
		var control = this.vars("control");
		var scope = this.scope();
		var alt = this.vars("control-alt");
		
		if(!(control instanceof require("vcl/Control"))) {
			this.vars("control", scope[control] || this);
		}
		
		if(alt && !(alt instanceof require("vcl/Control"))) {
			this.vars("control-alt", scope[alt] || this);
		}

		return this.inherited(arguments);
	},
	onDraggerNeeded() {
		var control = this.getVar("control");
		var dragger = new (require("vcl/Dragger"))(this);
		var horizontal = this.hasClass("horizontal");

		dragger.setCursor(horizontal ? "ew-resize" : "ns-resize");
		dragger.override({
			updateHandles: function(evt) {
				if(horizontal === true) {
    			    if(!control.getVisible()) {
    			        control.setVisible(true);
    			        control.setWidth(0);
    			    }
					control.setWidth(control.getWidth() + (evt.clientX - this._sx));
				} else {
    			    if(!control.getVisible()) {
    			        control.setVisible(true);
    			        control.setHeight(0);
    			    }
					control.setHeight(control.getHeight() - (evt.clientY - this._sy));
				}
				this._sx = evt.clientX;
				this._sy = evt.clientY;
			}
		});
		return dragger;
	}
}];