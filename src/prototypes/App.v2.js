"use js";

[["./App.console.toast.glassy<>"], {
	vars: { canunload: true }
}, [
	
    [("vcl/Action"), "reload-app", {
    	hotkey: "Shift+MetaCtrl+R|Cmd+Alt+R",
    	on() { 
    		document.location.reload(); 
    	}
    }],
    
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
    }]
]];