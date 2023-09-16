define(function() { return function(expr) {

	var Console = this.constructor;
	var Deferred = require("js/Deferred");
	var Component = require("vcl/Component");
	var Control = require("vcl/Control");

    var scope = this.scope();
    var me = this;
	
	function req() {
	    if (arguments.length == 1) {
	        try {
	            return require(arguments[0]);
	        } catch(e) {}
	    }
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
	
	const cl = console.log;
	// const cc = require("clipboard-copy");
	const pr = () => me.print.apply(me, arguments);

    /* jshint evil: true */
	return eval(expr);
}});