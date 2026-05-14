"use util/Clipboard";

const Clipboard = req("util/Clipboard");
const HtmlElement = req("util/HtmlElement");
const Control = req("vcl/Control");

let IMG_LOADING = "https://veldapps.com/shared/vcl/images/loading.gif";

const getToastAlignmentBounds = function(container, control) {
	let rect;
	let point;

	if(control instanceof Control) {
		rect = control.getAbsoluteRect();
		point = control.clientToDocument(0, 0);
		rect = {
			left: point.x,
			top: point.y,
			width: rect.width,
			height: rect.height
		};
	} else if(control && control.nodeType === 1) {
		rect = HtmlElement.getAbsoluteRect(control);
	} else if(control && typeof control.getBoundingClientRect === "function") {
		rect = control.getBoundingClientRect();
		rect = {
			left: rect.left + window.pageXOffset,
			top: rect.top + window.pageYOffset,
			width: rect.width,
			height: rect.height
		};
	} else {
		return null;
	}

	if(container && container.documentToClient) {
		point = container.documentToClient(rect.left, rect.top);
		rect.left = point.x;
		rect.top = point.y;
	}

	rect.right = rect.left + rect.width;
	rect.bottom = rect.top + rect.height;

	return rect;
};
const alignToastElement = function(container, node, alignment) {
	const bounds = getToastAlignmentBounds(container, alignment && alignment.control);
	const position = alignment && (alignment.position || alignment.origin) || "top-center";
	const dx = alignment && alignment.dx || 0;
	const dy = alignment && alignment.dy || 0;
	const width = node.offsetWidth || node.scrollWidth || 0;
	const height = node.offsetHeight || node.scrollHeight || 0;
	let left;
	let top;

	if(!bounds || !node) {
		return false;
	}

	if(position === "top-left") {
		left = bounds.left;
		top = bounds.top;
	} else if(position === "top-right") {
		left = bounds.right - width;
		top = bounds.top;
	} else if(position === "bottom-left") {
		left = bounds.left;
		top = bounds.bottom - height;
	} else if(position === "bottom-center") {
		left = bounds.left + (bounds.width - width) / 2;
		top = bounds.bottom - height;
	} else if(position === "bottom-right") {
		left = bounds.right - width;
		top = bounds.bottom - height;
	} else if(position === "center") {
		left = bounds.left + (bounds.width - width) / 2;
		top = bounds.top + (bounds.height - height) / 2;
	} else {
		left = bounds.left + (bounds.width - width) / 2;
		top = bounds.top;
	}

	node.style.position = "absolute";
	node.style.left = Math.round(left + dx) + "px";
	node.style.top = Math.round(top + dy) + "px";
	node.style.right = "auto";
	node.style.bottom = "auto";
	node.style.float = "none";
	node.style.clear = "none";
	node.style.margin = "0";

	return true;
};

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
			// this.print("onPaste", e);
			this.toast(js.sf("Pasted %d bytes...", e.length ))});
		Clipboard.onCopy.addListener(e => { 
			// this.print("onCopy", e);
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

		const Element = require("vcl/ui/Element");
		const scope = this.getScope();
		const elem = new Element(this);

		const timeout = options.ms ?? (options.hasOwnProperty("timeout") ? options.timeout : 1500);
		const classes = options.cl ?? options.classes ?? "glassy fade";
		const title = options.t ?? options.title;
		const alignment = options.alignment ?? options.align;
		const align = function() {
			if(alignment && elem._node) {
				elem.addClass("aligned");
				alignToastElement(scope.toasts, elem._node, alignment);
			}
		};

		let content = options.c ?? options.content ?? "No toast content";
		
		if(title !== undefined) {
			content = js.sf("<b>%s</b><div>%s</div>", options.title, content);
		}
		
		if(options.loading === true) {
			content += " &nbsp; " + IMG_LOADING;
		}

		elem.setContent(content);
		elem.setParent(scope.toasts);
		elem.addClasses(classes);
		elem.update(() => {
			align();
			elem.addClass("appear");
		});

		const controller = {
			element: elem, el: elem, elem,
			
			update: (content) => {
				controller.el.setContent(content);
				controller.el.update(align);
			},
			remove(timeout_) {
				elem.setTimeout("disappear", () => {

					elem.once("transitionend", () => elem.destroy());
					elem.replaceClass("appear", "disappear");

				}, timeout_ !== undefined ? timeout_ : timeout);
			},
			show() {
				elem.update(align);
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
	   		"": "overflow: visible;",
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
    			"display": "inline-block",
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
	    			'border-radius': "15px",
	    			"background-color": "rgba(215, 215, 215, 0.35)",
	    			"backdrop-filter": "blur(10px)",
	    			"-webkit-backdrop-filter": "blur(10px)"
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
        		"&.aligned": {
        			"z-index": "20001",
        			"box-shadow": "0 1px 5px rgba(0,0,0,0.15)"
        		},

    			"&.big": "font-size: 32pt;",
    			"&.medium": "font-size: 14pt;",
    			"&.fade": {
    				opacity: "0",
    				transition: "opacity 1s ease, margin-bottom 250ms ease-in",
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
    		}
    	}
    }]
]];
