"use util/HtmlElement, util/Fullscreen, vcl/ui/Element, vcl/ui/FormContainer, vcl/ui/Node, vcl/ui/Button";

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
    [("#window"), { 
    	css: {
			'#close-x': {
				'': "transition: opacity 1s; opacity: 0.1; position:absolute;top:0;right:0;color:silver;padding:4px 8px;font-size:14pt;z-index:999999999999;",
				'&:hover': "color:black;cursor:pointer;opacity: 1;"
			},
			'font-family': "Lucida Grande, Arial, sans-serif", 
			'font-size': "9pt",
			'.{./Button}': {
				'font-size': "9pt",
				'font-family': "Lucida Grande, Arial, sans-serif",
				'vertical-align': "top",
				'&.disabled': "color:gray;",
				'&:not(:active)': "margin-bottom:4px;",
				'&:active': "margin-bottom:0;margin-top:2px;border:2px solid rgb(57,121,217); padding-left:8px; padding-right:6px; background:-webkit-linear-gradient(top, rgb(255, 255, 255) 10%, rgb(227, 227, 227) 100%);"
			}
    	}
    }, [
        ["vcl/ui/FormContainer", "client", { 
        	formUri: "./ui/forms/Portal<>" 
        }],
    ]]
]];