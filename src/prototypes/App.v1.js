"util/HtmlElement, util/Fullscreen, vcl/ui/Element, vcl/ui/FormContainer";

var Fullscreen = require("util/Fullscreen");
var HtmlElement = require("util/HtmlElement");
var Element = require("vcl/ui/Element");
var FormContainer = require("vcl/ui/FormContainer");

[["./App.openform.toast.glassy"], {
	onLoad: function() {
    	var img = document.body.childNodes[0];
    	if(img && img.nodeName === "IMG") {
    		img.parentNode.removeChild(img);
    	} else {
    		img = document.body.querySelector("img.loading_");
    		img && img.parentNode.removeChild(img);
    	}
    	
		var scope = this.scope(), delegate;
        scope.window.setParentNode(this.isDesigning() ?
    		scope.window.getDesigner().getParentNode() : 
    		document.body);
    		
    	return this.inherited(arguments);
	},
	onDispatchChildEvent: function(component, name, evt, f, args) {
		if(name === "touchstart") {
			if(!Fullscreen.hasRequested()) {
				Fullscreen.request(document.documentElement);
			}
		}
        return this.inherited(arguments);
	},
    onGetState: function() {
        var scope = this.getScope();
        var form = scope.client._form;
        if(form) {
        	// var r = form.applyVar("App.getState", [], "silent");
        	// this.print("onGetState", r);
        	// return r;
        	
            return form.applyVar("App.getState", [], "silent");
        }
        return {
            restore: function() {
                alert("?");
            }
        };
    },
    onSetState: function(state) {
        state && state.restore && state.restore(state);
    }
}, [
    [("#window"), { }, [
        ["vcl/ui/FormContainer", "client", { 
        	formUri: "./ui/forms/Portal<>" 
        }],
    ]]
]];