$([], [
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
    $("vcl/Action", "toggle-console", {
        hotkey: `
keyup:Ctrl+Escape|keydown:Ctrl+Escape|
keyup:Ctrl+Shift+D|keydown:Ctrl+Shift+D|
keyup:Alt+Shift+X|keydown:Alt+Shift+X|
keyup:MetaCtrl+192`,
        onExecute: function (evt) {
            var scope = this.getScope();
            var focused;

            if (evt.type === "keydown") {
                focused = require("vcl/Control").focused;
                if (focused !== scope.console.getScope().console) {
                    this.setVar("focused", focused);
                }
            } else {
                if (!scope.console.isVisible()) {
                    scope.console.show();
                } else {
                    scope.console.hide();
                    focused = this.removeVar("focused");
                    if (focused && focused !== scope.console) {
                        this.setTimeout("focus", function() {
                            console.log("setFocus", focused);
                            focused.setFocus();
                        }, 250);
                    }
                }
            }

            return this.inherited(arguments);
        }
    }),
    $(["ui/forms/util/Console"], "console", {
    	align: "bottom",
	    height: 250,
	    visible: false,
	    vars: "parent: window;",
	    onLoad() {
	    	var Component = require("vcl/Component"), me = this.down("#console");
	    	Component.prototype.print = function(key, value) {
	    		if(arguments.length === 1) {
	    			key = "nokey";
	    		}
	    		me.print(key, value);
	    	};
	    	return this.inherited(arguments);
	    }
	    // onLoad: function() {
	    // 	var me = this;
	    // 	this.app().print = function() {
	    // 		me.print.apply(me, arguments);	
	    // 	};
	    	
	    // 	// require("vcl/Component").prototype.print = function() {
	    // 	// 	var console = this.udown("#console");
	    // 	// 	if(console) {
	    // 	// 		console.print.apply(console, arguments);
	    // 	// 	} else if(this._owner) {
	    // 	// 		this._owner.print.apply(this._owner, arguments);
	    // 	// 	}
	    // 	// };
	    // 	// return this.inherited(arguments);
	    // }
    })
]);