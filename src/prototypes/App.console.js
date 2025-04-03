"use override, util/Event, util/HtmlElement, console/node/vcl/Component, vcl/Control";

const override = require("override");
const Event_ = require("util/Event");
const HtmlElement = require("util/HtmlElement");
const Control = require("vcl/Control");

require("console/node/vcl/Component").initialize();
override(require("vcl/Component").prototype, "print", function(inherited) {
	return function() {
		var console = this.down("vcl/ui/Console#console");
		if(console && !console.vars("skip-print")) {
			return console.print.apply(console, arguments);
		}
		return inherited.apply(this, arguments);
	};
});

[(""), [
    ["vcl/Action", ("toggle-console"), {
        hotkey: "keyup:Ctrl+Escape|keydown_:Ctrl+Escape|keyup:Ctrl+Shift+D|keyup:MetaCtrl+192",
		onLoad() {
			// TODO #CVLN-20200822-2
			this.readStorage("visible", (visible) => JSON.parse(visible) && this.execute({}));
		},
        onExecute(evt) {
            var scope = this.scope(), console = scope.console.qs("#console");
            var focused = Control.findByNode(document.qs(":focus"));
            var visible = scope.console.getVisible();

        	if(focused !== console) {
        		this.vars("focused", focused);
        	}
          
            if(visible && focused !== console) {
            	console.setFocus();
            } else if(!scope.console.toggle("visible")) {
        		if((focused = this.vars("focused"))) {
        			focused.setFocus();
        		}
        	}
        	
        	visible = scope.console.isVisible();
        	scope['align-enabled'].setState(visible);
            this.writeStorage("visible", visible);
            
            return this.inherited(arguments);
        }
    }],
    ["vcl/Action", ("align-enabled"), {
    	enabled: "state",
    	state: false
    }],
    ["vcl/Action", ("align-size-vertically"), {
    	hotkey: "keyup:Ctrl+Alt+Down|keyup:Ctrl+Alt+Up",
    	enabled: "parent",
    	parent: "align-enabled",
    	on(evt) { 
    		var console = this.scope().console;
    		var delta = evt.keyCode === Event_.keys.KEY_UP_ARROW ? 100 : -100;
    		var height = console.getHeight() + delta;
    		if(console._align !== "bottom" && console._align !== "top") {
    			console.setAlign(delta === -100 ? "bottom" : "top");
    			height = console.vars("height") || 200;
    		} else {
	    		if(height < 100) {
	    			height = 100;
	    		} else {
    				// var cs = console._parent.getComputedStyle();
    				var cs = HtmlElement.getComputedStyle(console.getParentNode());
	    			if(height > parseInt(cs.height, 10)) {
	    				height = parseInt(cs.height, 10);
	    			}
	    		}
    		}
    		console.setHeight(height);
    		console.vars("height", height);
    		if((console = console.qs("#console")).hasClass("no-time")) { 
    			console.removeClass("no-time"); 
    		}
    	}
    }],
    ["vcl/Action", ("align-size-horizontally"), {
    	hotkey: "Ctrl+Alt+Left|Ctrl+Alt+Right",
    	enabled: "parent",
    	parent: "align-enabled",
    	on(evt) { 
    		var console = this.scope().console, cons = console.qs("#console");
    		var delta = evt.keyCode === Event_.keys.KEY_RIGHT_ARROW ? 100 : -100;
			if(console._align === "right") delta = -delta;
    		var width = console.getWidth() + delta;
    		if(console._align !== "left" && console._align !== "right") {
    			console.setAlign(delta === -100 ? "left" : "right");
    			width = console.vars("width") || 375;
    		} else {
	    		if(width < 100) {
	    			width = 100;
	    		} else {
    				// var cs = console._parent.getComputedStyle();
    				var cs = HtmlElement.getComputedStyle(console.getParentNode());
	    			if(width > parseInt(cs.width, 10) - 175) {
	    				width = parseInt(cs.width, 10) - 175;
	    			}
	    		}
    		}
    		console.setWidth(width);
    		console.vars("width", width);
    		if(!(console = console.qs("#console")).hasClass("no-time")) { 
    			console.addClass("no-time"); 
    		}
    	}
    }],
    ["vcl/Action", ("open-alphaview"), {
    	hotkey: "MetaCtrl+F3",
    	on() {
    		let c = Control.findByNode(document.qs(":focus"));
    		if(c && (c = c instanceof (req("vcl/ui/Console")) ? c : c.udr("vcl/ui/Console"))) {
    			H("devtools/Alphaview.csv", { console: c });
			} else {
				H("devtools/Alphaview.csv");
			}
    	}
    }],
    
    [["ui/forms/util/Console"], "console", {
    	align: "bottom",
	    height: 250,
	    // css: "background-color:rgba(255,255,255,0.5);backdrop-filter:blur(10px);",
	    visible: false,
	    vars: "parent: window;"
    }]
]];
