"js/minify, devtools/Resources";

var RM = require("devtools/Resources");

var Handlers = {
	merge_lib() {
        var vars = this._owner.getVars();
        vars.modules = vars.modules.concat(vars.extraModules);
        this._owner.render();
    },
    merge_app() {
        var vars = this._owner.getVars();
        vars.components = vars.components.concat(vars.extraComponents);
        this._owner.render();
	},
    make_app() {
        // FIXME This should be moved to Factory?

	    var Component = require("vcl/Component");
	    var Factory = require("vcl/Factory");
	    var Ajax = require("util/Ajax");
	    var minify = require("js/minify");

        var scope = this.getScope();
	    var ctx = requirejs.s.contexts._;
	    var source = [];
	    var count = 0;
	    var vars = this._owner.getVars(), v, k;
	    
	    source.push("/*- Implicit Sources (vcl) */");
	    for(k in Factory.implicit_sources) {
	    	v = Factory.implicit_sources[k];

	    	source.push(String.format("define(\"%s\", %s);", k, JSON.stringify(v)));
	    }

	    Factory = require("blocks/Factory");
	    source.push("\n\n/*- Implicit Sources (blocks) */");
	    source.push(js.sf("define(\"blocks/Factory.implicit_sources\", function() { return (%s); });", 
	    	js.b(JSON.stringify(Factory.implicit_sources))));

	    function callback(uri, text) {
	    	if(text) {
		        text = text.replace(/\r/g, "");
		        if(uri.indexOf(".js") === uri.length - 3) {
		        	text = minify(text);
		        }
	            source.push(String.format("define(\"%s\", %s);", uri, JSON.stringify(text)));
	    	}
            if(--count === 0) {
                scope['extra-components'].setValue(source.join("\n"));
            }
        }

	    source.push("\n\n/*- Sources */");

	    vars.components.forEach(function(uri) {
	        count++;
			requirejs.undef(uri);
	    });

	    vars.components.forEach(function(uri) {
	        require([uri], function(text) {
		    	console.log(">>>" + uri);
                callback(uri, text);
	        }, function(err) {
                //callback(uri, Component.getImplicitSourceByUri(uri));
                // throw err;
                callback(uri);
	        });
	    });
    },
    push_app(evt) {
		var uri = this.vars(["app-js"]); 
		if(!uri) { 
			return alert("app-js not set"); 
		}
		
		if(confirm("Make?")) {
			Handlers.make_app.apply(this, [evt]);
		}
		
		var text = this.ud("#extra-components").getValue();
		RM.get(uri).then(res => {
			res.text = text;
			res = RM.update(uri, res).then(res => alert("Pushed"));
			this.print("Push app-js", res);
		});
    },
    make_styles() {
	    var ctx = requirejs.s.contexts._;
        var scope = this.scope();
	    var styles = this.vars(["styles"]).map(_ => "text!" + _.split("!").pop()).filter(_ => _);
	    require(styles, function() {
	    	var args = js.copy_args(arguments);
	    	scope['extra-styles'].setValue(args.join("\n"));
	    });
    },
    set_lib() {
    	var scope = this.scope();
    	var modules = this.vars(["modules", true]);
    	var components = this.vars(["components", true]);
    	
    	var all = JSON.parse(scope.modules.getValue());
    	scope['extra-modules'].setValue(all.join("\n"));
    },
    set_app() {
    	var scope = this.scope();
    	var components = this.vars(["components", true]);
    	
    	var all = JSON.parse(scope.components.getValue());
    	scope['extra-components'].setValue(all.join("\n"));
    }
};

[["ui/Form"], {
    css: {
        padding: "8px",
        "textarea": {
            display: "inline-block",
            padding: "2px",
            "font-family": "lucida console, menlo, monaco",
            "font-size": "8pt",
            width: "50%",
            "max-width": "50%",
            height: "175px",
            "margin-bottom": "4px"
        },
        ".{CheckGroup}": "margin-bottom: 8px;"
    },
    caption: "Make",
    vars: {
    	styles: [],
        modules: [],
        components: [],
        implicit_components: {}
    },

    onActivate: function() {
    	this.render();
    },
    onRender: function() {
        var vars = this.getVars();
        var scope = this.getScope();
        var ctx = requirejs.s.contexts._;
        var uri;

        vars.extraModules = [];
        vars.extraComponents = [];

        ctx.modulesLoaded.forEach(function(module) {
	    	if(module.indexOf("pages/") === 0) { 
	    	} else if(vars.modules.indexOf(module) === -1) {
                vars.extraModules.push(module);
            }
        });

	    for(var k in ctx.defined) {
	    	
	    	if(k.indexOf("pages/") === 0) {
	    		
	    		// ignore, or require individual files for now
	    		
	    	} else if(k.indexOf("text!") === 0) {
	            uri = k;//k.substring("text!".length);
	            // FIXME Central rules for these things
	            if(uri.indexOf("text!make/") !== 0 && 
	            	uri.indexOf("text!vcl/prototypes/make/") !== 0) {
    	            if(vars.components.indexOf(uri) === -1) {
    	                vars.extraComponents.push(uri);
    	            }
	            }
	        // } else if(k.indexOf("!") === -1 && vars.modules.indexOf(k) === -1) {
         //       vars.extraModules.push(k);
	        }
	    }

        scope.styles.setValue(JSON.stringify(vars.styles));

        scope.modules.setValue(JSON.stringify(vars.modules));
        scope.components.setValue(JSON.stringify(vars.components));

        scope['extra-modules'].setValue(vars.extraModules.join("\n"));
        scope['extra-components'].setValue(vars.extraComponents.join("\n"));
    }
    
}, [
    [("vcl/ui/Group"), {}, [
        [("vcl/ui/CheckGroup"), "app.js", {
            text: "app.js",
            expanded: true
        }, [
            [("vcl/ui/Group"), {}, [
                [("vcl/ui/Input"), "components", {
                    element: "textarea"
                }],
                [("vcl/ui/Input"), "extra-components", {
                    element: "textarea"
                }],
                [("vcl/ui/Input"), "implicit-components", {
                    element: "textarea"
                }]
            ]],
            [("vcl/ui/Button"), {
                content: "Merge",
                onClick: Handlers.merge_app
            }],
            [("vcl/ui/Button"), {
                content: ">>>",
                onClick: Handlers.set_app
            }],
            [("vcl/ui/Button"), {
                content: "Make",
                onClick: Handlers.make_app
            }],
            [("vcl/ui/Button"), {
                content: "Push",
                onClick: Handlers.push_app
            }]
        ]],
        [("vcl/ui/CheckGroup"), "styles.less", {
            text: "styles.less",
            expanded: true
        }, [
            [("vcl/ui/Group"), {}, [
                [("vcl/ui/Input"), "styles", {
                    element: "textarea"
                }],
                [("vcl/ui/Input"), "extra-styles", {
                    element: "textarea"
                }],
            ]],
            [("vcl/ui/Button"), {
                content: "Make",
                onClick: Handlers.make_styles
            }]
        ]],
        [("vcl/ui/CheckGroup"), "lib.js", {
            text: "lib.js",
            expanded: true
        }, [
            [("vcl/ui/Group"), {}, [
                [("vcl/ui/Input"), "modules", {
                    element: "textarea"
                }],
                [("vcl/ui/Input"), "extra-modules", {
                    element: "textarea"
                }],
            ]],
            [("vcl/ui/Button"), {
                content: "Merge",
                onClick: Handlers.merge_lib
            }],
            [("vcl/ui/Button"), {
                content: ">>>",
                onClick: Handlers.set_lib
            }]
        ]]
    ]]
]];