"use js, util/Browser, vcl/ui/Node, vcl/ui/Input, vcl/ui/Tab, vcl/ui/Button";

const Browser = require("util/Browser");

console.warn("maybe require vcl/ui/Ace");

// Browser.win = true;

const font_family = (Browser.win ? "Segoe UI, Tahoma, " : "") + "Lucida Grande, Arial, sans-serif";
const font_size = "9pt";
const letter_spacing = Browser.win ? "0.75px" : "";
const default_zoom = Browser.win ? "zoom-109" : "zoom-121";

const css = {
	'font-family': font_family, 
	'font-size': font_size,
	'letter-spacing': letter_spacing,
	'.{Console}': {
		'.node > .container': "padding-top: 2px;",
		'.node': "padding-bottom: 2.4px;"
	},
	'.{Button}': {
		'font-size': font_size,
		'font-family': font_family,
		'letter-spacing': letter_spacing,
		'vertical-align': "top",
		'&.disabled': "color:gray;",
		'&:not(:active)': "margin-bottom:4px;",
		'&:active': "margin-bottom:0;margin-top:2px;border:2px solid rgb(57,121,217); padding-left:8px; padding-right:6px;"// background:-webkit-linear-gradient(top, rgb(255, 255, 255) 10%, rgb(227, 227, 227) 100%);"
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
};

[["./App.console.toast.glassy<>"], {
	vars: { canunload: false }
}, [
	
    // [("vcl/Action"), "reload-app", {
    // 	hotkey: "Shift+MetaCtrl+R|Cmd+Alt+R",
    // 	on() { 
    // 		document.location.reload(); 
    // 	}
    // }],
    
    [("#window"), { css: css }]
]];