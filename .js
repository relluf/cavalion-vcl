var require = window.require;
var Factory = require("vcl/Factory");
var Factory_require = Factory.require;

Factory.unreq = (name) => {
    // var factory;
    // try {
	var factory = require(String.format("vcl/Factory!%s", name));
    // } catch(e) {
    	// this.print(e);
        // return;
    // }

	requirejs.undef(Factory.makeTextUri(factory._uri));
	requirejs.undef(String.format("vcl/Factory!%s", factory._uri));

	this.print("unreq'd", factory);

    var factories = factory._root.inherits;
    factories && factories.forEach(function(name) {
        Factory.unreq(name);
    });
    
    return [name].concat(factories);
};

Factory.require = (name, callback, failback) => {
	Factory_require(name, callback, failback);	
	if(typeof name === "string") {
		this.print("req'd", name);
	}
};

({
	texts: Object.keys(window.require.s.contexts._.defined).filter(s => s.startsWith("text!") && s.includes("devtools")),
	factories: Object.keys(window.require.s.contexts._.defined).filter(s => s.startsWith("vcl/Factory!") && s.includes("devtools"))
});