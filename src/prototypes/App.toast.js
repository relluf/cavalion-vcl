"use util/Clipboard";

const Clipboard = req("util/Clipboard");

["", {
	onLoad() {

		// Override toast method to be more convenient (TODO refactor to vcl/Application)
		this.toast = (c = "Content not provided", ms = 1500, opts = {}) => {
			if(typeof c === "object") {
				return this.constructor.prototype.toast.apply(this, [c]);
			}
			return this.constructor.prototype.toast.apply(this, [
				js.mi({content: c, ms: ms, classes: "fade glassy"}, opts)
			]);
		};
		
		Clipboard.onPaste.addListener(e => { 
			this.print("onPaste", e);
			this.toast(js.sf("Pasted %d bytes...", e.length ))});
		Clipboard.onCopy.addListener(e => { 
			this.print("onCopy", e);
			if(typeof e === "string" && e.length > 150) {
				this.toast(js.sf("Copied %d bytes", e.length ));
			} else {
				this.toast(js.sf("Copied <b>%H<b>", e));
			}});

		return this.inherited(arguments);		
	},
	onToast: function(options) {
		
		/*- 
			- options:
				- timeout: defaults to 1500, false to disable
				- content: HTML string
				
			- returns a controller:
				- element: vcl/ui/Element holding the toast
				- remove: API to remove toast
		*/

		var Element = require("vcl/ui/Element");
		var scope = this.getScope();
		var elem = new Element(this);

		var timeout = options.ms || (options.hasOwnProperty("timeout") ? options.timeout : 1500);
		var content = options.content || "No toast content";
		var classes = options.classes || "fade";

		if(options.title !== undefined) {
			content = js.sf("<b>%s</b><div>%s</div>", options.title, content);
		}

		elem.setContent(content);
		elem.setParent(scope.toasts);
		elem.addClasses(classes);
		elem.update(() => elem.addClass("appear"));

		const controller = {
			element: elem,
			remove(timeout_) {
				elem.setTimeout("disappear", () => {

					elem.once("transitionend", () => elem.destroy());
					elem.replaceClass("appear", "disappear");

				}, timeout_ !== undefined ? timeout_ : timeout);
			},
			show() {
				elem.replaceClass("disappear", "appear");
			},
			hide(timeout_) {
				elem.setTimeout("disappear", () => 
					elem.replaceClass("appear", "disappear"), 
					timeout_ !== undefined ? timeout_ : timeout);
			}
		};

		timeout && controller.remove();

		return controller;
	}
}, [
    /* TODO make a seperate component, pluggable stuff */
    ["vcl/ui/Panel", "toasts", {
    	parent: "window",
    	autoSize: "both",
    	autoPosition: "top-left-bottom-right",
    	classes: "glassy-overlay",
    	css: {
	   		".right-half-size-switch": {
				height: "15px",
				width: "20px",
				display: "inline-block",
				float: "right",
    			transform: "scale3d(0.5, 0.5, 1) translate3d(0, -9px, 0)"
			},
			right: "0",
    		left: "0",
    		bottom: "20px",
    		"z-index": "20000",
    		"pointer-events": "none",
    		
    		".{./Element}": {
    			"pointer-events": "all",
    			"a": {
    				"text-decoration": "underline",
    				cursor: "pointer"
    			},
    			//"background-color": "rgb(47, 150, 180)",
    			// "background-color": "gold",
    			opacity: "0.75",
    			color: "black",
    			"&.glassy": {
	    			padding: "16px 24px",
	    			margin: "4px",
	    			'border-radius': "15px"
    			},
    			//"min-width": "300px",
    			"float": "right",
    			"clear": "both",
    			//"margin-left": "auto",
    			//"margin-right": "auto",
        		"&.box-shadow": {
        			"box-shadow": "0 1px 5px rgba(0,0,0,0.65)",
        			"border-radius": "4px"
        		},

        		"&.no-clear": "clear: none;",

    			"&.big": "font-size: 32pt;",
    			"&.medium": "font-size: 14pt;",
    			"&.fade": {
    				opacity: "0",
    				transition: "opacity 1s ease",
    			},
    			"&.appear": {
    				opacity: "1"
    			},
    			"&.disappear": {

    			},
    			"&:hover": {
    				opacity: "1"
    			},
    			"&.loading-right": {
    				"background-image": "url(/shared/vcl/images/loading.gif)",
    				"background-position": "95% center",
    				"background-repeat": "no-repeat",
    				"padding-right": "40px"
    			},
        		"&.padding-right-20px": {
        			"padding-right": "20px"
        		},
	    		"&.centered": {
	    			"text-align": "center",
		    		".{./Element}": {
		    			"margin-left": "auto",
		    			"margin-right": "auto",
		    			"text-align": "left",
		    			"float": "none"
		    		},
		    	},
		    	"&.paragraph": {
	    			'max-width': "35%"
		    	}
    		},
    		
    		
    	}
    }]
]];