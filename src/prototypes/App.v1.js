"use util/Browser, util/HtmlElement, util/Fullscreen, vcl/ui/Element, vcl/ui/FormContainer, vcl/ui/Tree, vcl/ui/Node, vcl/ui/Button";

var Fullscreen = require("util/Fullscreen");
var HtmlElement = require("util/HtmlElement");
var Element = require("vcl/ui/Element");
var FormContainer = require("vcl/ui/FormContainer");
var Browser = require("util/Browser");

// Browser.win = true;

const font_family = (Browser.win ? "Segoe UI, Tahoma, " : "") + "Lucida Grande, Arial, sans-serif";
const letter_spacing = Browser.win ? "0.75px" : "";
const default_zoom = Browser.win ? "zoom-109" : "zoom-121";

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
			'font-family': font_family, 
			'font-size': "9pt",
			'letter-spacing': letter_spacing,
			'.{Button}': {
				'font-size': "9pt",
				'font-family': font_family,
				'letter-spacing': letter_spacing,
				'vertical-align': "top",
				'&.disabled': "color:gray;",
				'&:not(:active)': "margin-bottom:4px;",
				'&:active': "margin-bottom:0;margin-top:2px;border:2px solid rgb(57,121,217); padding-left:8px; padding-right:6px;" // background:-webkit-linear-gradient(top, rgb(255, 255, 255) 10%, rgb(227, 227, 227) 100%);
			},
			'.zoom-109': {
				'': "zoom: 1.09091;",
				'.zoom-cancel': "zoom: 0.91667;",
				'.{Ace}': "zoom: 0.91667; font-size: 112.5%;"
			},
			'.zoom-125': {
				'': "zoom: 1.25;",
				'.zoom-cancel': "zoom: 0.8;",
				'.{Ace}': "zoom: 0.8; font-size: 125%;"
			},
			'.zoom-121': {
				'': "zoom: 1.21212121;",
				'.zoom-cancel': "zoom: 0.825;",
				'.{Ace}': "zoom: 0.8; font-size: 121.21%;"
			}
    	}
    }, [
        ["vcl/ui/FormContainer", "client", { 
			classes: default_zoom,
        	formUri: "./ui/forms/Portal<>" 
        }]
    ]]
]];