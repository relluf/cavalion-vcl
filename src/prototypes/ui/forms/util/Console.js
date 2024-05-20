"use vcl/Component, vcl/Control, vcl/Dragger, util/Command, util/HotkeyManager, vcl/ui/Sizer, vcl/ui/FormContainer, entities/EM, entities/ExpressionBuilder, util/Rest, features/FM";

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

var deselect = () => {
	window.getSelection && window.getSelection().removeAllRanges();
	document.selection && document.selection.empty();
};

var cl = console.log;

[["ui/Form"], {
    activeControl: "console",
    align: "bottom",
    height: 250,
    visible: true,
    onActivate() {
        // this._vars.sizer.setControl(null);
    },
    onLoad() {
        var me = this, scope = this.scope(), app = this.app();
        var sizer = this.vars("sizer", new Sizer(this));

        var parent = this.scope()[this.vars("parent")];
        if(parent) { 
        	this.setParent(parent); 
        } else { 
        	this.setParentNode(this.vars(["#console.parentNode"]) || document.body);
        }

        sizer.on("setControl", function (value) {
        	if(value) {
        		// app.toast({ content: js.sf("SETCONTROL: %n", value), classes: "glassy fade"});
        	}
        	
            var consoles = this.app().qsa("vcl/ui/Console").filter(c => c.isVisible());
            var content = [];

            if(consoles.length === 0) {
            	// me.show();
            	consoles = [scope.console];
            }

            if (value !== null) {
                if (value.getUri()) {
                    
                    // `#CVLN-20200904-3`
					var root = value.isRootComponent() ? ":root" : "";
					var uri = value.isRootComponent() ? value._uri : value.getUri();
					var selected = value.isSelected && value.isSelected() ? ":selected" : "";
					var disabled = value.isEnabled && value.isEnabled() ? "" : ":disabled";
                    
                    content.push(js.sf("%s%s%s%s", uri, root, selected, disabled));
                }
                // content.push(js.sf("%n", value));
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
    			app.toast({ title: js.sf("%n", value), content: js.sf("<ul style='padding:0;padding-left:8px;'><li>%s</li></ul>", content.join("</li><li>")), classes: "glassy fade"});
            }
            scope.sizer_selection.setContent(String.format("%H", content.join(" - ")));
        }, true);

        var down;
        // FIXME overriding dispatcher, Application.prototype.dispatchEvent(...)
    	this.app()._dispatcher.override({
        	dispatch: function (component, name, evt) {
                if(evt.keyCode === 27 /* Escape */) {
                    if (sizer._control !== null) {
                        if (name === "keydown" && evt.ctrlKey === false) {
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
                            if(evt.ctrlKey === false) {
                        		return false;
                            }
                        }
                    }
                }
                
                if(sizer._control !== null && name === "keyup" && evt.keyCode === 46 /*Delete*/) {
                	const uri = js.sf("%s%s%s", sizer._control.getUri(), sizer._control.isSelected() ? ":selected" : "", sizer._control.isRootComponent() ? ":root" : "");
                	const names = js.sf("%s#%n", uri, sizer._control).split("#");
                	let n;
                	if(confirm(js.sf("Choose OK in order to confirm the destruction of the following component:\n\n%s\n\n%d component%s will be destroyed.", 
                		names.map((n, i) => js.sf("- %s%s", i > 1 ? "#" : "", n)).join("\n"),
                		(n = sizer._control.qsa("*").length + 1), n === 1 ? "" : "s"
                	))) {
                		sizer._control.destroy();
                		// sizer.setControl(null);
                	}
                }
                
                if(evt.target.nodeName !== "A") {
                
	                if(evt.altKey === true) {
		                if (name === "dblclick" && evt.metaKey) {
		                    sizer.setControl(component);
				            var consoles = me.app().qsa("vcl/ui/Console").filter(c => c.isVisible());
		                    if(consoles.length === 0) {
		                    	me.ud("#toggle-console").execute({});
		                    }
		                    consoles.forEach(_ => { 
		                    	_.getNode("input").value = ""; 
		                    	_.print(js.sf("#%d", component.hashCode()), component);
		                    });
		                    return false;
		                } else if (name === "click") {
		                	// sizer.vars("meta", evt.metaKey === true);
		                    if (evt.metaKey === true) {
		                        if (component instanceof Control) {
		                            if (sizer._control === component) {
		                            	// deselect
		                                component = null;
		                            }
		                            sizer.setControl(component);
		                            return false;
		                        }
		                    } else if(evt.shiftKey === true) {
		                        var fc = component;
		                        evt.preventDefault();
		                        deselect();
		                        me.setTimeout("deselect", () => {
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
		                        }, 100);
		                    }
		                } else if(name ==="touchstart" || name === "touchmove") {
		                	if(evt.touches.length > 3) {
		                		app.getScope().toggle_console.execute(evt);
		                	}
		                }
	                }
                }
                
                if(name.startsWith("mouse") || name.startsWith("key")) {
                	me.setTimeout("sizer-update", () => sizer.update(), 50);
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
    [["ui/controls/Toolbar"], "toolbar", {
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
        [("vcl/ui/Element"), "sizer_selection", {
            css: "padding: 4px; display: inline-block; cursor: default;"
        }],
        [["ui/controls/SizeHandle"], "size_handle", {
            classes: "vertical",
        	onClick() {
        		// this.udr("#toggle-console") doesn't work...?
        		this.up().down("#toggle-console").execute({sender: this});
	        },
            vars: { control: "@owner" }
        }]
    ]],
    [("vcl/ui/Console"), "console", {
        onLoad() {
        	this.up().print("document", window.location);
        },
        onEvaluate(expr) {
			const cl = console.log;
			// const cc = require("clipboard-copy");
			const pr = () => this.print.apply(this, arguments);
			const me = this;

            const open = (uri, opts) => this.bubble(
            	"openform",
            	js.mixIn(js.mixIn(opts || {}), {uri: uri}));

            /* jshint evil: true; */
            return eval(expr);
        }
    }]
]];