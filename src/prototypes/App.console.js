$([], {
    onLoad: function() {
    	var c = this.down("vcl/ui/Console#console");
    	this.app().print = function() {
    		c.print.apply(c, arguments);	
    	};
    	
    	return this.inherited(arguments);
    }
}, [
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
	    vars: "parent: window;"
    })
]);
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
    	// require("vcl/Component").prototype.print = function() {
    	// 	var console = this.udown("#console");
    	// 	if(console) {
    	// 		console.print.apply(console, arguments);
    	// 	} else if(this._owner) {
    	// 		this._owner.print.apply(this._owner, arguments);
    	// 	}
    	// };