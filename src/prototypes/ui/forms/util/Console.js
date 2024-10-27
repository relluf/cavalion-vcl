"use devtools/Resources, devtools/Parser, vcl/Component, vcl/Control, vcl/Dragger, util/HotkeyManager, vcl/ui/Sizer, vcl/ui/FormContainer, devtools/cavalion-devtools, vcl/ui/Ace";

const Component = require("vcl/Component");
const Control = require("vcl/Control");
const FormContainer = require("vcl/ui/FormContainer");
const Ace = require("vcl/ui/Ace");
const Sizer = require("vcl/ui/Sizer");
const Dragger = require("vcl/Dragger");
const Resources = require("devtools/Resources");
const Parser = require("devtools/Parser");

const HOTKEY_ALWAYS_ENABLED = {
	isHotkeyEnabled() { 
		return this._owner.isEnabled(); 
	}
};
const getAce = () => { 
	return Control.focused instanceof Ace ? 
		Control.focused :
		require("vcl/Application").instances[0]
			.qsa("#ace")
			.filter(ace => ace.isVisible())
			.pop();
};

const deselect = () => {
	window.getSelection && window.getSelection().removeAllRanges();
	document.selection && document.selection.empty();
};

window.H = (uri, vars) => B.i(["Hover<>", { vars: js.mi({ uri: uri }, vars)}]);

let cc = function() { // HM-20241010-1-method-auto-require-in-first-call
	// const args = js.copy_args(arguments);
	return Promise.resolve(req("clipboard-copy")).then(cc_ => {
		cc = cc_;
		
		return cc.apply(window, arguments);
	});
};

const cl = console.log;
const facts = (comp) => Component.getFactories(comp);

[["ui/Form"], {
    activeControl: "console",
    align: "bottom",
    height: 250,
    visible: true,
    onActivate() {
        // this._vars.sizer.setControl(null);
    },
    onLoad() {
    	
		require("devtools/cavalion-devtools")
			.init();
			// .then(this.print("cavalion-devtools loaded", Date.now()));
					
        var me = this, scope = this.scope(), app = this.app();
        var sizer = this.vars("sizer", new Sizer(this));

        var parent = this.scope()[this.vars("parent")];
        if(parent) { 
        	this.setParent(parent); 
        } else { 
        	this.setParentNode(this.vars(["#console.parentNode"]) || document.body);
        }

        sizer.on("setControl", function (value) {
            var consoles = this.app().qsa("vcl/ui/Console").filter(c => c.isVisible());
            var content = [];

            if(consoles.length === 0) {
            	consoles = [scope.console];
            }

            if (value !== null) {
                // `#CVLN-20200904-3`
                content.push(js.sf("%s%s%s", 
                	value.isRootComponent() ? ":root" : "", 
                	value.isSelected && value.isSelected() ? ":selected" : "", 
                	value.isEnabled && value.isEnabled() ? "" : ":disabled"));

        		if(value['@factory']) {
        			content.push(js.n(value['@factory']).split("#").slice(0, -1).join("!"));
        		}

        		content.push(js.sf("[%s]", value));
        		
				var props = [], hashAndNameOrUri = (c) => [c.hashCode(), c._name ? "#" + c._name : " " + c._uri].filter(s => s !== "").join("");
				if(value.up()) {
					props.push(js.sf("up(): #%s", hashAndNameOrUri(value.up())));
				}
                if (value._owner) {
                    props.push(js.sf("_owner: #%s", hashAndNameOrUri(value._owner)));
                }
                if(value._parent) {
                	props.push(js.sf("_parent: #%s", hashAndNameOrUri(value._parent)));
                }
                if(value._vars) {
                	props.push(js.sf("_vars: {%s}", Object.values(value._vars)
                		.filter(v => v && typeof v !== "function")
                		.map(v => js.n(v))
                		.join(", ")));
                }
                content.push(js.sf("{%s}", props.join(", ")));

                if(sizer.getVar("meta") === true) {
                	consoles.forEach(c => c.getNode("input").value = js.sf("[#%d, \"%s\"]", 
                		value.hashCode(), content.join("\", \"")));
                } else {
					consoles.forEach(c => c.getNode("input").value = js.sf("#%d", value.hashCode()));
					consoles.forEach(c => c.focus());
				}
            }
            scope.sizer_selection.setContent(String.format("%H", content.join(" ")));
            
            if(value !== null) {
            	if(!content[0]) content.shift();
                // content.pop();
    			app.toast({ title: js.sf("%n", value), content: " " || js.sf("<ul style='padding:0;padding-left:8px;'><li>%s</li></ul>", content.join("</li><li>")), classes: "glassy fade"});
            }
            
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
		                            evt.preventDefault();
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
	["vcl/Action", ("toggle-visible-selection"), {
		hotkey: "Shift+V",
		hotkeyPreventsDefault: false,
		overrides: {
			isHotkeyEnabled: () => true
		},
		
		on(evt) {
			const selectedControl = this.vars(["sizer._control"]);

			if(document.qsa("input:focus").length === 0 && 
				document.qsa("textarea:focus").length === 0 && 
				document.qsa("select:focus").length === 0
			) {
				const control = selectedControl;
				if(control) {
					control.toggle("visible");
					evt.preventDefault();
				} else {
					// TODO toggle visibility of last value in console
					this.print("no control selected")
				}
			} else {
				// this.print(js.sf("input:%s, textarea: %s, select: %s", 
				// 	document.qsa("input:focus").length,
				// 	document.qsa("textarea:focus").length,
				// 	document.qsa("select:focus").length));
			}
		}
	}],
    ["vcl/Action", ("format"), {
    	hotkey: "Shift+MetaCtrl+F",
		overrides: HOTKEY_ALWAYS_ENABLED,
    	on(evt) {
    		const ace = getAce();
    		if(ace) {
    			Parser.format(ace);
    		}
    	}
    }],
    ["vcl/Action", ("print"), {
    	hotkey: "MetaCtrl+Enter|Shift+MetaCtrl+Enter",
		overrides: HOTKEY_ALWAYS_ENABLED,
    	on(evt) {
    		const ace = evt.ace || getAce();
    		if(ace) {
	    		const resource = ace.vars(["resource"]);
	    		const doc = ace.vars(["instance"]) || {};
	    		const name = (uri) => uri.split("/").pop();
	    		
	    		let console = evt.shiftKey ? this.ud("#console") : (
	    			evt.console || ace.ud("> #console"));
	    		if(!console || !console.isVisible()) {
	    			console = this.ud("#console");
	    		}
	    		
	    		try {
		    		const root = Parser.getRoot(ace, {
		    			javascript: { eval_: (expr) => 
		    				this.ud("#console")._onEvaluate(expr, { ace: ace })
		    			}
		    		});
		    		
					(console || this.app()).print(name(resource ? resource.uri : (doc.id || doc.naam || "")), root);
	    		} catch(e) {
					(console || this.app()).print(name(resource ? resource.uri : (doc.id || doc.naam || "")), e);
	    		}
    		}
    	}
    }],
    ["vcl/Action", ("save-resource-local"), {
    	hotkey: "Shift+MetaCtrl+Alt+S",
    	on() {
			const ace = getAce();
			const resource = ace && ace.vars(["resource"]);

    		if(resource && ace instanceof Ace) {
				const text = ace.getValue();
				const blob = new Blob([text], { type: "text/plain" });
					
				if(!resource.name) { // TODO Resources.extrapolate(resource);
					resource.path = resource.uri.split("/");
					resource.name = resource.path.pop();
					resource.path = resource.path.join("/");
					resource.ext = resource.name.split(".").pop();
				}
				
				const link = document.createElement("a");
				link.setAttribute("href", URL.createObjectURL(blob));
				link.setAttribute("download", resource.name);
				
				document.body.appendChild(link);
				this.nextTick(() => { 
					link.click(); 
					document.body.removeChild(link); 
				});
    		} else {
    			this.app().toast({content:"No resource", classes: "fade glassy"});
    		}
    	}
    }],

	
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
			const cc = req("clipboard-copy");
			const pr = () => this.print.apply(this, arguments);

            const open = (uri, opts) => this.bubble(
            	"openform",
            	js.mixIn(js.mixIn(opts || {}), {uri: uri}));

            /* jshint evil: true; */
            return eval(expr);
        }
    }]
]];