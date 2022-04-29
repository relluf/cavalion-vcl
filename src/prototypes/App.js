"use vcl/ui/Node, vcl/ui/Button";

[("vcl/Application"), {
	
	onLoad() { 
		this._components[0].setParentNode(document.body); 
	}
	
}, [
    [("vcl/ui/Panel"), "window", { 
    	align: "client", classes: "animated",
    	css: {
			".{./Button}": {
				"font-family": "Lucida Grande, Arial, sans-serif",
				"font-size": "9pt"
			},
			// "font-family": "SF Pro Text, SF UI Text, system-ui, Helvetica Neue, Helvetica, Lucida Grande, Arial, sans-serif",
			"font-family": "Lucida Grande, Arial, sans-serif",
			"font-size": "9pt"
    	}
    }]
]];