"vcl/ui/LargeIcon, vcl/ui/Node, vcl/ui/FormContainer, vcl/ui/Node-closeable";

var Node = require("vcl/ui/Node");
var FormContainer = require("vcl/ui/FormContainer");
var Form = require("vcl/ui/Form");

var Handlers = {
	"client.onDispatchChildEvent": function(component, name, evt, f, args) {
		
		var form_scope, root_scope = this.scope();
		var form;

		if(component instanceof FormContainer) {
    		if(name === "formloadstart") {
    			// root_scope.description.setContent("<img src='/shared/vcl/images/loading.gif'>");
    		} else if((form = component.getForm()) !== null) {
    			form_scope = form.getScope();
    			if(name === "formload" && !form_scope.left) {
	    			root_scope.description.revertPropertyValue("content");
	    			// root_scope.description.setContent(form.vars(["description"]) || (form.qs("#description") || {})._content);
// console.log(js.sf("%n / description set to: %s", root_scope.description, root_scope.description._content));
    			}
    			if(form_scope.left && form_scope.left._uri.endsWith("prototypes/ui/forms/View")) {
    	    		if(name === "formload") {
    	    			form_scope.left.setVisible(false);
    	    		} else if(name === "formactivate") {
    	    			root_scope.left_content.hide();
    	    			form_scope.left_content.setParent(root_scope.left);

    	    		// 	form_scope.menubar.setParent(null);
    	    		// 	form_scope.menubar.setAlign("none");
    	    		// 	form_scope.menubar.setParent(form_scope.left_content);

    	    		} else if(name ==="formdeactivate" || name === "formclose") {
    	    			form_scope.left_content.setParent(form_scope.left);

    	    		// 	form_scope.menubar.setParent(null);
    	    		// 	form_scope.menubar.setAlign("top");
    	    		// 	form_scope.menubar.setParent(form_scope['@owner']);

    	    			root_scope.left_content.show();
    	    		}
    			}
    			if(form_scope.tree && form_scope.tree._uri.endsWith("prototypes/ui/forms/Home")) {
    	    		if(name === "formload") {
	    				var parent = root_scope.tree.getSelection()[0];
	    				if(parent.isSelected()) {
	    					//parent.setCss(js.mixIn(form_scope.tree.getCss()));
    						form_scope.tree.fire("onSelectionChange", [[parent]]);
	    				}
    	    		}
    			}
    		}
		} else if(component instanceof Form) {
				// this.print(component, js.sf("%s - %s", component.distanceToParentComponent(this._owner), name));
				form_scope = component.scope();
				
    			if(form_scope.left && form_scope.left._uri.endsWith("prototypes/ui/forms/View")) {
    	    		if(name === "load") {
    	    		} else if(name === "activate") {
    	    			root_scope.left_content.hide();
    	    			form_scope.left.setVisible(false);
    	    			form_scope.left_content.setParent(root_scope.left);

    	    		// 	form_scope.menubar.setParent(null);
    	    		// 	form_scope.menubar.setAlign("none");
    	    		// 	form_scope.menubar.setParent(form_scope.left_content);

    	    		} else if(name === "deactivate" || name === "close") {
    	    			form_scope.left_content.setParent(form_scope.left);

    	    		// 	form_scope.menubar.setParent(null);
    	    		// 	form_scope.menubar.setAlign("top");
    	    		// 	form_scope.menubar.setParent(form_scope['@owner']);

    	    			root_scope.left_content.show();
    	    		}
    			}
    			if(form_scope.tree && form_scope.tree._uri.endsWith("prototypes/ui/forms/Home")) {
    	    		if(name === "load") {
	    				var parent = root_scope.tree.getSelection()[0];
	    				if(parent.isSelected()) {
	    					//parent.setCss(js.mixIn(form_scope.tree.getCss()));
    						// form_scope.tree.fire("onSelectionChange", [[parent]]);
	    				}
    	    		}
    			}
		}
		
		return this.inherited(arguments);
	},
	"client.onDispatchChildEvent_v1": function(component, name, evt, f, args) {

		if(name.indexOf("form") !== 0 || component._parent !== this) {
			return this.inherited(arguments);
		}

		var form_scope, root_scope = this.getScope();
		var form;

		if(component instanceof FormContainer) {
    		if(name === "formloadstart") {
    			// root_scope.description.setContent("<img src='/shared/vcl/images/loading.gif'>");
    		} else if((form = component.getForm()) !== null) {
    			form_scope = form.getScope();
    			if(name === "formload" && !form_scope.left) {
	    			root_scope.description.revertPropertyValue("content");
	    			// /*!!!*/root_scope.description.setContent("--reverted1--");
    			}
    			if(form_scope.left && form_scope.left._uri.endsWith("prototypes/ui/forms/View")) {
    	    		if(name === "formload") {
    	    			form_scope.left.setVisible(false);
    	    		} else if(name === "formactivate") {
    	    			root_scope.left_content.hide();
    	    			form_scope.left_content.setParent(root_scope.left);

    	    		// 	form_scope.menubar.setParent(null);
    	    		// 	form_scope.menubar.setAlign("none");
    	    		// 	form_scope.menubar.setParent(form_scope.left_content);

    	    		} else if(name ==="formdeactivate" || name === "formclose") {
    	    			form_scope.left_content.setParent(form_scope.left);

    	    		// 	form_scope.menubar.setParent(null);
    	    		// 	form_scope.menubar.setAlign("top");
    	    		// 	form_scope.menubar.setParent(form_scope['@owner']);

    	    			root_scope.left_content.show();
    	    		}
    			}
    			if(form_scope.tree && form_scope.tree._uri.endsWith("prototypes/ui/forms/Home")) {
    	    		if(name === "formload") {
	    				var parent = root_scope.tree.getSelection()[0];
	    				if(parent.isSelected()) {
	    					//parent.setCss(js.mixIn(form_scope.tree.getCss()));
    						form_scope.tree.fire("onSelectionChange", [[parent]]);
	    				}
    	    		}
    			}
    		}
		}
		return this.inherited(arguments);
	},
	"tree.onNodesNeeded": function(parent) {
		var control = parent.apply("vcl/ui/Node.getControl", [this.getScope()]);
		var tree = parent.apply("vcl/ui/Node.getEmbeddedTree", [control]);
		var r;

		if(tree instanceof require("vcl/ui/Tree")) {
			//FIXME parent.setCss(tree.getCss());
			r = tree.fire("onNodesNeeded", arguments);
		} else {
			r = this.inherited(arguments);
		}

		return r;
	},
	"tree.onSelectionChange": function(selection) {
		var prev = [].concat(this.getVar("previousSelection", false, []));
		var scope = this.getScope();
		var node = selection[0], control, caption = [];

		this.app().pushState();
		this._owner.getVar("caption", false, this._owner._caption);

		/*- Gather current path */
        while(node instanceof Node) {
            try {
                caption.unshift(node.getNode("text").childNodes[0].nodeValue);
            } catch(e) {}
            node = node._parent;
        }

        if(this._owner.getVar("caption")) {
        	//console.debug(this._owner.getVar("caption"))
            caption.unshift(this._owner.getVar("caption"));
        }

//    		if(caption.length > 0) {
			caption = [caption.join(" / ")]; // ▶
//    		} else {
//    			caption.push(this._owner.getVar("caption"));
//    		}

		if(selection.length === 1) {
			// this._owner.setCaption(caption.join(" - "));
		} else {
			// this._owner.setCaption(caption);
		}

		this.setVar("previousSelection", selection);

		if((node = prev[0])) {
			if((control = node.apply("vcl/ui/Node.getControl", [scope]))) {
				control.hide();
			}
		}

		scope.description.revertPropertyValue("content");
		// /*!!!*/scope.description.setContent("--reverted2--");
// console.log(js.sf("%n / description set to: %s", scope.description, scope.description._content));

		// Is there a node selected?
		if(selection.length > 0) {
			var node = selection[0];
			var control = node.apply("vcl/ui/Node.getControl", [scope]);
			var tree = node.apply("vcl/ui/Node.getEmbeddedTree", [control]);

			if(control) {
				control.show();
			}

			tree && tree.fire("onSelectionChange", arguments);
		}

		prev = selection;

		return this.inherited(arguments);
	}
};

[(""), {
	vars: {
    	"App": {
    		getState: function() {
				var scope = this.getScope();
				var selection = scope.tree.getSelection();
				var form, nestedState;

				if(selection.length === 1 && (form = selection[0].apply("vcl/ui/Node.getForm"))) {
					nestedState = form.applyVar("App.getState", [], "silent");
				}
				return {
					nestedState: nestedState,
					restore: function(state) {
						scope.tree.setSelection(selection);
						this.nestedState && this.nestedState.restore(state);
					}
				};
    		}
    	},
		"vcl/ui/Tree": {
			getSelection: function() {
				var re = /ui\/forms\/Home\<.*\>\.tree/;
				return this.query("@owner", re).getScope().tree.getSelection();
			}
		},
		"vcl/ui/Node": {
			getControl: function(scope) {
				/**
				 * @return This method returns the control that is associated with 
				 * the calling vcl/ui/Node. The control is created if it doesn't 
				 * exist yet.
				 */
				var Control = require("vcl/Control");
	    		var control = this.getVar("control");

        		// If there isn't a control associated with the calling node...
				if(!(control instanceof Control)) {
					// ... check to see if a form should be instantiated
					if((value = this.getVar("formUri") || this.getVar("uri"))) {
						// Create a new control
						control = new (require("vcl/ui/FormContainer"))(this);
						control.setVisible(false);
						control.setFormUri(value);
						if((value = this.getVar("formParams"))) {
						    if(typeof value === "function") {
						        value = value.apply(this, []);
						    }
							control.setFormParams(value);
						}
					} else if(typeof (value = this.getVar("control")) === "string") {
						// ... or just find a control
						if(scope && !((control = scope[value]) instanceof Control)) {
							throw new Error(String.format("Can not find a control named %s", value));
						}
					}
					// If a new control was found or created...
					if(control) {
						// ...set the parent and store the reference
						scope && control.setParent(scope.client);
						this.setVar("control", control);
					}
				}

	    		return control;
			},
			getForm: function() {
				return this._control instanceof require("vcl/ui/FormContainer") ? this._control.getForm() : null;
			},
			getEmbeddedTree: function(control) {
				control = control || this.apply("vcl/ui/Node.getControl");
	    		if(control && control instanceof require("vcl/ui/FormContainer") && (control = control.getForm())) {
					control = control.query("tree")[0];
	    		}
	    		return control;
			}
		}
	},
	onMessage: function(name, message, sender) {
		var scope = this.getScope();
		if(name === "openform") {
			var Node = require("vcl/ui/Node-closeable");
			var FormContainer = require("vcl/ui/FormContainer");
			var prefix = this.vars(["App.openform.prefix"]) || "";
			
			// TODO Merge with Portal

			var parent = message.parent || scope.tree.getSelection()[0];
			var node = new Node(this);
			node.override({
				onclick: function(evt) {
					var r = this.inherited(arguments);
					if(r !== false && evt.target.className === "close") {
						try {
							this.getVar("control").getForm().close();
						} catch(e) {
							this.nextTick(() => this.destroy());
						}
					}
					return r;
				}
			});
			node.addClass("closeable");
			
			var container = new FormContainer(node);
			container.setFormUri(message.uri.startsWith("/") ? 
				message.uri.substring(1) : 
				prefix + message.uri);
			if(message.params) {
				container.setFormParams(message.params);
				node.setVars(message.params);
			}

			if(message.path) {
				node.print("varring path", message.path);
				node.vars("path", message.path);
			}

			// @overrides ui/forms/Home<>
			container.setVisible(false);
			container.setParent(scope.client);
			
			node.setText(message.text || message.title || "&nbsp;");
			node.setVar("control", container);
			node.setParent(parent || scope.tree);
			node.update(function() {
				node.setExpanded(true);
				node.setExpandable(false);
				if(typeof message.callback_node === "function") { // TODO better API
					message.callback_node(node);
				}
			});

			container.on({
				"formclose": function() {
					node.destroy();
				},
				"formloadstart": function() {
					node.addClass("loading");
					node.setText(message.title || "&nbsp;");
				},
				"formloadend": function() {
					node.removeClass("loading");
					if(message.callback) {
						message.callback(this._form);
					}
				},
				"formload": function() {
					var form = this._form;
					function f(evt) {
                        var text = form.getCaption();

                        if (text instanceof Array) {
                            node.setText(text.join(""));
                        } else {
                            node.setText(String.format("%H", text || message.title));
                        }
					}
					form.on("captionchanged", f);
					f();
				}
			});

			if(parent && parent.setExpanded) {
				parent.setExpanded(true);
			}

			if(message.activate !== false) {
				scope.tree.setSelection([node]);
				node.update(() => {
					node._parent.scrollIntoView();
					node.scrollIntoView({block: window.BLOCK || "center"});
				});
			} else if(message.lazyLoad !== true) {
				container.forceLoad();
			}
			
			return true;
		}
	}
}, [
    [("#client"), { 
    	onDispatchChildEvent: Handlers["client.onDispatchChildEvent"] 
    }],
    [("#tree"), { 
    	onNodesNeeded: Handlers["tree.onNodesNeeded"],
    	onSelectionChange: Handlers["tree.onSelectionChange"]
    }]
]];