"use override, util/Event, console/node/vcl/Component";

var override = require("override");
var Event = require("util/Event");

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

["", [
    ["vcl/Action", ("toggle-console"), {
        hotkey: `
keyup:Ctrl+Escape|keydown:Ctrl+Escape|
keyup:Ctrl+Shift+D|keydown:Ctrl+Shift+D|
keyup:Alt+Shift+X|keydown:Alt+Shift+X|
keyup:MetaCtrl+192`,
		onLoad() {
			// TODO #CVLN-20200822-2
			this.readStorage("visible", (visible) => eval(visible) && this.execute({}));
		},
        onExecute(evt) {
            var scope = this.scope();
            var focused;

            if (evt.type === "keydown") {
                focused = require("vcl/Control").focused;
                if (focused !== scope.console.getScope().console) {
                    this.setVar("focused", focused);
                }
            } else {
                if (!scope.console.isVisible()) {
                    scope.console.show();
                    scope['align-enabled'].setState(true);
                } else {
                    scope['align-enabled'].setState(false);
                    scope.console.hide();
                    focused = this.removeVar("focused");
                    if (focused && focused !== scope.console) {
                        this.setTimeout("focus", function() {
                            // console.log("setFocus", focused);
                            focused.setFocus();
                        }, 250);
                    }
                }
            }

            this.writeStorage("visible", scope.console.isVisible());
            
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
    		var delta = evt.keyCode === Event.keys.KEY_UP_ARROW ? 100 : -100;
    		var height = console.getHeight() + delta;
    		if(console._align !== "bottom" && console._align !== "top") {
    			console.setAlign(delta === -100 ? "bottom" : "top");
    			height = console.vars("height") || 200;
    		} else {
	    		if(height < 100) {
	    			height = 100;
	    		} else {
    				var cs = console._parent.getComputedStyle();
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
    		var delta = evt.keyCode === Event.keys.KEY_RIGHT_ARROW ? 100 : -100;
    		var width = console.getWidth() + delta;
    		if(console._align !== "left" && console._align !== "right") {
    			console.setAlign(delta === -100 ? "left" : "right");
    			width = console.vars("width") || 375;
    		} else {
	    		if(width < 100) {
	    			width = 100;
	    		} else {
    				var cs = console._parent.getComputedStyle();
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
    [["ui/forms/util/Console"], "console", {
    	align: "bottom",
	    height: 250,
	    visible: false,
	    vars: "parent: window;"
    }]
]];
    // $("vcl/Action", "toggle-server", {
    //     hotkey: "Ctrl+F2",
    //     onExecute: function() {
    //         this.getApp().prompt("switchto", "ralph", function(server) {
    //             if(server !== null) {
    //                 var arr = window.location.toString().split("/");
    //                 arr[2] = server;
    //                 window.location = arr.join("/");
    //             }
    //         });
    //     }
    // }),
    // $("vcl/Action", "open-debug", {
    //     hotkey: "Ctrl+F3",
    //     onExecute: function() {
    //     }
    // }),
	// onLoad() {
 //   	var me = this.down("#console");
 //   	this.print = function() {
 //   		me.print.apply(me, arguments);
 //   	};
	//     return this.inherited(arguments);
	// }