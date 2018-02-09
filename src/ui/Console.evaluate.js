define(function() { return function(expr) {
	
	var Console = this.constructor;
	var Component = require("vcl/Component");
    var scope = this.scope();
    var me = this;
	
	// function log(console) {
	// 	var args = js.copy_args(arguments);

	// 	/*- first param can be owner or the console */
	// 	if(console instanceof Component) {
	// 		var scope = console.scope();
	// 		if(!(console instanceof Console)) {
	// 			console = scope.console;
	// 		}
	// 		if(args[0] === scope['@owner']) {
	// 			args.shift();
	// 		}
	// 	}
		
	// 	if(args.length >= 2) {
	// 		args[0] = String.format("%n", args[0]);
	// 		if(args.length === 3 && typeof args[1] === "string") {
	// 			args[0] += String.format(" - " + args.splice(1, 1)[0]);
	// 		}
	// 	}
		
	// 	if(!console) {
	// 		console = require("vcl/Application").instances[0].down("vcl/ui/Console");
	// 	}
		
	// 	return console.print.apply(console, args);
	// }
	function req() {
	    var d = new Deferred();
	    require.apply(this, [js.copy_args(arguments),
	        function () {
	            d.callback.apply(d, js.copy_args(arguments));
	        },
	        function (err) {
	            d.errback(err);
	        }
	    ]);
	    return d;
	}				
	function pr() { me.print.apply(me, arguments); }

    /* jshint evil: true */
	return eval(expr);
}});