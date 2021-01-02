"vcl/Component, vcl/Control, vcl/Dragger, util/Command, util/HotkeyManager, vcl/ui/Sizer, vcl/ui/FormContainer, entities/EM, entities/ExpressionBuilder, util/Rest, features/FM";

var Component = require("vcl/Component");
var Control = require("vcl/Control");
var FormContainer = require("vcl/ui/FormContainer");
var Sizer = require("vcl/ui/Sizer");
var Command = require("util/Command");
var Rest = require("util/Rest");
// var EM = require("entities/EM");
// var FM = require("features/FM");
var Deferred = require("js/Deferred");
var JsObject = require("js/JsObject");
var Dragger = require("vcl/Dragger");

$(["ui/Form"], {
    activeControl: "console",
    align: "bottom",
    height: 250,
    visible: true,
    css: "background-color: white border-top: 1px solid silver z-index: 10000",
    // onMessage: function (name, params, sender) {
    //     var scope = this.getScope();
    //     if (name === "log") {
            
    //         console.warn("onMessage will be deprecated, migrate code to Component.prototype.emit and Component.prototype.query[All]");
            
    //         var args = js.copy_args(params);
    //         var source = params[0];
    //         if (typeof source !== "string") {
    //             source = "[source-unknown]";
    //         } else {
    //             args.shift();
    //         }
    //         scope.console.print.apply(scope.console, [js.sf("%n - %s", sender, source)].concat(args));
    //         return true;
    //     }

    //     return this.inherited(arguments);
    // },
    onActivate() {
        this._vars.sizer.setControl(null);
    },
    onLoad() {
        var me = this;
        var scope = this.getScope();
        var sizer = this.setVar("sizer", new Sizer(this));

        var app = this.getApp();
        app.on("print", function() {
console.log("app.on('print', ...)");
            scope.console.print.apply(scope.console, arguments);
        });
        
        var parent = this.scope()[this.getVar("parent")];
        if(parent) { this.setParent(parent); }

        // FIXME
        document.body.style.overflow = "hidden";

        sizer.on("setControl", function (value) {
            var content = [];
            var consoles = this.app().qsa("vcl/ui/Console").filter(c => c.isVisible());
            //[scope.console];

            if (value !== null) {
                if (value.getUri()) {
                    
                    // `#CVLN-20200904-3`
					var root = value.isRootComponent() ? ":root" : "";
					var uri = value.isRootComponent() ? value._uri : value.getUri();
					var selected = value.isSelected && value.isSelected() ? ":selected" : "";
					var disabled = value.isEnabled && value.isEnabled() ? "" : ":disabled";
                    
                    content.push(js.sf("%s%s%s%s", uri, root, selected, disabled));
                }
                content.push(js.sf("%n", value));
                if(sizer.getVar("meta") === true) {
                	consoles.forEach(c => c.getNode("input").value = js.sf("[#%d, \"%s\"]", 
                		value.hashCode(), content.join("\", \"")));
                } else {
					consoles.forEach(c => c.getNode("input").value = js.sf("#%d", value.hashCode()));
					consoles.forEach(c => c.focus());
				}
                if (value._owner) {
                    content.push(String.format("%n", value._owner));
                }
            }
            scope.sizer_selection.setContent(String.format("%H", content.join(" - ")));
        }, true);

        var down;
        // FIXME overriding dispatcher, Application.prototype.dispatchEvent(...)
        app._dispatcher.override({
            dispatch: function (component, name, evt) {
				// if(name.indexOf("key") === 0) {
				// 	console.log(evt.keyCode, name, {ctrl: evt.ctrlKey, alt: evt.altKey, shift: evt.shiftKey, meta: evt.metaKey});
				// }
                if (evt.keyCode === 27) {
                    if (sizer._control !== null) {
                        if (name === "keydown") {
                            down = Date.now();
                            if(evt.altKey === true) {
                            	var root = sizer._control.up();
                            	sizer.setControl(root === app ? null : root);
                            } else if(evt.shiftKey === true) {
                            	sizer.setControl(null);
                            } else {
                            	sizer.setControl(sizer._control._parent);
                            }
                        }
                        if (name === "keyup") {
                            // if(down + 750 < Date.now()) {
                            //     sizer.setControl(null);
                            // }
                            return false;
                        }
                    }
                }
                if (name === "dblclick" && evt.altKey === true) {
                    sizer.setControl(component);
		            var consoles = me.app().qsa("vcl/ui/Console").filter(c => c.isVisible());
                    if(consoles.length === 0) {
                    	me.ud("#toggle-console").execute({});
                    }
                    consoles.forEach(_ => { 
                    	_.getNode("input").value = ""; 
                    	_.print(js.sf("#%d", component.hashCode()), component);
                    });
                } else if (name === "click" && evt.altKey === true) {
                	sizer.setVar("meta", evt.metaKey === true);
                    if (evt.shiftKey === false) {
                        if (component instanceof Control) {
                            if (sizer._control === component) {
                                component = null;
                            	//me.getScope().console.setFocus();
                            }
                            sizer.setControl(component);
                            return false;
                        }
                    } else {
                        var fc = component;
                        while (fc instanceof Control) {
                            if (fc instanceof FormContainer) {
                                if(evt.metactrlKey === true) {
                                    var keys = Component.getKeysByUri(fc._formUri);

                                    if (confirm(String.format("Rescaffold %s?", fc.getForm().getUri())) === true) {
                                        fc.reloadForm();
                                        return false;
                                    }
                                } else {
                                    if (confirm(String.format("Reload %s?", fc.getForm().getUri())) === true) {
                                        fc.reloadForm();
                                        return false;
                                    }
                                }
                            }
                            fc = fc._parent;
                        }
                    }
                } else if(name ==="touchstart" || name === "touchmove") {
                	if(evt.touches.length > 3) {
                		app.getScope().toggle_console.execute(evt);
                	}
                }

                return this.inherited(arguments);
            }
        });

        return this.inherited(arguments);
    },
    onHide() {
    	var focused = Control.focused ;
    	var scope = this.getScope();
    	if(focused === scope.console) {
    		scope.console.getNode("input").blur();
    	}
    }

}, [
    $(["ui/controls/Toolbar"], "toolbar", {
        css: { cursor: "ns-resize" },
        draggable: true,
        onDraggerNeeded() {
            var control = this._owner;
            var dragger = new Dragger(this);

            dragger.setCursor("ns-resize");
            dragger.override({
                updateHandles: function (evt) {
                    control.setHeight(control.getHeight() - (evt.clientY - this._sy));
                    this._sy = evt.clientY;
                }
            });
            return dragger;
        }

    }, [
        $("vcl/ui/Element", "sizer_selection", {
            css: "padding: 4px; display: inline-block; cursor: default;"
        }),
        $([["ui/controls/SizeHandle"]], "size_handle", {
            classes: "vertical",
        	onClick() {
        		// this.udr("#toggle-console") doesn't work...
        		this.up().down("#toggle-console").execute({sender: this});
	        },
            vars: { control: "@owner" }
        })
    ]),
    $(("vcl/ui/Console"), "console", {
        onLoad() {
        	this.up().print("document", window.location);
        },
        onEvaluate(expr) {
            var scope = this.scope();
            var app = this.app();
            var pr = this.print.bind(this);
            
            var me = this;
            function open(uri, opts) {
                me.bubble("openform", js.mixIn(js.mixIn(opts || {}),
                    {uri: uri}));
            }

            function runAtServer(c, params, content) {
                return Command.execute(c, params, content);
            }

            if (expr.charAt(scope || Documents || 0) === ":") {
                expr = expr.substring(1).split(" ");
                if (expr.length > 0) {
                    expr = String.format("Utils.%s(scope, %s)", expr.shift(), expr.join(" "));
                } else {
                    expr = String.format("Utils.%s(scope)", expr.shift());
                }
            }

            if(expr === "@!") {
                expr = "@ reset()";
            }

            if (expr.substring(0, 1) === "@") {
                if (expr.substring(0, 2) === "@(") {
                    expr = "runAtServer(" + expr.substring(2);
                } else {
                    expr = String.format("runAtServer(\"scaffold.js/lib/eval\", %s);", JSON.stringify({
                        text: expr.substring(1)
                    }));
                }
            }

            /* jshint evil: true; */
            return eval(expr);
        }
    })
]);