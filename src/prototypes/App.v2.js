"use js, vcl/ui/Node, vcl/ui/Input, vcl/ui/Tab, vcl/ui/Button";

const css = {
	'font-family': "Lucida Grande, Arial, sans-serif", 
	'font-size': "9pt",
	'.{Console}': {
		'.node > .container': "padding-top: 2px;",
		'.node': "padding-bottom: 2.4px;"
	},
	'.{Button}': {
		'font-size': "9pt",
		'font-family': "Lucida Grande, Arial, sans-serif",
		'vertical-align': "top",
		'&.disabled': "color:gray;",
		'&:not(:active)': "margin-bottom:4px;",
		'&:active': "margin-bottom:0;margin-top:2px;border:2px solid rgb(57,121,217); padding-left:8px; padding-right:6px;"// background:-webkit-linear-gradient(top, rgb(255, 255, 255) 10%, rgb(227, 227, 227) 100%);"
	}
};

[["./App.console.toast.glassy<>"], {
	vars: { canunload: true }
}, [
	
    [("vcl/Action"), "reload-app", {
    	hotkey: "Shift+MetaCtrl+R|Cmd+Alt+R",
    	on() { 
    		document.location.reload(); 
    	}
    }],
    
    [("#window"), { css: css }]
]];